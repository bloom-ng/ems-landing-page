import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer group ${className}`}>
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className="peer appearance-none w-4 h-4 rounded border-[0.5px] border-border bg-foreground/5 checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
          {...props}
        />
        <span className="material-icons-outlined absolute text-[12px] text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none select-none">
          check
        </span>
      </div>
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
    </label>
  );
}
