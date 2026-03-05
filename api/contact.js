// Vercel Serverless Function — Contact Form Submission
// Sends email via Resend if configured, otherwise stores and notifies

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://vonga.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, organization, role, intent, message, company, businessType } = req.body;

    // Support both main contact form and partner form schemas
    const orgName = organization || company || 'Not provided';
    const roleName = role || businessType || 'Not provided';
    const intentName = intent || 'Partner inquiry';
    const isPartner = !!businessType;

    // Validate required fields (name + email minimum)
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields (name and email)' });
    }

    // Format the notification
    const emoji = isPartner ? '🤝' : '🔥';
    const label = isPartner ? 'PARTNER INQUIRY' : 'DEMO REQUEST';
    const text = [
      `${emoji} NEW ${label} — vonga.io`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Organization: ${orgName}`,
      `Role: ${roleName}`,
      isPartner ? `Business Type: ${businessType}` : `Interest: ${intentName}`,
      message ? `Message: ${message}` : '',
      ``,
      `Submitted: ${new Date().toISOString()}`
    ].filter(Boolean).join('\n');

    // Try Resend if configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Vonga <notifications@vonga.io>',
          to: 'bill@vonga.io',
          subject: `${emoji} ${label}: ${name} @ ${orgName}`,
          text: text
        })
      });
    }

    // Also try Telegram notification if bot token is configured
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      }).catch(() => {}); // Don't fail if Telegram errors
    }

    // Log to Vercel function logs (always available)
    console.log('[DEMO_REQUEST]', JSON.stringify(req.body));

    return res.status(200).json({ 
      success: true, 
      message: 'Demo request received' 
    });

  } catch (error) {
    console.error('[CONTACT_ERROR]', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
