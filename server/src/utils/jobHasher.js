import crypto from 'crypto';

export function normalizeText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates a deterministic content hash for deduplication
 */
export function generateJobContentHash(job) {
  const normTitle = normalizeText(job.title || '');
  const normCompany = normalizeText(job.companyName || '');
  const normCity = normalizeText(job.locationCity || '');
  const descSnippet = normalizeText((job.description || '').slice(0, 150));
  const sourceId = job.sourceId || '';
  const sourceJobId = job.sourceJobId || '';

  // Seed payload
  const payload = [
    normTitle,
    normCompany,
    normCity,
    sourceJobId || descSnippet,
  ].join('::');

  return crypto.createHash('sha256').update(payload).digest('hex').substring(0, 32);
}

/**
 * Checks if two jobs are likely duplicate postings across different boards
 */
export function isDuplicateJob(jobA, jobB) {
  // 1. Direct content hash or canonical URL match
  if (jobA.contentHash && jobB.contentHash && jobA.contentHash === jobB.contentHash) {
    return true;
  }
  if (
    jobA.canonicalJobUrl &&
    jobB.canonicalJobUrl &&
    jobA.canonicalJobUrl === jobB.canonicalJobUrl
  ) {
    return true;
  }

  // 2. Normalized company and title match with matching city
  const compA = normalizeText(jobA.companyName);
  const compB = normalizeText(jobB.companyName);
  const titleA = normalizeText(jobA.title);
  const titleB = normalizeText(jobB.title);
  const cityA = normalizeText(jobA.locationCity);
  const cityB = normalizeText(jobB.locationCity);

  if (compA === compB && titleA === titleB && (cityA === cityB || cityA.includes('remote') || cityB.includes('remote'))) {
    return true;
  }

  return false;
}
