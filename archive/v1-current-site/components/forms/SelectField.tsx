'use client';

import * as React from 'react';

export type Option = { label: string; value: string };

export function SelectField({
  label,
  name,
  value,
  onChange,
  placeholder = 'Select an option',
  options,
  required,
  disabled,
  help,
  error,
}: {
  label: string;
  name: string;
  value: string;                 // controlled value; use "" for no selection
  onChange: (v: string) => void;
  placeholder?: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  help?: string;
  error?: string;
}) {
  const id = React.useId();
  const helpId = help ? `${id}-help` : undefined;
  const errId = error ? `${id}-err` : undefined;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
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
        className={`w-full rounded-xl bg-white text-gray-900 px-4 py-3 outline-none ring-1 ring-gray-300 focus:ring-[#33BECC]/40 border border-gray-300 ${
          error ? 'ring-2 ring-red-400/60' : ''
        }`}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {help && <p id={helpId} className="text-gray-500 text-xs">{help}</p>}
      {error && <p id={errId} className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
