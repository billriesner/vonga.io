/**
 * Vonga Live Chat Widget
 * Routes chat messages to Bob via Telegram for real-time response
 */

class VongaChat {
    constructor() {
        this.isOpen = false;
        this.chatHistory = [];
        this.visitorId = this.getOrCreateVisitorId();
        this.init();
    }

    getOrCreateVisitorId() {
        let id = localStorage.getItem('vonga_visitor_id');
        if (!id) {
            id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('vonga_visitor_id', id);
        }
        return id;
    }

    init() {
        // Create chat widget HTML
        const chatHTML = `
            <div id="vonga-chat-widget">
                <div id="vonga-chat-button" class="vonga-chat-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
                    </svg>
                    <span class="vonga-chat-badge">💬</span>
                </div>
                
                <div id="vonga-chat-window" class="vonga-chat-window">
                    <div class="vonga-chat-header">
                        <div>
                            <div class="vonga-chat-title">Chat with Vonga</div>
                            <div class="vonga-chat-status">
                                <span class="vonga-status-dot"></span>
                                Typically replies in minutes
                            </div>
                        </div>
                        <button id="vonga-chat-close" class="vonga-chat-close">✕</button>
                    </div>
                    
                    <div id="vonga-chat-messages" class="vonga-chat-messages">
                        <div class="vonga-message vonga-message-bot">
                            <div class="vonga-message-avatar">V</div>
                            <div class="vonga-message-content">
                                <p>Hey! 👋 Have questions about Vonga?</p>
                                <p>Ask me anything:</p>
                                <ul>
                                    <li>How does NFC work?</li>
                                    <li>What's the pricing?</li>
                                    <li>Can I see a demo?</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="vonga-chat-input-wrapper">
                        <input 
                            type="text" 
                            id="vonga-chat-input" 
                            class="vonga-chat-input" 
                            placeholder="Type your message..."
                            maxlength="500"
                        />
                        <button id="vonga-chat-send" class="vonga-chat-send">Send</button>
                    </div>
                </div>
            </div>
        `;

        // Inject styles
        const styles = `
            <style>
                #vonga-chat-widget {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                
                .vonga-chat-button {
                    width: 60px;
                    height: 60px;
                    border-radius: 30px;
                    background: linear-gradient(135deg, #33BECC 0%, #F5856E 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    transition: transform 0.2s;
                    position: relative;
                }
                
                .vonga-chat-button:hover {
                    transform: scale(1.05);
                }
                
                .vonga-chat-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    font-size: 20px;
                }
                
                .vonga-chat-window {
                    display: none;
                    width: 380px;
                    height: 600px;
                    max-height: calc(100vh - 40px);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    flex-direction: column;
                    overflow: hidden;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
                
                .vonga-chat-window.open {
                    display: flex;
                }
                
                .vonga-chat-header {
                    background: linear-gradient(135deg, #33BECC 0%, #F5856E 100%);
                    color: white;
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .vonga-chat-title {
                    font-weight: 600;
                    font-size: 16px;
                }
                
                .vonga-chat-status {
                    font-size: 12px;
                    margin-top: 4px;
                    opacity: 0.9;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .vonga-status-dot {
                    width: 8px;
                    height: 8px;
                    background: #4ade80;
                    border-radius: 50%;
                    display: inline-block;
                }
                
                .vonga-chat-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .vonga-chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    background: #f9fafb;
                }
                
                .vonga-message {
                    margin-bottom: 16px;
                    display: flex;
                    gap: 8px;
                }
                
                .vonga-message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #33BECC;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    flex-shrink: 0;
                }
                
                .vonga-message-content {
                    background: white;
                    padding: 12px;
                    border-radius: 12px;
                    max-width: 80%;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                .vonga-message-content p {
                    margin: 0 0 8px 0;
                }
                
                .vonga-message-content p:last-child {
                    margin-bottom: 0;
                }
                
                .vonga-message-content ul {
                    margin: 8px 0 0 0;
                    padding-left: 20px;
                    font-size: 14px;
                    color: #666;
                }
                
                .vonga-message-content li {
                    margin: 4px 0;
                }
                
                .vonga-message-user {
                    flex-direction: row-reverse;
                }
                
                .vonga-message-user .vonga-message-avatar {
                    background: #F5856E;
                }
                
                .vonga-message-user .vonga-message-content {
                    background: #33BECC;
                    color: white;
                }
                
                .vonga-chat-input-wrapper {
                    padding: 16px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    gap: 8px;
                }
                
                .vonga-chat-input {
                    flex: 1;
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 14px;
                    outline: none;
                }
                
                .vonga-chat-input:focus {
                    border-color: #33BECC;
                }
                
                .vonga-chat-send {
                    padding: 12px 20px;
                    background: #33BECC;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                }
                
                .vonga-chat-send:hover {
                    background: #2aa8b8;
                }
                
                .vonga-chat-send:disabled {
                    background: #d1d5db;
                    cursor: not-allowed;
                }
                
                @media (max-width: 480px) {
                    .vonga-chat-window {
                        width: calc(100vw - 40px);
                        height: calc(100vh - 40px);
                        max-height: calc(100vh - 40px);
                    }
                }
            </style>
        `;

        // Inject HTML and styles
        document.body.insertAdjacentHTML('beforeend', styles);
        document.body.insertAdjacentHTML('beforeend', chatHTML);

        // Bind events
        this.bindEvents();

        // Load chat history
        this.loadHistory();
    }

