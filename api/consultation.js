/**
 * Vercel Serverless Function: POST /api/consultation
 * Receives consultation bookings from #consultForm and forwards them to
 * Adwin Realty's WhatsApp (+91 8686878887) via a configured WhatsApp API provider.
 *
 * Supported providers (configured purely via Vercel Environment Variables):
 *  - meta      : Official Meta WhatsApp Cloud API
 *  - twilio    : Twilio WhatsApp API
 *  - webhook   : Generic JSON webhook (AiSensy / Wati / Interakt / Make / Zapier / n8n)
 *  - callmebot : CallMeBot personal alert endpoint
 */

const DEFAULT_WHATSAPP_NUMBER = '918686878887';
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

// Meta template parameters disallow newlines, tabs, and >4 consecutive spaces.
function cleanTemplateParam(value, maxLen = 1000) {
  return cleanText(value, maxLen)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
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

function normalizePhoneDigits(value, fallback = DEFAULT_WHATSAPP_NUMBER) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits || fallback;
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

  const lines = [
    '*New Adwin Realty Consultation Request*',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Project / Interest: ${project}`,
    source ? `Source: ${source}` : null,
    `Notes: ${notes || 'None provided'}`,
    `Submitted: ${submittedAt}`
  ].filter(Boolean);

  return {
    valid: true,
    lead: { name, phone, email, project, notes, source, submittedAt },
    messageText: lines.join('\n')
  };
}

function resolveProvider(env = process.env) {
  const explicit = cleanText(env.WHATSAPP_PROVIDER, 40).toLowerCase();
  if (explicit) {
    if (['meta', 'twilio', 'webhook', 'callmebot'].includes(explicit)) {
      return explicit;
    }
    return null;
  }

  if (env.META_WA_ACCESS_TOKEN && env.META_WA_PHONE_NUMBER_ID) return 'meta';
  if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_WHATSAPP_FROM) return 'twilio';
  if (env.WHATSAPP_WEBHOOK_URL) return 'webhook';
  if (env.CALLMEBOT_API_KEY) return 'callmebot';
  return null;
}

async function sendViaMeta({ toDigits, lead, messageText, env = process.env, fetchImpl = fetch }) {
  const token = cleanText(env.META_WA_ACCESS_TOKEN, 512);
  const phoneNumberId = cleanText(env.META_WA_PHONE_NUMBER_ID, 64);
  if (!token || !phoneNumberId) {
    throw new Error('Missing META_WA_ACCESS_TOKEN or META_WA_PHONE_NUMBER_ID');
  }

  const apiVersion = cleanText(env.META_WA_API_VERSION, 20) || 'v25.0';
  const templateName = cleanText(env.META_WA_TEMPLATE_NAME, 128);
  const templateLang = cleanText(env.META_WA_TEMPLATE_LANG, 20) || 'en';
  const paramMode = cleanText(env.META_WA_TEMPLATE_PARAMS, 20).toLowerCase();

  let payload;
  if (templateName) {
    const parameters =
      paramMode === '1' || paramMode === 'summary'
        ? [
            {
              type: 'text',
              text: cleanTemplateParam(
                `${lead.name} | ${lead.phone} | ${lead.email} | ${lead.project}${lead.notes ? ' | ' + lead.notes : ''}`,
                1000
              )
            }
          ]
        : [
            { type: 'text', text: cleanTemplateParam(lead.name, 120) },
            { type: 'text', text: cleanTemplateParam(lead.phone, 30) },
            { type: 'text', text: cleanTemplateParam(lead.email, 160) },
            { type: 'text', text: cleanTemplateParam(lead.project, 140) },
            { type: 'text', text: cleanTemplateParam(lead.notes || 'None provided', 500) }
          ];

    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: toDigits,
      type: 'template',
      template: {
        name: templateName,
        language: { code: templateLang },
        components: [{ type: 'body', parameters }]
      }
    };
  } else {
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: toDigits,
      type: 'text',
      text: {
        preview_url: false,
        body: messageText
      }
    };
  }

  const response = await fetchImpl(
    `https://graph.facebook.com/${encodeURIComponent(apiVersion)}/${encodeURIComponent(phoneNumberId)}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errDetail = data && data.error && data.error.message ? data.error.message : `HTTP ${response.status}`;
    throw new Error(`Meta WhatsApp API error: ${errDetail}`);
  }

  return {
    provider: 'meta',
    messageId: data && Array.isArray(data.messages) && data.messages[0] ? data.messages[0].id : null
  };
}

function formatTwilioWhatsAppAddress(value) {
  const cleaned = cleanText(value, 40);
  if (cleaned.startsWith('whatsapp:')) return cleaned;
  const digits = cleaned.replace(/\D/g, '');
  return digits ? `whatsapp:+${digits}` : '';
}

