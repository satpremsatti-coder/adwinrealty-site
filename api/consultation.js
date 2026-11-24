/**
 * Vercel Serverless Function: POST /api/consultation
 * Receives consultation bookings from #consultForm and emails them directly
 * to the configured Gmail recipient (CONSULTATION_TO_EMAIL) via Gmail SMTP.
 *
 * Required Vercel Environment Variables:
 *  - GMAIL_USER            : Sender Gmail address (e.g. adwinalerts@gmail.com)
 *  - GMAIL_APP_PASSWORD    : 16-character Google App Password for GMAIL_USER
 *  - CONSULTATION_TO_EMAIL : Receiving Gmail address (defaults to GMAIL_USER if omitted)
 */

const nodemailer = require('nodemailer');

const REQUEST_TIMEOUT_MS = 10000;

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 64 * 1024) {
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === 'string') {
    return req.body.trim() ? JSON.parse(req.body) : {};
  }
  if (Buffer.isBuffer(req.body)) {
    const str = req.body.toString('utf8').trim();
    return str ? JSON.parse(str) : {};
  }
  const raw = await readRawBody(req);
  return raw.trim() ? JSON.parse(raw) : {};
}

function cleanText(value, maxLen) {
  return String(value == null ? '' : value).trim().slice(0, maxLen);
}

function cleanHeaderText(value, maxLen) {
  return cleanText(value, maxLen).replace(/[\r\n]+/g, ' ').trim();
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatIstTimestamp(date = new Date()) {
  try {
    return (
      new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      }).format(date) + ' IST'
    );
  } catch {
    return date.toISOString();
  }
}

function buildLeadPayload(body) {
  const name = cleanText(body.name, 120);
  const phone = cleanText(body.phone, 30);
  const email = cleanText(body.email, 160);
  const project = cleanText(body.project, 140) || 'General Consultation';
  const notes = cleanText(body.notes, 1000);
  const source = cleanText(body.source, 120) || 'Website Consultation Modal';
  const submittedAt = formatIstTimestamp();

  const errors = [];
  if (name.length < 2) errors.push('Please enter your name.');
  if (phone.replace(/\D/g, '').length < 7) errors.push('Please enter a valid phone number.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');

  if (errors.length) {
    return { valid: false, error: errors[0], errors };
  }

  const subject = cleanHeaderText(`New Consultation: ${name} — ${project}`, 200);
  const textBody = [
    'New Adwin Realty Consultation Request',
    '-------------------------------------',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Project / Interest: ${project}`,
    `Source: ${source}`,
    `Notes: ${notes || 'None provided'}`,
    `Submitted: ${submittedAt}`
  ].join('\n');

  const telHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const htmlBody = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #1248a8; color: #ffffff; padding: 18px 24px;">
        <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.85;">Adwin Realty Website</div>
        <h2 style="margin: 6px 0 0; font-size: 20px; font-weight: 700;">New Consultation Booking</h2>
      </div>
      <div style="padding: 20px 24px; background: #ffffff;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; width: 150px; vertical-align: top;"><strong>Name</strong></td>
            <td style="padding: 8px 0;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Phone</strong></td>
            <td style="padding: 8px 0;"><a href="${escapeHtml(telHref)}" style="color: #1248a8; font-weight: 700; text-decoration: none;">${escapeHtml(phone)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Email</strong></td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #1248a8; text-decoration: none;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Project / Interest</strong></td>
            <td style="padding: 8px 0;"><strong>${escapeHtml(project)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Booked From</strong></td>
            <td style="padding: 8px 0;">${escapeHtml(source)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Notes</strong></td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${escapeHtml(notes || 'None provided')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Submitted</strong></td>
            <td style="padding: 8px 0; color: #475569;">${escapeHtml(submittedAt)}</td>
          </tr>
        </table>
      </div>
    </div>
  `.trim();

  return {
    valid: true,
    lead: { name, phone, email, project, notes, source, submittedAt },
    subject,
    textBody,
    htmlBody
  };
}

function getEmailConfig(env = process.env) {
  const gmailUser = cleanHeaderText(env.GMAIL_USER, 160);
  const gmailAppPassword = cleanText(env.GMAIL_APP_PASSWORD, 128).replace(/\s+/g, '');
  const toEmail = cleanHeaderText(env.CONSULTATION_TO_EMAIL, 320) || gmailUser;
  const smtpHost = cleanHeaderText(env.SMTP_HOST, 160) || 'smtp.gmail.com';
  const smtpPort = Number(env.SMTP_PORT || 465);
  const smtpSecure = env.SMTP_SECURE ? env.SMTP_SECURE !== 'false' : smtpPort === 465;

  return {
    configured: Boolean(gmailUser && gmailAppPassword && toEmail),
    gmailUser,
    gmailAppPassword,
    toEmail,
    smtpHost,
    smtpPort,
    smtpSecure
  };
}

function createGmailTransporter(config) {
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.gmailUser,
      pass: config.gmailAppPassword
    },
    connectionTimeout: REQUEST_TIMEOUT_MS,
    greetingTimeout: REQUEST_TIMEOUT_MS,
    socketTimeout: REQUEST_TIMEOUT_MS
  });
}