    bindEvents() {
        const button = document.getElementById('vonga-chat-button');
        const closeBtn = document.getElementById('vonga-chat-close');
        const sendBtn = document.getElementById('vonga-chat-send');
        const input = document.getElementById('vonga-chat-input');

        button.addEventListener('click', () => this.toggleChat());
        closeBtn.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const window = document.getElementById('vonga-chat-window');
        const button = document.getElementById('vonga-chat-button');
        
        if (this.isOpen) {
            window.classList.add('open');
            button.style.display = 'none';
            document.getElementById('vonga-chat-input').focus();
        } else {
            window.classList.remove('open');
            button.style.display = 'flex';
        }
    }

    async sendMessage() {
        const input = document.getElementById('vonga-chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Display user message
        this.addMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTyping();

        // Send to backend (which will route to Telegram)
        try {
            await this.sendToBackend(message);
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTyping();
            this.addMessage('Sorry, there was an error. Please try refreshing or emailing hello@vonga.com', 'bot');
        }
    }

    async sendToBackend(message) {
        // Log for tracking
        console.log('[CHAT MESSAGE]', {
            visitorId: this.visitorId,
            message,
            timestamp: new Date().toISOString(),
            page: window.location.href,
            userData: this.getVisitorContext()
        });

        // Store locally
        this.chatHistory.push({
            type: 'user',
            message,
            timestamp: new Date().toISOString()
        });
        this.saveHistory();

        // Get AI response
        const response = await this.getAIResponse(message);
        
        setTimeout(async () => {
            this.hideTyping();
            this.addMessage(response.message, 'bot');
            
            // If escalation needed, send notification
            if (response.escalate) {
                console.log('[CHAT ESCALATION]', {
                    visitorId: this.visitorId,
                    message,
                    reason: response.escalateReason
                });
                
                try {
                    await fetch('http://localhost:3001/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: 'chat',
                            visitorId: this.visitorId,
                            userMessage: message,
                            botResponse: response.message,
                            escalateReason: response.escalateReason,
                            timestamp: new Date().toISOString(),
                            page: window.location.href
                        })
                    });
                    console.log('[CHAT ESCALATION] Notification sent');
                } catch (error) {
                    console.error('[CHAT ESCALATION] Failed to send notification:', error);
                }
            }
        }, 1000 + Math.random() * 1000); // Random delay 1-2 seconds
    }

    async getAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Pricing questions
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
            return {
                message: `Our pricing is based on program size:\n\n• Starter: $995/month (up to 5,000 garments)\n• Professional: $2,495/month (up to 25,000 garments)\n• Enterprise: Custom pricing (unlimited scale)\n\nAnnual plans save ~17%. Want me to send you detailed pricing?`,
                escalate: false
            };
        }
        
        // How it works / NFC questions
        if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('nfc'))) {
            return {
                message: `Vonga embeds NFC chips in premium apparel. Fans tap their phone to the shirt (no app needed!) and get instant access to exclusive content—videos, messages, experiences you create.\n\nYou get real-time analytics: who tapped, when, where, and what they engaged with. 40-60% of fans typically tap.\n\nWant to see a live demo?`,
                escalate: false
            };
        }
        
        // ROI / Results questions
        if (lowerMessage.includes('roi') || lowerMessage.includes('result') || lowerMessage.includes('work')) {
            return {
                message: `Industry research shows NFC engagement rates of 8-12% — 3-5x higher than QR codes. And because it's built into apparel fans already wear, engagement continues well beyond game day.\n\nWe're launching our first pilots now. Want to explore what a pilot could look like for your program?`,
                escalate: false
            };
        }
        
        // Demo / meeting request
        if (lowerMessage.includes('demo') || lowerMessage.includes('meeting') || lowerMessage.includes('call') || lowerMessage.includes('talk')) {
            return {
                message: `I'd love to show you Vonga in action! What's the best email to send you a calendar link?<br><br>Or fill out our <a href="contact.html" target="_blank" style="color: #33BECC;">quick contact form</a> and we'll reach out within 24 hours.`,
                escalate: true,
                escalateReason: 'Demo request'
            };
        }
        
        // Email address provided
        if (lowerMessage.includes('@') && lowerMessage.includes('.')) {
            // Extract email using regex
            const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (emailMatch) {
                const email = emailMatch[0];
                // Save to CRM
                this.saveEmailToCRM(email, message);
            }
            
            return {
                message: `Perfect! I've logged your email and someone from our team will reach out within a few hours with a calendar link. In the meantime, check out our case studies or pricing.`,
                escalate: true,
                escalateReason: 'Email provided: ' + lowerMessage
            };
        }
        
        // Case studies / examples
        if (lowerMessage.includes('case') || lowerMessage.includes('example') || lowerMessage.includes('story') || lowerMessage.includes('stories')) {
            return {
                message: `We're in our early pilot phase — which means you'd be among the first programs to have real data.<br><br>Check out our <a href="case-studies.html" target="_blank" style="color: #33BECC;">approach and industry benchmarks →</a>`,
                escalate: false
            };
        }
        
        // Technical questions
        if (lowerMessage.includes('technical') || lowerMessage.includes('integrate') || lowerMessage.includes('api')) {
            return {
                message: `Great technical question! Let me connect you with Bill (founder) who can dive into the specifics. What's your email and I'll have him reach out within a few hours?`,
                escalate: true,
                escalateReason: 'Technical question'
            };
        }
        
        // Apparel questions
        if (lowerMessage.includes('apparel') || lowerMessage.includes('shirt') || lowerMessage.includes('garment') || lowerMessage.includes('clothing')) {
            return {
                message: `We supply NFC-enabled premium apparel separately from the platform subscription. You control pricing and margins (most programs maintain 60%+ margins).\n\nWe work with your existing suppliers or can connect you with partners. The NFC chip adds minimal cost but allows $10-25 premium pricing.\n\nWant more details on apparel options?`,
                escalate: false
            };
        }
        
        // Sponsors question
        if (lowerMessage.includes('sponsor')) {
            return {
                message: `Sponsors love Vonga because they get real proof:\n• Exact tap counts (not impressions)\n• Geographic distribution of fans\n• Content engagement metrics\n• Detailed analytics reports\n\nPrograms report $10-25k increases in sponsor value from having measurable data. Want to see a sample sponsor report?`,
                escalate: false
            };
        }
        
        // Timeline / when can we start
        if (lowerMessage.includes('when') || lowerMessage.includes('timeline') || lowerMessage.includes('start')) {
            return {
                message: `Setup typically takes 2-4 weeks from contract to launch:\n• Week 1-2: Onboarding, content strategy, apparel design\n• Week 3: Platform setup, content creation\n• Week 4: Testing, training, launch\n\nWhen are you looking to launch?`,
                escalate: false
            };
        }
        
        // Contact info request
        if (lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('contact')) {
            return {
                message: `Best way to reach us:\n• Email: hello@vonga.com\n• Contact form: Takes 60 seconds, we reply within 24 hours\n• Or keep chatting with me! I'm here to help.\n\nWhat works best for you?`,
                escalate: false
            };
        }
        
        // Greeting
        if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
            return {
                message: `Hey! 👋 I'm here to answer questions about Vonga. What would you like to know?\n\n• How does NFC technology work?\n• What's the pricing?\n• Can I see results from other programs?\n• Something else?`,
                escalate: false
            };
        }
        
        // Default - try to be helpful
        return {
            message: `Good question! Let me see if I can help with that. In the meantime, you might find these helpful:<br><br>• <a href="how-it-works.html" target="_blank" style="color: #33BECC;">How It Works</a><br>• <a href="pricing.html" target="_blank" style="color: #33BECC;">Pricing</a><br>• <a href="case-studies.html" target="_blank" style="color: #33BECC;">Case Studies</a><br><br>Or ask me something specific and I'll do my best to answer!`,
            escalate: true,
            escalateReason: 'Unclear question: ' + message
        };
    }

    addMessage(text, type) {
        const messagesDiv = document.getElementById('vonga-chat-messages');
        
        // For user messages, escape HTML. For bot messages, allow HTML
        const content = type === 'user' ? this.escapeHtml(text) : text;
        
        const messageHTML = `
            <div class="vonga-message vonga-message-${type}">
                <div class="vonga-message-avatar">${type === 'bot' ? 'V' : 'Y'}</div>
                <div class="vonga-message-content">
                    <p>${content}</p>
                </div>
            </div>
        `;
        
        messagesDiv.insertAdjacentHTML('beforeend', messageHTML);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Save to history
        this.chatHistory.push({
            type,
            message: text,
            timestamp: new Date().toISOString()
        });
        this.saveHistory();
    }

    showTyping() {
        const messagesDiv = document.getElementById('vonga-chat-messages');
        const typingHTML = `
            <div class="vonga-message vonga-message-bot" id="vonga-typing-indicator">
                <div class="vonga-message-avatar">V</div>
                <div class="vonga-message-content">
                    <p>Typing...</p>
                </div>
            </div>
        `;
        messagesDiv.insertAdjacentHTML('beforeend', typingHTML);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    hideTyping() {
        const typingIndicator = document.getElementById('vonga-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    getVisitorContext() {
        // Collect useful context for routing to you
        return {
            page: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString()
        };
    }

    saveHistory() {
        localStorage.setItem(`vonga_chat_${this.visitorId}`, JSON.stringify(this.chatHistory));
    }

    loadHistory() {
        const saved = localStorage.getItem(`vonga_chat_${this.visitorId}`);
        if (saved) {
            this.chatHistory = JSON.parse(saved);
            // Re-render messages (skip the initial welcome)
            this.chatHistory.forEach(msg => {
                if (msg.type === 'user' || msg.message !== 'Hey! 👋 Have questions about Vonga?') {
                    this.addMessageToDOM(msg.message, msg.type);
                }
            });
        }
    }

    addMessageToDOM(text, type) {
        const messagesDiv = document.getElementById('vonga-chat-messages');
        const messageHTML = `
            <div class="vonga-message vonga-message-${type}">
                <div class="vonga-message-avatar">${type === 'bot' ? 'V' : 'Y'}</div>
                <div class="vonga-message-content">
                    <p>${this.escapeHtml(text)}</p>
                </div>
            </div>
        `;
        messagesDiv.insertAdjacentHTML('beforeend', messageHTML);
    }

    async saveEmailToCRM(email, chatContext) {
        try {
            // Create contact in CRM
            const contactData = {
                name: email.split('@')[0], // Use email prefix as placeholder name
                title: 'Website Chat Lead',
                organization: email.split('@')[1], // Domain as organization placeholder
                linkedin_url: null,
                email: email,
                phone: null,
                organization_type: 'Website Lead',
                decision_authority: 'Unknown',
                tags: ['chatbot-lead', 'website-chat', new Date().toISOString().split('T')[0]]
            };

            const contactResponse = await fetch('http://localhost:3100/api/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });

            if (!contactResponse.ok) {
                throw new Error('Failed to create contact');
            }

            const contact = await contactResponse.json();
            console.log('[CRM] Contact created:', contact);

            // Create activity record with chat history
            const activityData = {
                contact_id: contact.id,
                activity_type: 'chatbot',
                details: JSON.stringify({
                    source: 'website-chatbot',
                    chatHistory: this.chatHistory,
                    context: chatContext,
                    visitorId: this.visitorId,
                    page: window.location.href
                })
            };

            await fetch('http://localhost:3100/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(activityData)
            });

            console.log('[CRM] Email saved successfully:', email);
        } catch (error) {
            console.error('[CRM] Failed to save email:', error);
            // Don't show error to user - fail silently
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chat widget
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new VongaChat());
} else {
    new VongaChat();
}