async function sendViaTwilio({ toDigits, lead, messageText, env = process.env, fetchImpl = fetch }) {
  const sid = cleanText(env.TWILIO_ACCOUNT_SID, 80);
  const authToken = cleanText(env.TWILIO_AUTH_TOKEN, 128);
  const from = formatTwilioWhatsAppAddress(env.TWILIO_WHATSAPP_FROM);
  const contentSid = cleanText(env.TWILIO_CONTENT_SID, 80);

  if (!sid || !authToken || !from) {
    throw new Error('Missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_WHATSAPP_FROM');
  }

  const form = new URLSearchParams();
  form.set('To', `whatsapp:+${toDigits}`);
  form.set('From', from);

  if (contentSid) {
    form.set('ContentSid', contentSid);
    form.set(
      'ContentVariables',
      JSON.stringify({
        1: cleanTemplateParam(lead.name, 120),
        2: cleanTemplateParam(lead.phone, 30),
        3: cleanTemplateParam(lead.email, 160),
        4: cleanTemplateParam(lead.project, 140),
        5: cleanTemplateParam(lead.notes || 'None provided', 500)
      })
    );
  } else {
    form.set('Body', messageText);
  }

  const basicAuth = Buffer.from(`${sid}:${authToken}`).toString('base64');
  const response = await fetchImpl(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: form.toString(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errDetail = data && data.message ? data.message : `HTTP ${response.status}`;
    throw new Error(`Twilio WhatsApp API error: ${errDetail}`);
  }

  return {
    provider: 'twilio',
    messageId: data && data.sid ? data.sid : null
  };
}

async function sendViaWebhook({ toDigits, lead, messageText, env = process.env, fetchImpl = fetch }) {
  const url = cleanText(env.WHATSAPP_WEBHOOK_URL, 500);
  if (!url) {
    throw new Error('Missing WHATSAPP_WEBHOOK_URL');
  }

  const headers = { 'Content-Type': 'application/json' };
  const secret = cleanText(env.WHATSAPP_WEBHOOK_SECRET, 256);
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }

  const response = await fetchImpl(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      to: `+${toDigits}`,
      recipientDigits: toDigits,
      message: messageText,
      lead
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  });

  if (!response.ok) {
    throw new Error(`Webhook WhatsApp delivery failed: HTTP ${response.status}`);
  }

  const data = await response.json().catch(() => ({}));
  return {
    provider: 'webhook',
    messageId: (data && (data.id || data.messageId)) || null
  };
}

async function sendViaCallMeBot({ toDigits, messageText, env = process.env, fetchImpl = fetch }) {
  const apiKey = cleanText(env.CALLMEBOT_API_KEY, 128);
  if (!apiKey) {
    throw new Error('Missing CALLMEBOT_API_KEY');
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(toDigits)}&text=${encodeURIComponent(messageText)}&apikey=${encodeURIComponent(apiKey)}`;
  const response = await fetchImpl(url, {
    method: 'GET',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  });

  if (!response.ok) {
    throw new Error(`CallMeBot API error: HTTP ${response.status}`);
  }

  return { provider: 'callmebot', messageId: null };
}

async function dispatchWhatsApp({ provider, toDigits, lead, messageText, env = process.env, fetchImpl = fetch }) {
  switch (provider) {
    case 'meta':
      return sendViaMeta({ toDigits, lead, messageText, env, fetchImpl });
    case 'twilio':
      return sendViaTwilio({ toDigits, lead, messageText, env, fetchImpl });
    case 'webhook':
      return sendViaWebhook({ toDigits, lead, messageText, env, fetchImpl });
    case 'callmebot':
      return sendViaCallMeBot({ toDigits, messageText, env, fetchImpl });
    default:
      throw new Error(`Unsupported WhatsApp provider: ${provider}`);
  }
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

  const toDigits = normalizePhoneDigits(process.env.WHATSAPP_TO_NUMBER, DEFAULT_WHATSAPP_NUMBER);
  const whatsappUrl = `https://wa.me/${toDigits}?text=${encodeURIComponent(parsed.messageText)}`;
  const provider = resolveProvider(process.env);

  if (!provider) {
    console.info(
      '[consultation-lead:unconfigured]',
      JSON.stringify({ toDigits, ...parsed.lead })
    );
    return res.status(200).json({
      ok: true,
      delivered: false,
      configured: false,
      mode: 'whatsapp_fallback',
      whatsappUrl
    });
  }

  try {
    const result = await dispatchWhatsApp({
      provider,
      toDigits,
      lead: parsed.lead,
      messageText: parsed.messageText
    });

    console.info(
      '[consultation-lead:delivered]',
      JSON.stringify({
        provider: result.provider,
        messageId: result.messageId,
        project: parsed.lead.project,
        submittedAt: parsed.lead.submittedAt
      })
    );

    return res.status(200).json({
      ok: true,
      delivered: true,
      configured: true,
      provider: result.provider,
      messageId: result.messageId
    });
  } catch (err) {
    console.error('[consultation-lead:error]', err && err.message ? err.message : err);
    return res.status(502).json({
      ok: false,
      delivered: false,
      configured: true,
      provider,
      error: 'Automatic WhatsApp delivery failed. Please use the direct WhatsApp button below.',
      whatsappUrl
    });
  }
}

module.exports = handler;
module.exports.buildLeadPayload = buildLeadPayload;
module.exports.resolveProvider = resolveProvider;
module.exports.dispatchWhatsApp = dispatchWhatsApp;
module.exports.cleanTemplateParam = cleanTemplateParam;
