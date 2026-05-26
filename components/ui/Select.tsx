import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-[11px] font-bold text-muted ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full bg-card border-[0.5px] border-border rounded-default py-3 px-3 text-sm shadow-border focus:border-[1px] focus:border-primary/50 outline-none transition-all cursor-pointer text-foreground appearance-none ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="material-icons-outlined absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none text-[20px]">
            unfold_more
          </span>
        </div>
        {error && (
          <p className="text-[10px] font-bold text-error ml-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
