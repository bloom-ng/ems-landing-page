import React from "react";

interface StatCardProps {
	label: string;
	value: string;
	icon: string; // Material Symbols name
	trend: {
		value: string;
		isPositive: boolean;
	};
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
	return (
		<div className="bg-card p-6 rounded-default border-[0.5px] border-border shadow-border hover:border-primary transition-all group">
			<div className="flex items-start justify-between">
				<div className="space-y-1">
					<p className="text-[11px] text-muted font-bold capitalize tracking-widest">
						{label}
					</p>
					<h3 className="text-3xl font-black text-foreground tracking-tight">
						{value}
					</h3>
				</div>
				<div className="p-2.5 bg-primary/10 rounded-inner text-primary group-hover:scale-110 transition-transform flex items-center justify-center">
					<span className="material-icons-outlined text-[22px]">
						{icon}
					</span>
				</div>
			</div>
			<div className="mt-6 flex items-center gap-2">
				<div
					className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold capitalize tracking-wider ${
						trend.isPositive
							? "bg-green/10 text-green"
							: "bg-rose-500/10 text-rose-600"
					}`}
				>
					<span className="material-icons-outlined text-[14px]">
						{trend.isPositive ? "trending_up" : "trending_down"}
					</span>
					{trend.value}
				</div>
				<span className="text-[10px] text-muted font-bold capitalize tracking-widest">
					vs last month
				</span>
			</div>
		</div>
	);
}
