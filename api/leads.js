// Vercel Serverless Function — Lead Capture
// Writes leads from chatbot + contact forms to Supabase leads table
// Sends Telegram notification to Bob + email to Bill

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://vonga.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      name,
      email,
      organization,
      role,
      message,
      source,       // 'chatbot' | 'contact_form' | 'partner_form'
      intent,       // 'demo' | 'pricing' | 'partner' | 'sponsor' | 'general'
      icp_path,     // 'team' | 'sponsor' | 'partner' (from ICP chooser GA4)
      visitor_id    // localStorage visitor ID from chatbot
    } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const lead = {
      name: name || null,
      email: email.toLowerCase().trim(),
      organization: organization || null,
      role: role || null,
      message: message || null,
      source: source || 'website',
      intent: intent || 'general',
      icp_path: icp_path || null,
      visitor_id: visitor_id || null,
      created_at: new Date().toISOString(),
      status: 'new'
    };

    // Write to Supabase leads table
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const dbResponse = await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(lead)
      });

      if (!dbResponse.ok) {
        const err = await dbResponse.text();
        console.error('[LEADS_DB_ERROR]', err);
        // Don't fail the request — still send notifications
      }
    }

    // Build notification message
    const sourceLabel = {
      chatbot: '🤖 CHATBOT LEAD',
      contact_form: '📋 CONTACT FORM',
      partner_form: '🤝 PARTNER INQUIRY'
    }[source] || '🔔 NEW LEAD';

    const intentLabel = {
      demo: 'Demo Request',
      pricing: 'Pricing Inquiry',
      partner: 'Partner Program',
      sponsor: 'Sponsor ROI',
      general: 'General Inquiry'
    }[intent] || 'General';

    const notificationText = [
      `${sourceLabel} — vonga.io`,
      ``,
      name ? `Name: ${name}` : null,
      `Email: ${email}`,
      organization ? `Org: ${organization}` : null,
      role ? `Role: ${role}` : null,
      `Intent: ${intentLabel}`,
      message ? `Message: ${message}` : null,
      ``,
      `Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/Indiana/Indianapolis' })} ET`
    ].filter(Boolean).join('\n');

    // Telegram notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: notificationText
        })
      }).catch(e => console.error('[TELEGRAM_ERROR]', e));
    }

    // Email notification via Resend
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
          subject: `${sourceLabel}: ${name || email} @ ${organization || 'Unknown'}`,
          text: notificationText
        })
      }).catch(e => console.error('[RESEND_ERROR]', e));
    }

    console.log('[LEAD_CAPTURED]', JSON.stringify({ email, source, intent }));

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('[LEADS_ERROR]', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
