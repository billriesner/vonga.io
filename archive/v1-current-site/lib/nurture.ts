export type NurtureStatus = 'Active' | 'Re-engaged' | 'Snoozed';
export type CheckInChoice = 'A' | 'B' | 'C' | 'D';

export function nextRevisitDate(from: Date, days: number): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10); // YYYY-MM-DD
}

export function handleCheckInChoice(choice: CheckInChoice): {
  stage: 'BOOK' | 'REVIEW' | 'NURTURE';
  status: NurtureStatus;
  note: string;
  revisitDate?: string;
} {
  switch (choice) {
    case 'A':
      return { stage: 'REVIEW', status: 'Re-engaged', note: 'Season/event forming — move to REVIEW and offer booking.' };
    case 'B':
      return { stage: 'REVIEW', status: 'Re-engaged', note: 'Sponsor interest — move to REVIEW; offer 15-min sponsor-ROI chat.' };
    case 'C':
      return { stage: 'NURTURE', status: 'Active', note: 'Growing, not there yet — keep in NURTURE; check again in 60 days.', revisitDate: nextRevisitDate(new Date(), 60) };
    case 'D':
      return { stage: 'NURTURE', status: 'Snoozed', note: 'Not a priority — snooze 6 months.', revisitDate: nextRevisitDate(new Date(), 180) };
  }
}
