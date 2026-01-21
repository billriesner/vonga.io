'use client';

import * as React from 'react';

type GoalKeyInternal =
  | 'lasting_fandom'
  | 'connected_apparel'
  | 'sponsor_activation'
  | 'loyalty'
  | 'reduce_waste';

type GoalOption = {
  id: string;                 // DOM id
  label: string;              // customer-facing
  help: string;               // short helper text
  internal: GoalKeyInternal;  // backend enum
};

export const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'g-last',
    label: 'Keep fans engaged after game day',
    help: 'Keep the connection alive after the event ends.',
    internal: 'lasting_fandom',
  },
  {
    id: 'g-connected',
    label: 'Create interactive or tech-enabled merch',
    help: 'Turn apparel into an experience your fans can tap.',
    internal: 'connected_apparel',
  },
  {
    id: 'g-sponsor',
    label: 'Give sponsors something measurable',
    help: 'Prove engagement, not just logo placement.',
    internal: 'sponsor_activation',
  },
  {
    id: 'g-loyalty',
    label: 'Build a loyalty or membership experience',
    help: 'Reward recurring engagement and keep your community close.',
    internal: 'loyalty',
  },
  {
    id: 'g-meaningful',
    label: 'Make merch more meaningful (and less wasteful)',
    help: 'Invest in fewer, higher-impact items fans actually use.',
    internal: 'reduce_waste',
  },
];

export type GoalsFieldValue = GoalKeyInternal[];

export function mapGoalsToInternal(displayValues: string[]): GoalsFieldValue {
  // If you ever receive display labels, map them back to internal enums safely
  const norm = new Map(GOAL_OPTIONS.map(o => [o.label.toLowerCase(), o.internal]));
  return displayValues
    .map(v => norm.get(String(v).toLowerCase()))
    .filter((v): v is GoalKeyInternal => Boolean(v));
}

export function GoalsField({
  name = 'goals',
  value,
  onChange,
  otherText,
  onOtherTextChange,
  disabled,
}: {
  /** Hidden input name sent to your API (array -> repeated key) */
  name?: string;
  /** Controlled value of internal keys */
  value: GoalsFieldValue;
  /** Controlled onChange (returns internal keys) */
  onChange: (next: GoalsFieldValue) => void;
  /** Optional "Other" text value */
  otherText?: string;
  /** Optional "Other" text onChange */
  onOtherTextChange?: (v: string) => void;
  disabled?: boolean;
}) {
  const toggle = (k: GoalKeyInternal) => {
    const set = new Set(value);
    set.has(k) ? set.delete(k) : set.add(k);
    onChange(Array.from(set));
  };

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm uppercase tracking-wider text-white/80">
        What are you hoping to accomplish?
      </legend>

      <div className="grid grid-cols-1 gap-3">
        {GOAL_OPTIONS.map(opt => {
          const checked = value.includes(opt.internal);
          const helpId = `${opt.id}-help`;
          return (
            <label
              key={opt.id}
              htmlFor={opt.id}
              className={`group rounded-xl border border-white/10 bg-white/5 p-4 hover:border-[#33BECC]/60 transition ${checked ? 'ring-2 ring-[#33BECC]/40 border-[#33BECC] bg-[#33BECC]/10' : ''}`}
            >
              <div className="flex items-start gap-3">
                <input
                  id={opt.id}
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-[#33BECC]"
                  checked={checked}
                  onChange={() => toggle(opt.internal)}
                  aria-describedby={helpId}
                  disabled={disabled}
                />
                <div>
                  <div className="font-medium text-white">{opt.label}</div>
                  <p id={helpId} className="text-white/70 text-sm">
                    {opt.help}
                  </p>
                </div>
              </div>

              {/* Hidden real input(s) for HTML form POST compatibility */}
              {checked && (
                <input type="hidden" name={name} value={opt.internal} />
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-2">
        <label className="block text-sm text-white/80 mb-1" htmlFor="goal-other">
          Other goal or challenge?
        </label>
        <input
          id="goal-other"
          type="text"
          className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC]"
          placeholder="Tell us in a sentence or two…"
          value={otherText ?? ''}
          onChange={e => onOtherTextChange?.(e.target.value)}
          disabled={disabled}
          name={`${name}_other`}
        />
      </div>
    </fieldset>
  );
}
