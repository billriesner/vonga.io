'use client';

import * as React from 'react';

export type SelectOption = { label: string; value: string };

export function LabeledSelect({
  id,
  name,
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  required,
  disabled,
  helperText,
  error,
}: {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: string;
}) {
  const helpId = helperText ? `${id}-help` : undefined;
  const errId = error ? `${id}-err` : undefined;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-white/80 mb-1 font-medium">
        {label}{required ? ' *' : ''}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={[helpId, errId].filter(Boolean).join(' ') || undefined}
        aria-invalid={Boolean(error) || undefined}
        required={required}
        disabled={disabled}
        className={`w-full rounded-xl bg-white/5 border border-white/10 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#33BECC]/40 focus:border-[#33BECC] ${
          error ? 'ring-2 ring-red-400/60 border-red-500/30' : ''
        }`}
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: 'white'
        }}
      >
        <option value="" disabled style={{ backgroundColor: '#0a1422', color: 'white' }}>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#0a1422', color: 'white' }}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && <p id={helpId} className="text-white/60 text-xs">{helperText}</p>}
      {error && <p id={errId} className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
