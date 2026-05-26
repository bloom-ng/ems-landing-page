export const TIER_ORDER: Record<string, number> = {
	FREE: 0,
	STARTER: 1,
	PRO: 2,
	ENTERPRISE: 3,
};

export const TIER_BADGE_CLASS: Record<string, string> = {
	FREE: "bg-foreground/5 text-muted",
	STARTER: "bg-primary/10 text-primary",
	PRO: "bg-primary/15 text-primary",
	ENTERPRISE: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

export const STATUS_BADGE_CLASS: Record<string, string> = {
	ACTIVE: "bg-emerald-500/10 text-emerald-600",
	TRIAL: "bg-amber-500/10 text-amber-700",
	EXPIRED: "bg-error/10 text-error",
};
