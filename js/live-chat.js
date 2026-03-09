/**
 * Vonga Live Chat Widget — Rebuilt CHAT-1 (Mar 8, 2026)
 *
 * - Correct pricing from PRICING-REFERENCE.md
 * - Lead capture via /api/leads (Supabase + Telegram notification)
 * - No localhost backends
 * - Keyword routing with accurate claims only
 * - Fact-checked against CLAIMS-DATABASE.md
 */

(function () {
  // ── Config ──────────────────────────────────────────────────────────────────
  const LEAD_API = '/api/leads';
  const CHAT_DELAY_MS = 800; // Simulates "typing" before response

  // ── State ──────────────────────────────────────────────────────────────────
  let isOpen = false;
  let chatHistory = [];
  let awaitingEmail = false;
  let capturedName = null;
  let capturedOrg = null;
  const visitorId = getOrCreateVisitorId();

  function getOrCreateVisitorId() {
    let id = localStorage.getItem('vonga_visitor_id');
    if (!id) {
      id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('vonga_visitor_id', id);
    }
    return id;
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const styles = `
    #vonga-chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .vonga-chat-button {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #33BECC;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(51, 190, 204, 0.4);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      border: none;
    }
    .vonga-chat-button:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(51, 190, 204, 0.55);
    }
    .vonga-chat-window {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 360px;
      max-height: 520px;
      background: #1a1f2e;
      border: 1px solid rgba(51, 190, 204, 0.2);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      display: none;
      flex-direction: column;
      overflow: hidden;
    }
    .vonga-chat-window.open {
      display: flex;
    }
    .vonga-chat-header {
      background: #232f42;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .vonga-chat-title {
      font-weight: 700;
      color: white;
      font-size: 15px;
    }
    .vonga-chat-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #8892A4;
      margin-top: 3px;
    }
    .vonga-status-dot {
      width: 7px;
      height: 7px;
      background: #33BECC;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .vonga-chat-close {
      background: none;
      border: none;
      color: #8892A4;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    .vonga-chat-close:hover { color: white; }
    .vonga-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .vonga-msg {
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }
    .vonga-msg.user {
      flex-direction: row-reverse;
    }
    .vonga-msg-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #33BECC;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }
    .vonga-msg.user .vonga-msg-avatar {
      background: #303E55;
    }
    .vonga-msg-bubble {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      color: #e2e8f0;
      background: #232f42;
    }
    .vonga-msg.user .vonga-msg-bubble {
      background: #33BECC;
      color: #0f1729;
    }
    .vonga-msg-bubble a {
      color: #33BECC;
      text-decoration: none;
    }
    .vonga-msg.user .vonga-msg-bubble a {
      color: #0f1729;
      text-decoration: underline;
    }
    .vonga-msg-bubble ul {
      padding-left: 16px;
      margin: 6px 0 0;
    }
    .vonga-msg-bubble li {
      margin-bottom: 3px;
    }
    .vonga-typing {
      display: flex;
      gap: 4px;
      padding: 12px 14px;
      background: #232f42;
      border-radius: 12px;
      width: fit-content;
    }
    .vonga-typing span {
      width: 7px;
      height: 7px;
      background: #8892A4;
      border-radius: 50%;
      animation: typing-bounce 1.2s infinite;
    }
    .vonga-typing span:nth-child(2) { animation-delay: 0.2s; }
    .vonga-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }
    .vonga-quick-replies {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 16px 10px;
    }
    .vonga-quick-reply {
      background: rgba(51, 190, 204, 0.1);
      border: 1px solid rgba(51, 190, 204, 0.3);
      color: #33BECC;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .vonga-quick-reply:hover {
      background: rgba(51, 190, 204, 0.2);
    }
    .vonga-chat-input-row {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .vonga-chat-input {
      flex: 1;
      background: #232f42;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      padding: 9px 12px;
      font-size: 14px;
      color: white;
      outline: none;
    }
    .vonga-chat-input:focus {
      border-color: #33BECC;
    }
    .vonga-chat-input::placeholder { color: #8892A4; }
    .vonga-chat-send {
      background: #33BECC;
      color: #0f1729;
      border: none;
      border-radius: 8px;
      padding: 9px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    .vonga-chat-send:hover { background: #2aabb8; }
    @media (max-width: 480px) {
      #vonga-chat-widget { bottom: 16px; right: 16px; }
      .vonga-chat-window { width: calc(100vw - 32px); right: 0; }
    }
  `;

  // ── DOM Setup ───────────────────────────────────────────────────────────────
  function init() {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const widget = document.createElement('div');
    widget.id = 'vonga-chat-widget';
    widget.innerHTML = `
      <div class="vonga-chat-window" id="vonga-chat-window">
        <div class="vonga-chat-header">
          <div>
            <div class="vonga-chat-title">Chat with Vonga</div>
            <div class="vonga-chat-status">
              <span class="vonga-status-dot"></span>
              Typically replies quickly
            </div>
          </div>
          <button class="vonga-chat-close" id="vonga-chat-close">✕</button>
        </div>
        <div class="vonga-chat-messages" id="vonga-chat-messages"></div>
        <div class="vonga-quick-replies" id="vonga-quick-replies"></div>
        <div class="vonga-chat-input-row">
          <input type="text" class="vonga-chat-input" id="vonga-chat-input" placeholder="Type your message..." maxlength="500" />
          <button class="vonga-chat-send" id="vonga-chat-send">Send</button>
        </div>
      </div>
      <button class="vonga-chat-button" id="vonga-chat-button" aria-label="Open chat">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
    `;
    document.body.appendChild(widget);

    document.getElementById('vonga-chat-button').addEventListener('click', toggleChat);
    document.getElementById('vonga-chat-close').addEventListener('click', closeChat);
    document.getElementById('vonga-chat-send').addEventListener('click', handleSend);
    document.getElementById('vonga-chat-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSend();
    });

    // Show welcome after short delay
    setTimeout(showWelcome, 500);
  }

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  function openChat() {
    isOpen = true;
    document.getElementById('vonga-chat-window').classList.add('open');
    document.getElementById('vonga-chat-input').focus();
  }

  function closeChat() {
    isOpen = false;
    document.getElementById('vonga-chat-window').classList.remove('open');
  }

  // ── Messages ────────────────────────────────────────────────────────────────
  function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'vonga-msg' + (isUser ? ' user' : '');
    msgDiv.innerHTML = `
      <div class="vonga-msg-avatar">${isUser ? 'You' : 'V'}</div>
      <div class="vonga-msg-bubble">${text}</div>
    `;
    document.getElementById('vonga-chat-messages').appendChild(msgDiv);
    scrollToBottom();
  }

  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'vonga-msg';
    typingDiv.id = 'vonga-typing-indicator';
    typingDiv.innerHTML = `
      <div class="vonga-msg-avatar">V</div>
      <div class="vonga-typing"><span></span><span></span><span></span></div>
    `;
    document.getElementById('vonga-chat-messages').appendChild(typingDiv);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById('vonga-typing-indicator');
    if (el) el.remove();
  }

  function botReply(text, quickReplies = []) {
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMessage(text);
      setQuickReplies(quickReplies);
    }, CHAT_DELAY_MS);
  }

  function setQuickReplies(replies) {
    const container = document.getElementById('vonga-quick-replies');
    container.innerHTML = '';
    replies.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'vonga-quick-reply';
      btn.textContent = r;
      btn.addEventListener('click', () => {
        container.innerHTML = '';
        addMessage(r, true);
        processInput(r);
      });
      container.appendChild(btn);
    });
  }

  function scrollToBottom() {
    const msgs = document.getElementById('vonga-chat-messages');
    msgs.scrollTop = msgs.scrollHeight;
  }

  // ── Welcome ──────────────────────────────────────────────────────────────────
  function showWelcome() {
    addMessage('Hey! 👋 I\'m here to answer questions about Vonga.\n\nAsk me anything — pricing, how it works, scheduling a demo.');
    setQuickReplies(['What\'s the pricing?', 'How does it work?', 'Can I see a demo?', 'I\'m a sponsor']);
  }

  // ── Input handling ──────────────────────────────────────────────────────────
  function handleSend() {
    const input = document.getElementById('vonga-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMessage(text, true);
    setQuickReplies([]);

    if (awaitingEmail) {
      handleEmailCapture(text);
    } else {
      processInput(text);
    }
  }

  function processInput(text) {
    const msg = text.toLowerCase();

    // Email detection
    if (msg.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/)) {
      handleEmailCapture(text);
      return;
    }

    // Pricing / cost
    if (msg.match(/price|cost|pricing|how much|subscription|monthly|tier|plan/)) {
      botReply(
        'Our pricing:\n\n' +
        '<b>90-Day Pilot</b>\n' +
        '• <b>$499/mo</b> — smaller programs (USL, D-II/III, community)\n' +
        '• <b>$999/mo</b> — major pro leagues + top-flight European\n\n' +
        '<b>Full Subscriptions (post-pilot)</b>\n' +
        '• Starter: $999/mo\n' +
        '• Growth: $2,499/mo\n' +
        '• Playbook: $4,999/mo\n' +
        '• Enterprise: Custom ($7,500+/mo)\n\n' +
        'Annual plans save ~15%. NFC tags are priced separately at cost.<br>' +
        '<a href="/pricing.html">See full pricing →</a>',
        ['Book a demo', 'How does it work?', 'What\'s included?']
      );
      return;
    }

    // How it works / NFC
    if (msg.match(/how.*(it works?|does it work|work|nfc)|nfc|tap|chip|technology|rfid/)) {
      botReply(
        'Here\'s the quick version:\n\n' +
        '1. <b>NFC chips embed in your merch</b> — jerseys, hats, hoodies, anything your fans already wear\n' +
        '2. <b>Fan taps → experience unlocks</b> — no app download needed, works on every modern phone\n' +
        '3. <b>Data flows automatically</b> — fan profile builds with every tap\n' +
        '4. <b>Dashboard shows everything</b> — sponsor ROI, fan behavior, engagement trends\n\n' +
        'The fan experience goes from tap to content in under 2 seconds.\n' +
        '<a href="/how-it-works.html">Full walkthrough →</a>',
        ['What\'s the pricing?', 'Can I see a demo?']
      );
      return;
    }

    // Demo request
    if (msg.match(/demo|book|schedule|meet|call|see it|show me/)) {
      botReply(
        'We\'d love to show you the platform. <a href="/contact.html">Book a 20-minute demo →</a>\n\n' +
        'Or drop your email here and someone will reach out to schedule:',
        []
      );
      awaitingEmail = true;
      return;
    }

    // Sponsor
    if (msg.match(/sponsor|roi|return on investment|attribution|impressions|media value/)) {
      botReply(
        'Great question. Vonga helps you prove sponsor ROI with actual data — not estimated impressions.\n\n' +
        '• Real engagement counts per activation\n' +
        '• Fan profile data tied to sponsor content\n' +
        '• Automated weekly/monthly reports\n' +
        '• Sponsor self-serve portal (they can log in and see their own data)\n\n' +
        '<a href="/sponsor-roi.html">See the Sponsor ROI story →</a>',
        ['What\'s the pricing?', 'Book a demo']
      );
      return;
    }

    // Partner / merch supplier
    if (msg.match(/partner|supplier|manufacturer|supply|distribute|merch provider/)) {
      botReply(
        'Vonga partners with merch manufacturers and distributors to add intelligence to existing product lines.\n\n' +
        'You keep making the same products. We add the NFC layer — your clients get smarter merch, you add a differentiator.\n\n' +
        '<a href="/partner.html">Partner program details →</a>',
        ['What\'s the pricing?', 'Book a demo']
      );
      return;
    }

    // Fan data / GDPR / privacy
    if (msg.match(/data|gdpr|privacy|fan data|collect|personal|eu|europe/)) {
      botReply(
        'Data ownership is clear: <b>you own your fans\' data.</b> Vonga processes it on your behalf.\n\n' +
        '• Fans can request deletion at any time\n' +
        '• GDPR compliant (we work with EU teams)\n' +
        '• Each team\'s data is isolated — no cross-tenant access\n' +
        '• We don\'t sell data to anyone\n\n' +
        '<a href="/privacy.html">Privacy Policy →</a>',
        ['What\'s the pricing?', 'Book a demo']
      );
      return;
    }

    // Integration / CRM
    if (msg.match(/integrat|crm|salesforce|hubspot|zapier|api|webhook|connect/)) {
      botReply(
        'Vonga connects with your existing stack:\n\n' +
        '• Webhooks for real-time data (any CRM)\n' +
        '• Zapier templates for Salesforce, HubSpot, SeatGeek\n' +
        '• REST API for custom integrations\n' +
        '• 24 integration cards in our dashboard\n\n' +
        'Want to talk through a specific integration? <a href="/contact.html">Book a call →</a>',
        ['Book a demo', 'What\'s the pricing?']
      );
      return;
    }

    // What's included / features
    if (msg.match(/includ|feature|what do.*(get|i get)|platform|dashboard/)) {
      botReply(
        'Every plan includes:\n\n' +
        '• Fan profiles built automatically from tap events\n' +
        '• Real-time dashboard (engagement, sponsors, fan behavior)\n' +
        '• Sponsor portal with self-serve ROI data\n' +
        '• A/B testing for fan experiences\n' +
        '• Automated weekly insights\n' +
        '• NFC-enabled content delivery (no app needed)\n' +
        '• Webhooks + API access\n\n' +
        '<a href="/platform.html">Full platform overview →</a>',
        ['What\'s the pricing?', 'Book a demo']
      );
      return;
    }

    // Fallback
    botReply(
      'Good question! For the best answer, I\'d recommend booking a quick 20-minute demo — we can walk through exactly how it applies to your situation.\n\n' +
      '<a href="/contact.html">Book a demo →</a>\n\n' +
      'Or drop your email and we\'ll reach out:',
      ['What\'s the pricing?', 'How does it work?']
    );
    awaitingEmail = true;
  }

  // ── Lead Capture ────────────────────────────────────────────────────────────
  async function handleEmailCapture(text) {
    awaitingEmail = false;
    const emailMatch = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    const email = emailMatch ? emailMatch[0] : text;

    botReply('Got it! Someone from our team will be in touch soon. In the meantime, you can book a time directly:<br><a href="/contact.html">→ Pick a time on the calendar</a>');

    // Fire lead capture
    try {
      await fetch(LEAD_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: capturedName,
          organization: capturedOrg,
          source: 'chatbot',
          intent: 'demo',
          visitor_id: visitorId
        })
      });
    } catch (e) {
      // Silent fail — user experience unaffected
      console.error('[CHAT_LEAD_ERROR]', e);
    }

    // GA4 event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'chat_lead_captured', { email_domain: email.split('@')[1] });
    }
  }

  // ── Boot ────────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