async function sendConsultationEmail({ parsed, env = process.env, transporterOverride = null }) {
  const config = getEmailConfig(env);
  if (!config.configured) {
    throw new Error('Email settings are not configured yet.');
  }

  const transporter = transporterOverride || createGmailTransporter(config);
  const safeReplyName = cleanHeaderText(parsed.lead.name, 100).replace(/"/g, '');
  const replyTo = safeReplyName ? `"${safeReplyName}" <${parsed.lead.email}>` : parsed.lead.email;

  const info = await transporter.sendMail({
    from: `"Adwin Realty Website" <${config.gmailUser}>`,
    to: config.toEmail,
    replyTo,
    subject: parsed.subject,
    text: parsed.textBody,
    html: parsed.htmlBody
  });

  return {
    messageId: info && info.messageId ? info.messageId : null,
    toEmail: config.toEmail
  };
}

async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body;
  try {
    body = await parseJsonBody(req);
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid request payload.' });
  }

  const parsed = buildLeadPayload(body);
  if (!parsed.valid) {
    return res.status(400).json({ ok: false, error: parsed.error });
  }

  const config = getEmailConfig(process.env);
  const mailtoUrl = config.toEmail
    ? `mailto:${encodeURIComponent(config.toEmail)}?subject=${encodeURIComponent(parsed.subject)}&body=${encodeURIComponent(parsed.textBody)}`
    : null;

  if (!config.configured) {
    console.info(
      '[consultation-lead:email-unconfigured]',
      JSON.stringify(parsed.lead)
    );
    return res.status(200).json({
      ok: true,
      delivered: false,
      configured: false,
      ...(mailtoUrl ? { mailtoUrl } : {})
    });
  }

  try {
    const result = await sendConsultationEmail({ parsed });
    console.info(
      '[consultation-lead:emailed]',
      JSON.stringify({
        messageId: result.messageId,
        project: parsed.lead.project,
        submittedAt: parsed.lead.submittedAt
      })
    );

    return res.status(200).json({
      ok: true,
      delivered: true,
      configured: true,
      messageId: result.messageId
    });
  } catch (err) {
    console.error('[consultation-lead:email-error]', err && err.message ? err.message : err);
    return res.status(502).json({
      ok: false,
      delivered: false,
      configured: true,
      error: 'Automatic email delivery failed. Please call +91 8686878887 or use your email app.',
      ...(mailtoUrl ? { mailtoUrl } : {})
    });
  }
}

module.exports = handler;
module.exports.buildLeadPayload = buildLeadPayload;
module.exports.getEmailConfig = getEmailConfig;
module.exports.sendConsultationEmail = sendConsultationEmail;
module.exports.escapeHtml = escapeHtml;
