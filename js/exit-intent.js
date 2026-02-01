/**
 * Vonga Exit-Intent Popup System
 * Rotates between different lead magnets for A/B testing
 */

const LEAD_MAGNETS = [
    {
        id: 'roi-calculator',
        headline: 'Before You Go...',
        subhead: 'Use Our Free Fan Engagement ROI Calculator',
        description: 'Interactive calculator - see how much revenue you could generate with measurable fan engagement. Takes 2 minutes.',
        cta: 'Open Calculator',
        image: '📊',
        url: 'lead-magnets/ROI-Calculator'
    },
    {
        id: 'sponsor-guide',
        headline: 'Wait!',
        subhead: 'Free Guide: Proving Sponsor ROI in College Athletics',
        description: 'Learn the 5 metrics sponsors actually care about and how to measure them. 10-page guide.',
        cta: 'Read Guide',
        image: '📖',
        url: 'lead-magnets/Sponsor-ROI-Guide'
    },
    {
        id: 'case-study-pack',
        headline: 'One More Thing...',
        subhead: 'Get Our Complete Case Study Pack',
        description: '4 detailed examples of how programs like yours are using Vonga. Real numbers, real results.',
        cta: 'View Case Studies',
        image: '📁',
        url: 'lead-magnets/Case-Study-Pack'
    }
];

class ExitIntentPopup {
    constructor() {
        this.shown = false;
        this.leadMagnet = this.selectLeadMagnet();
        this.init();
    }

    selectLeadMagnet() {
        // Check if user already saw one
        const seenMagnets = JSON.parse(localStorage.getItem('vonga_seen_magnets') || '[]');
        
        // Filter to unseen magnets
        const unseenMagnets = LEAD_MAGNETS.filter(m => !seenMagnets.includes(m.id));
        
        // If all seen, reset
        if (unseenMagnets.length === 0) {
            localStorage.setItem('vonga_seen_magnets', '[]');
            return LEAD_MAGNETS[Math.floor(Math.random() * LEAD_MAGNETS.length)];
        }
        
        // Return random unseen magnet
        return unseenMagnets[Math.floor(Math.random() * unseenMagnets.length)];
    }

    init() {
        // Don't show on contact page
        if (window.location.pathname.includes('contact.html')) {
            return;
        }

        // Don't show if already converted
        if (localStorage.getItem('vonga_converted')) {
            return;
        }

        // Don't show if shown in last 5 minutes (was 24 hours - too long for testing)
        const lastShown = localStorage.getItem('vonga_exit_popup_shown');
        if (lastShown && (Date.now() - parseInt(lastShown)) < 5 * 60 * 1000) {
            console.log('[Exit Intent] Shown recently, skipping. Wait 5 minutes or clear localStorage.');
            return;
        }
        
        console.log('[Exit Intent] Ready to show popup');

        this.createPopup();
        this.bindEvents();
    }

