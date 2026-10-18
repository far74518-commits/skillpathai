import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

let transporter = null;

if (config.email.host && config.email.user) {
  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
}

export const emailService = {
  async sendPasswordResetEmail(toEmail, resetToken, userName = 'Student') {
    const resetUrl = `${config.clientUrl}/login?resetToken=${resetToken}`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; borderRadius: 8px;">
        <h2 style="color: #6366f1;">SkillPath AI Password Reset</h2>
        <p>Hello ${userName},</p>
        <p>You requested a password reset for your SkillPath AI account. Click the button below to reset your password:</p>
        <div style="margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Your Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 13px;">This link will expire in 1 hour. If you didn't request this reset, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">SkillPath AI — Intelligent Student Career Planner</p>
      </div>
    `;

    if (!transporter) {
      console.log(`[Email Service - Simulated] Password reset email for ${toEmail}:`);
      console.log(`  Reset URL: ${resetUrl}`);
      console.log(`  Token: ${resetToken}`);
      return { success: true, simulated: true };
    }

    try {
      const info = await transporter.sendMail({
        from: config.email.from,
        to: toEmail,
        subject: 'SkillPath AI - Password Reset Request',
        html: htmlContent,
      });
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[Email Service Error]', err.message);
      return { success: false, error: err.message };
    }
  },

  async sendWelcomeEmail(toEmail, userName) {
    if (!transporter) {
      console.log(`[Email Service - Simulated] Welcome email for ${toEmail} (${userName})`);
      return { success: true, simulated: true };
    }

    try {
      await transporter.sendMail({
        from: config.email.from,
        to: toEmail,
        subject: 'Welcome to SkillPath AI!',
        html: `<p>Welcome, ${userName}! Your personalized student career workspace is ready at ${config.clientUrl}.</p>`,
      });
      return { success: true };
    } catch (err) {
      console.warn('[Email Service Warning]', err.message);
      return { success: false };
    }
  },
};
