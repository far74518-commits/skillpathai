import { generateJobContentHash } from '../../utils/jobHasher.js';

/**
 * Validates outbound URLs to prevent Server-Side Request Forgery (SSRF)
 * Blocks private IP ranges, loopback addresses, link-local addresses, and non-HTTP protocols.
 */
export function isSafeOutboundUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost, IPv6 loopbacks, and IPv4 loopback
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0') {
      return false;
    }

    // Block AWS metadata / link-local addresses
    if (hostname === '169.254.169.254' || hostname.startsWith('169.254.')) {
      return false;
    }

    // Block standard RFC 1918 private IPv4 ranges
    if (hostname.startsWith('10.') || hostname.startsWith('192.168.')) {
      return false;
    }
    if (hostname.startsWith('172.')) {
      const parts = hostname.split('.');
      const second = parseInt(parts[1], 10);
      if (second >= 16 && second <= 31) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Strips script tags, unsafe embeds, and HTML markup from incoming raw text
 */
export function sanitizeHtmlText(str) {
  if (!str) return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export class BaseJobConnector {
  constructor(sourceConfig) {
    this.sourceId = sourceConfig.sourceId;
    this.name = sourceConfig.name;
    this.baseUrl = sourceConfig.baseUrl;
    this.endpointUrl = sourceConfig.endpointUrl;
    this.sourceType = sourceConfig.sourceType || 'curated_feed';
    this.integrationMethod = sourceConfig.integrationMethod || 'Direct API/Feed Pipeline';
    this.timeoutMs = sourceConfig.timeoutMs || 8000;
    this.maxRetries = sourceConfig.maxRetries !== undefined ? sourceConfig.maxRetries : 2;
    this.retryDelayMs = sourceConfig.retryDelayMs || 1000;
    this.rateLimits = sourceConfig.rateLimits || { requestsPerMinute: 30 };
    this.lastRequestTimestamp = 0;
  }

  /**
   * Enforces rate limiting delay between network requests
   */
  async throttleRequest() {
    const minIntervalMs = Math.ceil(60000 / (this.rateLimits.requestsPerMinute || 30));
    const now = Date.now();
    const elapsed = now - this.lastRequestTimestamp;
    if (elapsed < minIntervalMs) {
      const waitTime = minIntervalMs - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.lastRequestTimestamp = Date.now();
  }

  /**
   * Safe fetch with SSRF verification, AbortController timeout, and error handling
   */
  async safeFetch(url, options = {}) {
    if (!isSafeOutboundUrl(url)) {
      throw new Error(`Outbound request blocked by SSRF security policy: ${url}`);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  /**
   * Executes network fetch with exponential backoff and retry handling
   */
  async executeWithRetry(fn) {
    let attempt = 0;
    let lastError = null;

    while (attempt <= this.maxRetries) {
      try {
        await this.throttleRequest();
        return await fn();
      } catch (err) {
        lastError = err;
        attempt++;
        if (attempt <= this.maxRetries) {
          const jitter = Math.floor(Math.random() * 200);
          const backoff = this.retryDelayMs * Math.pow(2, attempt - 1) + jitter;
          console.warn(`[${this.sourceId}] Request attempt ${attempt} failed: ${err.message}. Retrying in ${backoff}ms...`);
          await new Promise((resolve) => setTimeout(resolve, backoff));
        }
      }
    }
    throw lastError;
  }

  /**
   * Abstract method to fetch raw jobs from the source
   */
  async fetchRawJobs() {
    throw new Error('fetchRawJobs must be implemented by subclass');
  }

  /**
   * Abstract method to normalize raw items to standard Job schema
   */
  normalizeJob(rawItem) {
    throw new Error('normalizeJob must be implemented by subclass');
  }

  /**
   * Pipeline execution with error isolation, retries, and provenance tracking
   */
  async sync() {
    const startTime = Date.now();
    try {
      const rawItems = await this.executeWithRetry(() => this.fetchRawJobs());
      const normalizedJobs = [];

      for (const item of rawItems) {
        try {
          const job = this.normalizeJob(item);
          if (job && job.title && job.companyName && job.canonicalJobUrl) {
            job.sourceId = this.sourceId;
            job.sourceName = this.name;
            if (job.description) {
              job.description = sanitizeHtmlText(job.description);
            }
            if (!job.contentHash) {
              job.contentHash = generateJobContentHash(job);
            }

            // Provenance metadata
            job.dataProvenance = {
              connector: this.constructor.name,
              sourceType: this.sourceType,
              ingestionMethod: this.integrationMethod,
              fetchedAt: new Date(),
            };

            if (!job.verificationBadge) {
              job.verificationBadge = this.sourceType === 'api' || this.sourceType === 'rss_atom'
                ? 'source-verified'
                : 'employer-direct';
            }

            normalizedJobs.push(job);
          }
        } catch (itemErr) {
          console.warn(`[${this.sourceId}] Error normalizing item:`, itemErr.message);
        }
      }

      return {
        success: true,
        sourceId: this.sourceId,
        sourceName: this.name,
        jobs: normalizedJobs,
        count: normalizedJobs.length,
        durationMs: Date.now() - startTime,
        error: null,
      };
    } catch (err) {
      console.error(`[${this.sourceId}] Sync failed after ${this.maxRetries + 1} attempts:`, err.message);
      return {
        success: false,
        sourceId: this.sourceId,
        sourceName: this.name,
        jobs: [],
        count: 0,
        durationMs: Date.now() - startTime,
        error: err.message,
      };
    }
  }
}
