export type FitCategory =
  | 'Scale & Readiness'
  | 'Timing Misalignment'
  | 'Resource Alignment'
  | 'Strategic Fit'
  | 'Focus Area Misalignment'
  | 'Strong Fit'
  | 'Ambiguous Fit';

export type FitInput = {
  audienceBand: '<10k' | '10–50k' | '50–250k' | '250k–1M' | '>1M';
  moqBand: '<5k' | '5k–20k' | '20k–100k' | '100k+';
  timeline: 'ASAP' | 'This season' | 'Exploring';
  goals: string[]; // internal enums like 'lasting_fandom','connected_apparel','sponsor_activation','loyalty','reduce_waste'
};

export function fitInsight(input: FitInput): { fitCategory: FitCategory; fitMessage: string } {
  const smallAudience = input.audienceBand === '<10k';
  const smallMOQ = input.moqBand === '<5k';
  const earlyTiming = input.timeline === 'Exploring';
  const sponsorFocus = input.goals?.includes('sponsor_activation');
  const fandomAligned = input.goals?.some(g => g === 'lasting_fandom' || g === 'connected_apparel');

  // Strong fit (quick win)
  const bigMOQ = input.moqBand === '20k–100k' || input.moqBand === '100k+';
  const nearTerm = input.timeline === 'ASAP' || input.timeline === 'This season';
  const largerAudience = input.audienceBand === '250k–1M' || input.audienceBand === '>1M';

  if (bigMOQ && nearTerm && (fandomAligned || largerAudience)) {
    return {
      fitCategory: 'Strong Fit',
      fitMessage: 'High operational readiness and mission alignment. Recommend immediate booking — ideal for a pilot or launch program.'
    };
  }

  // Scale & Readiness
  if (smallAudience || smallMOQ) {
    return {
      fitCategory: 'Scale & Readiness',
      fitMessage: 'Smaller in scale today, but clearly building something meaningful. Great cultural fit — just needs a bit more reach before activation.'
    };
  }

  // Timing Misalignment
  if (earlyTiming) {
    return {
      fitCategory: 'Timing Misalignment',
      fitMessage: 'Aligned vision but early in the planning cycle. Best results when we line up with a season or event window.'
    };
  }

  // Resource Alignment (sponsor path unclear)
  if (sponsorFocus && (smallAudience || input.audienceBand === '10–50k')) {
    return {
      fitCategory: 'Resource Alignment',
      fitMessage: 'Concept is strong but sponsor/partner path looks early. Helpful to clarify budget or partner engagement before activation.'
    };
  }

  // Strategic Fit (merch vs. connection)
  const merchOnly = !fandomAligned && !sponsorFocus; // crude but effective signal
  if (merchOnly) {
    return {
      fitCategory: 'Strategic Fit',
      fitMessage: 'Interest in merch more than fan connection. Good education fit later once they shift toward engagement over inventory.'
    };
  }

  // Fallbacks
  return {
    fitCategory: 'Ambiguous Fit',
    fitMessage: 'Mixed signals — size and potential look good, but use case is unclear. Worth a short discovery call to clarify.'
  };
}
