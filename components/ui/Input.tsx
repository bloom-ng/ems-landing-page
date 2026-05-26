import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	prefix?: string;
	suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ label, error, prefix, suffix, maxLength = 255, className = "", ...props }, ref) => {
		return (
			<div className="space-y-1.5 w-full">
				<div className="flex justify-between items-center">
					{label && (
						<label className="text-[11px] font-bold text-muted ml-1">
							{label}
						</label>
					)}
					{props.value !== undefined && maxLength && (
						<span className="text-[10px] font-bold text-muted/50 mr-1">
							{String(props.value).length} / {maxLength}
						</span>
					)}
				</div>
				<div
					className={`flex items-center w-full bg-card border-[0.5px] border-border rounded-default shadow-border px-4 transition-all focus-within:border-[1px] focus-within:border-primary/50 ${className}`}
				>
					{prefix && (
						<span className="text-muted/50 font-medium select-none pr-1 text-sm">
							{prefix}
						</span>
					)}
					<input
						ref={ref}
						maxLength={maxLength}
						className="flex-1 bg-card py-3 outline-none text-sm placeholder:text-muted/50 text-foreground"
						{...props}
					/>
					{suffix}
				</div>
				{error && (
					<p className="text-[10px] font-bold text-error ml-1">
						{error}
					</p>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
