/**
 * RB2B Webhook Receiver — Vercel Serverless Function
 * 
 * Receives visitor identification data from RB2B,
 * stores it, and sends Telegram alert for ICP matches.
 */

const ICP_KEYWORDS = [
  'sport', 'team', 'stadium', 'arena', 'athletic', 'nfl', 'nba', 'nhl', 'mlb', 'mls',
  'football', 'basketball', 'hockey', 'baseball', 'soccer', 'racing', 'motorsport',
  'entertainment', 'venue', 'concert', 'event', 'sponsor', 'partnership', 'marketing',
  'fan engagement', 'merchandise', 'merch', 'apparel', 'university', 'college',
  'conference', 'league', 'club', 'ticketing', 'activation', 'brand'
];

function matchesICP(visitor) {
  const text = [
    visitor.company_name || '',
    visitor.company_industry || '',
    visitor.title || '',
    visitor.sub_industry || '',
    visitor.linkedin_url || ''
  ].join(' ').toLowerCase();
  return ICP_KEYWORDS.some(kw => text.includes(kw));
}

async function sendTelegram(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;
  
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    })
  });
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'rb2b-webhook' });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const visitor = req.body;
    
    const name = `${visitor.first_name || ''} ${visitor.last_name || ''}`.trim() || 'Unknown';
    const company = visitor.company_name || 'Unknown';
    const title = visitor.title || '';
    const linkedin = visitor.linkedin_url || '';
    const email = visitor.email || '';
    const page = visitor.page_url || '';
    const city = visitor.city || '';
    const state = visitor.state || '';
    const isICP = matchesICP(visitor);

    // Log to Vercel (visible in function logs)
    console.log(`RB2B: ${name} | ${title} @ ${company} | ${page} | ICP: ${isICP}`);

    // Forward to our webhook relay (Mac Mini polls this)
    // Store in KV or just alert directly
    if (isICP || email) {
      const location = [city, state].filter(Boolean).join(', ');
      let msg = `🔍 <b>Website Visitor Identified</b>\n\n`;
      msg += `<b>${name}</b>`;
      if (title) msg += `\n${title}`;
      msg += `\n${company}`;
      if (location) msg += `\n📍 ${location}`;
      if (visitor.company_industry) msg += `\nIndustry: ${visitor.company_industry}`;
      msg += `\n\n📄 Viewed: ${page}`;
      if (linkedin) msg += `\n🔗 ${linkedin}`;
      if (email) msg += `\n📧 ${email}`;
      if (isICP) msg += `\n\n🎯 <b>ICP MATCH</b> — target profile for outreach`;
      
      await sendTelegram(msg);
    }

    return res.status(200).json({ status: 'ok', icp: isICP });
  } catch (e) {
    console.error('RB2B webhook error:', e);
    return res.status(400).json({ error: e.message });
  }
}