    createPopup() {
        const popupHTML = `
            <div id="vonga-exit-popup" class="vonga-exit-popup">
                <div class="vonga-exit-overlay"></div>
                <div class="vonga-exit-content">
                    <button class="vonga-exit-close">✕</button>
                    <div class="vonga-exit-body">
                        <div class="vonga-exit-image">${this.leadMagnet.image}</div>
                        <h2>${this.leadMagnet.headline}</h2>
                        <h3>${this.leadMagnet.subhead}</h3>
                        <p>${this.leadMagnet.description}</p>
                        <form class="vonga-exit-form" id="vonga-exit-form">
                            <button type="submit" class="vonga-exit-cta">${this.leadMagnet.cta}</button>
                            <p style="font-size: 13px; color: #6b7280; margin-top: 12px;">Free, no email required</p>
                        </form>
                        <p class="vonga-exit-privacy">We respect your privacy. Unsubscribe anytime.</p>
                    </div>
                </div>
            </div>
        `;

        const styles = `
            <style>
                .vonga-exit-popup {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000;
                    animation: vonga-fade-in 0.3s ease;
                }
                
                .vonga-exit-popup.show {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .vonga-exit-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                }
                
                .vonga-exit-content {
                    position: relative;
                    background: white;
                    border-radius: 20px;
                    max-width: 520px;
                    width: calc(100% - 40px);
                    max-height: calc(100vh - 40px);
                    overflow-y: auto;
                    box-shadow: 0 25px 80px rgba(0,0,0,0.25);
                    animation: vonga-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    border: 1px solid rgba(255,255,255,0.2);
                }
                
                .vonga-exit-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.2s;
                }
                
                .vonga-exit-close:hover {
                    background: #f3f4f6;
                }
                
                .vonga-exit-body {
                    padding: 56px 40px 40px;
                    text-align: center;
                }
                
                .vonga-exit-image {
                    font-size: 72px;
                    margin-bottom: 24px;
                    line-height: 1;
                }
                
                .vonga-exit-body h2 {
                    color: #111827;
                    font-size: 28px;
                    margin: 0 0 12px 0;
                    font-weight: 700;
                }
                
                .vonga-exit-body h3 {
                    color: #33BECC;
                    font-size: 22px;
                    font-weight: 700;
                    margin: 0 0 20px 0;
                    line-height: 1.3;
                }
                
                .vonga-exit-body p {
                    color: #6b7280;
                    font-size: 16px;
                    line-height: 1.6;
                    margin: 0 0 28px 0;
                }
                
                .vonga-exit-form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 16px;
                }
                
                .vonga-exit-input {
                    padding: 14px 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.2s;
                }
                
                .vonga-exit-input:focus {
                    outline: none;
                    border-color: #33BECC;
                }
                
                .vonga-exit-cta {
                    padding: 14px 24px;
                    background: linear-gradient(135deg, #33BECC 0%, #F5856E 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                
                .vonga-exit-cta:hover {
                    transform: translateY(-2px);
                }
                
                .vonga-exit-privacy {
                    font-size: 12px !important;
                    color: #9ca3af !important;
                    margin: 0 !important;
                }
                
                @keyframes vonga-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes vonga-slide-up {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', styles);
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }

    bindEvents() {
        // Exit intent detection - must be on document, not body
        let exitIntentTriggered = false;
        
        document.addEventListener('mouseout', (e) => {
            // Detect mouse leaving at top of viewport
            if (!exitIntentTriggered && e.clientY <= 0 && !this.shown) {
                exitIntentTriggered = true;
                this.show();
            }
        });

        // Also trigger after 30 seconds if not already shown (backup)
        setTimeout(() => {
            if (!this.shown && !exitIntentTriggered) {
                console.log('[Exit Intent] Showing after 30s timeout');
                this.show();
            }
        }, 30000);

        // Close button
        const closeBtn = document.querySelector('.vonga-exit-close');
        const overlay = document.querySelector('.vonga-exit-overlay');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => this.hide());
        }

        // Form submission
        const form = document.getElementById('vonga-exit-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        console.log('[Exit Intent] Events bound, waiting for trigger...');
    }

    show() {
        if (this.shown) return;
        
        const popup = document.getElementById('vonga-exit-popup');
        if (popup) {
            popup.classList.add('show');
            this.shown = true;
            
            // Track shown
            localStorage.setItem('vonga_exit_popup_shown', Date.now().toString());
            
            // Mark this magnet as seen
            const seenMagnets = JSON.parse(localStorage.getItem('vonga_seen_magnets') || '[]');
            seenMagnets.push(this.leadMagnet.id);
            localStorage.setItem('vonga_seen_magnets', JSON.stringify(seenMagnets));
            
            // Track event
            this.trackEvent('popup_shown');
        }
    }

    hide() {
        const popup = document.getElementById('vonga-exit-popup');
        if (popup) {
            popup.classList.remove('show');
            this.trackEvent('popup_closed');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Track conversion
        this.trackEvent('lead_magnet_accessed', { leadMagnet: this.leadMagnet.id });
        localStorage.setItem('vonga_converted', 'true');
        
        // Open lead magnet in new tab
        window.open(this.leadMagnet.url, '_blank');
        
        // Show success message
        const body = document.querySelector('.vonga-exit-body');
        body.innerHTML = `
            <div class="vonga-exit-image">✅</div>
            <h2>Opening Now!</h2>
            <p>${this.leadMagnet.subhead} is opening in a new tab.</p>
            <p style="margin-top: 24px;">
                <button onclick="window.open('${this.leadMagnet.url}', '_blank')" 
                        style="background: #33BECC; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    Open Again
                </button>
            </p>
            <p style="color: #33BECC; font-weight: 600; cursor: pointer; margin-top: 16px;" 
               onclick="document.getElementById('vonga-exit-popup').classList.remove('show');">
                Continue Browsing →
            </p>
        `;
        
        console.log('[LEAD MAGNET ACCESSED]', { leadMagnet: this.leadMagnet.id, url: this.leadMagnet.url });
    }

    trackEvent(eventType, metadata = {}) {
        const event = {
            eventType,
            leadMagnet: this.leadMagnet.id,
            timestamp: new Date().toISOString(),
            page: window.location.href,
            ...metadata
        };
        
        console.log('[EXIT INTENT]', event);
        
        // Store locally
        const events = JSON.parse(localStorage.getItem('vonga_exit_events') || '[]');
        events.push(event);
        localStorage.setItem('vonga_exit_events', JSON.stringify(events));
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ExitIntentPopup());
} else {
    new ExitIntentPopup();
}
