/**
 * Vonga A/B Testing System
 * Rotates hero variants and tracks conversions
 */

const AB_TEST_CONFIG = {
    heroes: [
        {
            id: 'hero-1',
            headline: 'Prove Sponsor ROI. Drive Premium Pricing. Build Lasting Engagement.',
            subhead: 'NFC-enabled apparel that turns your merchandise into a measurable fan engagement platform. 40-60% tap rates. Real-time analytics. No app required.',
            cta1: 'See Real Results',
            cta2: 'View Pricing'
        },
        {
            id: 'hero-2',
            headline: 'Turn Merchandise Into Measurable Fan Engagement',
            subhead: 'Athletic programs use Vonga to prove sponsor value, justify premium pricing, and build lasting fan relationships. No app required.',
            cta1: 'See Real Results',
            cta2: 'View Pricing'
        },
        {
            id: 'hero-3',
            headline: 'Stop Guessing. Start Measuring. Prove Your Impact.',
            subhead: 'Fans tap. You track. Sponsors see proof. Leadership gets metrics. Simple NFC technology embedded in premium apparel.',
            cta1: 'See How It Works',
            cta2: 'View Pricing'
        },
        {
            id: 'hero-4',
            headline: 'Your Merchandise Isn\'t Working Hard Enough',
            subhead: 'What if every shirt you sold became a touchpoint? Track engagement. Update content. Measure results. That\'s Vonga.',
            cta1: 'See Real Results',
            cta2: 'Get Custom Pricing'
        },
        {
            id: 'hero-5',
            headline: 'The Fan Engagement Platform Hidden in Your Apparel',
            subhead: 'Simple NFC technology. Real-time analytics. Measurable ROI. Turn your merchandise into a revenue driver that proves sponsor value.',
            cta1: 'See How It Works',
            cta2: 'View Pricing'
        }
    ],
    closingCTAs: [
        {
            id: 'cta-1',
            headline: 'Ready to Prove Sponsor ROI?',
            subhead: 'See how athletic programs are turning merchandise into measurable engagement. Get custom pricing and examples for your program in under 24 hours.'
        },
        {
            id: 'cta-2',
            headline: 'Ready to See What\'s Possible?',
            subhead: 'Get pricing tailored to your program and see real results from similar athletic departments and sports teams.'
        },
        {
            id: 'cta-3',
            headline: 'Turn Your Merch Into a Revenue Driver',
            subhead: 'Stop selling shirts. Start building assets. See how Vonga transforms merchandise into measurable fan engagement.'
        },
        {
            id: 'cta-4',
            headline: 'See What Similar Programs Are Achieving',
            subhead: 'Athletic programs across Division I, II, and pro sports are proving sponsor value and driving premium pricing. Join them.'
        },
        {
            id: 'cta-5',
            headline: 'Stop Selling Shirts. Start Building Assets.',
            subhead: 'Your merchandise should work harder. Get custom pricing and see how programs like yours are using Vonga to measure what matters.'
        }
    ]
};

class ABTester {
    constructor() {
        this.storageKey = 'vonga_ab_test';
        this.init();
    }

    init() {
        // Check for force-new-variant in URL (for testing)
        const urlParams = new URLSearchParams(window.location.search);
        const forceNew = urlParams.get('newvariant') === 'true';
        
        // Get or assign variant
        let userData = this.getUserData();
        
        if (!userData.heroVariant || !userData.ctaVariant || forceNew) {
            // New visitor or forced refresh - assign random variants
            userData.heroVariant = this.getRandomVariant(AB_TEST_CONFIG.heroes);
            userData.ctaVariant = this.getRandomVariant(AB_TEST_CONFIG.closingCTAs);
            userData.sessionId = this.generateSessionId();
            userData.firstVisit = new Date().toISOString();
            userData.pageViews = 0;
            this.saveUserData(userData);
            
            console.log('[A/B Test] New variant assigned:', {
                hero: userData.heroVariant.id,
                cta: userData.ctaVariant.id
            });
        }

        userData.pageViews++;
        userData.lastVisit = new Date().toISOString();
        this.saveUserData(userData);

        // Apply variant
        this.applyVariant(userData);

        // Track events
        this.trackEvents(userData);
    }

    getUserData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    saveUserData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getRandomVariant(variants) {
        return variants[Math.floor(Math.random() * variants.length)];
    }

    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    applyVariant(userData) {
        // Apply hero variant to homepage only
        if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
            return;
        }

        // Apply hero variant
        const heroSection = document.querySelector('.hero h1');
        const heroSubhead = document.querySelector('.hero p:not(.cta-group *)');
        const heroCTAs = document.querySelectorAll('.hero .cta-group a');

        if (heroSection && userData.heroVariant) {
            heroSection.innerHTML = userData.heroVariant.headline;
            if (heroSubhead) {
                heroSubhead.innerHTML = userData.heroVariant.subhead;
            }
            if (heroCTAs.length >= 2) {
                heroCTAs[0].textContent = userData.heroVariant.cta1;
                heroCTAs[1].textContent = userData.heroVariant.cta2;
            }
        }

        // Apply closing CTA variant
        const finalCTASection = document.querySelector('body > section:last-of-type');
        if (finalCTASection) {
            const closingH2 = finalCTASection.querySelector('h2');
            const closingP = finalCTASection.querySelector('p');
            
            if (closingH2 && userData.ctaVariant) {
                closingH2.textContent = userData.ctaVariant.headline;
            }
            if (closingP && userData.ctaVariant) {
                closingP.textContent = userData.ctaVariant.subhead;
            }
        }
    }

    trackEvents(userData) {
        // Track contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                this.trackConversion(userData, 'form_submit');
            });
        }

        // Track CTA clicks
        document.querySelectorAll('.btn-primary, .btn-aqua').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.getAttribute('href');
                this.trackEvent(userData, 'cta_click', { target, text: e.target.textContent });
            });
        });
    }

    trackEvent(userData, eventType, metadata = {}) {
        const event = {
            sessionId: userData.sessionId,
            heroVariant: userData.heroVariant.id,
            ctaVariant: userData.ctaVariant.id,
            eventType,
            metadata,
            timestamp: new Date().toISOString()
        };

        // Log to console (in production, send to analytics endpoint)
        console.log('[AB Test Event]', event);

        // Store locally for now
        const events = JSON.parse(localStorage.getItem('vonga_ab_events') || '[]');
        events.push(event);
        localStorage.setItem('vonga_ab_events', JSON.stringify(events));
    }

    trackConversion(userData, type) {
        userData.converted = true;
        userData.conversionType = type;
        userData.conversionDate = new Date().toISOString();
        this.saveUserData(userData);
        this.trackEvent(userData, 'conversion', { type });
    }

    // Admin function to export results
    static exportResults() {
        const events = JSON.parse(localStorage.getItem('vonga_ab_events') || '[]');
        const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vonga-ab-test-results-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ABTester());
} else {
    new ABTester();
}

// Expose export function to console
window.exportABResults = () => ABTester.exportResults();
