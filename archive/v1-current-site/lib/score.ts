// /lib/score.ts
export type Intake = {
  vertical: string; // now broader keys (e.g., 'pro_team', 'brand_sponsor', etc.)
  audienceBand: '<10k' | '10–50k' | '50–250k' | '250k–1M' | '>1M';
  moqBand: '<5k' | '5k–20k' | '20k–100k' | '100k+';
  timeline: 'ASAP' | 'This season' | 'Exploring';
  decisionRole: 'Decision Maker' | 'Team' | 'Exploring';
  goals: string[]; // e.g., ['lasting_fandom','connected_apparel']
};

export type Owner = 'PRO' | 'SPORTEDU' | 'PARTNERS' | 'COMMUNITY' | 'DIGITAL' | 'OTHER';

export function routeOwnerByVertical(vertical: string): Owner {
  switch (vertical) {
    case 'pro_team':
    case 'league_association':
    case 'event_operator':
      return 'PRO';
    case 'college_athletics':
    case 'youth_academy':
      return 'SPORTEDU';
    case 'brand_sponsor':
    case 'retail_merch':
    case 'agency_integrator':
      return 'PARTNERS';
    case 'community_club':
    case 'nonprofit_foundation':
      return 'COMMUNITY';
    case 'esports_digital':
      return 'DIGITAL';
    case 'other':
    default:
      return 'OTHER';
  }
}

export function ownerToApptUrl(owner: Owner) {
  const defaultUrl = 'https://calendar.app.google/XpbFccgx8GktbMsM8';
  
  switch (owner) {
    case 'PRO': return process.env.APPT_URL_PRO || defaultUrl;
    case 'SPORTEDU': return process.env.APPT_URL_SPORTEDU || defaultUrl;
    case 'PARTNERS': return process.env.APPT_URL_PARTNERS || defaultUrl;
    case 'COMMUNITY': return process.env.APPT_URL_COMMUNITY || defaultUrl;
    case 'DIGITAL': return process.env.APPT_URL_DIGITAL || defaultUrl;
    case 'OTHER': return process.env.APPT_URL_PARTNERS || defaultUrl;
  }
}

export function scoreLead(i: Intake) {
  let score = 0;

  // MOQ
  score += i.moqBand === '100k+' ? 5
    : i.moqBand === '20k–100k' ? 5
    : i.moqBand === '5k–20k' ? 3 : 0;

  // Audience
  score += i.audienceBand === '>1M' ? 5
    : i.audienceBand === '250k–1M' ? 4
    : i.audienceBand === '50–250k' ? 3
    : i.audienceBand === '10–50k' ? 2 : 0;

  // Timeline
  score += i.timeline === 'ASAP' ? 5
    : i.timeline === 'This season' ? 3 : 1;

  // Role
  score += i.decisionRole === 'Decision Maker' ? 5
    : i.decisionRole === 'Team' ? 3 : 1;

  // Goal fit
  if (i.goals?.some(g => g === 'lasting_fandom' || g === 'connected_apparel')) score += 2;

  const owner = routeOwnerByVertical(i.vertical);
  return { score, owner };
}