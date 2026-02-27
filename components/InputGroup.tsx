import React from 'react';

interface InputGroupProps {
  label: string;
  value: number | string | null;
  onChange: (val: string) => void;
  type?: 'number' | 'text';
  unit?: string;
  step?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  unit,
  step = 'any',
  placeholder,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col group ${className}`}>
      <div className="flex justify-between items-end mb-1">
        <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-tech group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {label}
        </label>
        {unit && <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-mono">[{unit}]</span>}
      </div>

      <div className="relative">
        <input
          type={type}
          step={step}
          value={value === null ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 text-black dark:text-zinc-100 font-mono text-sm
            focus:ring-0 focus:border-black dark:focus:border-white focus:bg-zinc-50 dark:focus:bg-zinc-900 block p-2.5 rounded-sm shadow-sm
            placeholder-zinc-300 dark:placeholder-zinc-700 transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        />
        {/* Corner accents for technical feel */}
        <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-black dark:border-white opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-black dark:border-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};