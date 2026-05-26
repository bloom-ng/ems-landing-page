"use client";

import type { Application, JobStage } from "@/lib/api/recruitment";

interface ApplicationCardProps {
	application: Application;
	onClick: (application: Application) => void;
}

const sourceColors: Record<string, string> = {
	LINKEDIN: "bg-blue-500/10 text-blue-600",
	INDEED: "bg-purple-500/10 text-purple-600",
	WEBSITE: "bg-emerald-500/10 text-emerald-600",
	REFERRAL: "bg-amber-500/10 text-amber-600",
	INTERNAL: "bg-cyan-500/10 text-cyan-600",
	SOCIAL_MEDIA: "bg-pink-500/10 text-pink-600",
	EMAIL: "bg-orange-500/10 text-orange-600",
	OTHER: "bg-muted/10 text-muted",
};

function daysAgo(dateStr: string) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const days = Math.floor(diff / 86400000);
	if (days === 0) return "Today";
	if (days === 1) return "1 day ago";
	return `${days} days ago`;
}

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((n) => n[0])
		.join("")
		.toUpperCase();
}

export function ApplicationCard({ application, onClick }: ApplicationCardProps) {
	const candidate = application.candidate;
	const sourceCls =
		sourceColors[application.source] ?? "bg-muted/10 text-muted";

	return (
		<div
			onClick={() => onClick(application)}
			className="bg-card border border-border rounded-xl p-3 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group active:scale-[0.98]"
		>
			<div className="flex items-center gap-2.5 mb-2.5">
				<div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[11px] shrink-0 group-hover:scale-105 transition-transform">
					{candidate ? getInitials(candidate.name) : "??"}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-black text-foreground tracking-tight truncate leading-tight">
						{candidate?.name ?? "Unknown"}
					</p>
					{candidate?.email && (
						<p className="text-[10px] text-muted font-bold truncate leading-tight">
							{candidate.email}
						</p>
					)}
				</div>
			</div>

			<div className="flex items-center justify-between">
				<span
					className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black capitalize tracking-widest ${sourceCls}`}
				>
					{application.source.toLowerCase().replace(/_/g, " ")}
				</span>
				<span className="text-[9px] font-bold text-muted capitalize tracking-widest">
					{daysAgo(application.appliedAt)}
				</span>
			</div>

			{(application._count?.activities ?? 0) > 0 && (
				<div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-muted">
					<span className="material-icons-outlined text-[12px]">task</span>
					{application._count!.activities} task
					{application._count!.activities !== 1 ? "s" : ""}
				</div>
			)}
		</div>
	);
}
