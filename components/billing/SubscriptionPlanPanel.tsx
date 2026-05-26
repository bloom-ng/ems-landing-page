"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	getSubscription,
	getPlans,
	initializeCheckout,
	initializeSeatUpgrade,
} from "@/lib/api/billing";
import type { BillingCycle, SubscriptionInfo, Plan } from "@/lib/api/billing";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { formatNaira } from "@/lib/currency";
import {
	STATUS_BADGE_CLASS,
	TIER_BADGE_CLASS,
	TIER_ORDER,
} from "./constants";

interface SubscriptionPlanPanelProps {
	tenantSlug: string;
	/** Show link to dedicated billing page (payment return URL) */
	showBillingPageLink?: boolean;
}

export function SubscriptionPlanPanel({
	tenantSlug,
	showBillingPageLink = false,
}: SubscriptionPlanPanelProps) {
	const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
		null,
	);
	const [plans, setPlans] = useState<Plan[]>([]);
	const [loading, setLoading] = useState(true);
	const [seats, setSeats] = useState(5);
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
	const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
	const [seatUpgradeTarget, setSeatUpgradeTarget] = useState<number | null>(
		null,
	);

	function calcTotal(plan: Plan, seatCount: number, cycle: BillingCycle) {
		const base = cycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
		const billable = Math.max(0, seatCount - (plan.includedSeats ?? 0));
		return base + (plan.seatPrice ?? 0) * billable;
	}

	function calcSeatUpgradeDelta(
		plan: Plan,
		currentSeats: number,
		targetSeats: number,
		cycle: BillingCycle,
	) {
		return Math.max(
			0,
			calcTotal(plan, targetSeats, cycle) - calcTotal(plan, currentSeats, cycle),
		);
	}

	async function loadSubscription() {
		const data = await getSubscription(tenantSlug);
		setSubscription(data.subscription);
		if (data.subscription) setSeats(data.subscription.seats);
	}

	useEffect(() => {
		async function load() {
			try {
				await loadSubscription();
				const allPlans = await getPlans(tenantSlug).catch(() => [] as Plan[]);
				setPlans(
					allPlans.sort(
						(a, b) =>
							(TIER_ORDER[a.tier] ?? 0) - (TIER_ORDER[b.tier] ?? 0),
					),
				);
			} finally {
				setLoading(false);
			}
		}
		void load();
	}, [tenantSlug]);

	async function handleUpgrade(planId: string) {
		setCheckoutLoading(true);
		setSelectedPlanId(planId);
		try {
			const result = await initializeCheckout(tenantSlug, {
				planId,
				seats,
				interval: billingCycle,
			});

			if ("activated" in result && result.activated) {
				setSubscription(result.subscription);
				toast.success("Plan activated");
				return;
			}

			if ("authorizationUrl" in result) {
				window.location.href = result.authorizationUrl;
			}
		} catch (err: unknown) {
			if (err instanceof ApiError) {
				toast.error(err.payload?.message ?? "Failed to start checkout");
			} else {
				toast.error("Failed to start checkout");
			}
		} finally {
			setCheckoutLoading(false);
			setSelectedPlanId(null);
		}
	}

	async function handleSeatUpgrade() {
		if (!subscription || seatUpgradeTarget == null) return;
		if (seatUpgradeTarget <= subscription.seats) {
			toast.error("Choose a seat count higher than your current allocation");
			return;
		}
		setCheckoutLoading(true);
		try {
			const result = await initializeSeatUpgrade(tenantSlug, {
				seats: seatUpgradeTarget,
				interval: billingCycle,
			});

			if ("activated" in result && result.activated) {
				setSubscription(result.subscription);
				setSeats(result.subscription.seats);
				toast.success("Seats updated");
				return;
			}

			if ("authorizationUrl" in result) {
				window.location.href = result.authorizationUrl;
			}
		} catch (err: unknown) {
			if (err instanceof ApiError) {
				toast.error(err.payload?.message ?? "Failed to start checkout");
			} else {
				toast.error("Failed to start checkout");
			}
		} finally {
			setCheckoutLoading(false);
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-16">
				<div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
			</div>
		);
	}

	const seatPct = subscription
		? Math.min(
				100,
				Math.round((subscription.seatUsed / subscription.seats) * 100),
			)
		: 0;

	const currentTierRank = subscription
		? (TIER_ORDER[subscription.planTier] ?? 0)
		: -1;

	return (
		<div className="space-y-6">
			{showBillingPageLink && (
				<p className="text-xs text-muted font-medium">
					Returning from Paystack?{" "}
					<Link
						href={`/${tenantSlug}/settings/billing`}
						className="text-primary font-bold hover:underline"
					>
						Open billing page
					</Link>{" "}
					if your plan did not update automatically.
				</p>
			)}

			{subscription ? (
				<div className="rounded-default border border-border bg-card p-6 shadow-soft space-y-5">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="w-11 h-11 rounded-default bg-primary/10 text-primary flex items-center justify-center">
								<span className="material-icons-outlined text-2xl">
									workspace_premium
								</span>
							</div>
							<div>
								<p className="text-xs font-bold text-muted capitalize tracking-wide">
									Current Plan
								</p>
								<p className="text-xl font-black text-foreground tracking-tight">
									{subscription.planName}
								</p>
							</div>
						</div>
						<div className="flex flex-wrap gap-2">
							<span
								className={`text-xs font-bold px-2.5 py-1 rounded-default capitalize ${TIER_BADGE_CLASS[subscription.planTier] ?? "bg-foreground/5 text-muted"}`}
							>
								{subscription.planTier.toLowerCase()}
							</span>
							<span
								className={`text-xs font-bold px-2.5 py-1 rounded-default capitalize ${STATUS_BADGE_CLASS[subscription.status] ?? "bg-foreground/5 text-muted"}`}
							>
								{subscription.status.toLowerCase()}
							</span>
						</div>
					</div>

					{subscription.expiresAt && (
						<p className="text-xs text-muted font-medium">
							Expires{" "}
							{new Date(subscription.expiresAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
					)}

					<div className="space-y-2">
						<div className="flex justify-between text-sm font-bold">
							<span className="text-muted">Seat Usage</span>
							<span className="text-foreground">
								{subscription.seatUsed} / {subscription.seats}
							</span>
						</div>
						<div className="h-2 bg-muted/20 rounded-default overflow-hidden">
							<div
								className={`h-full rounded-default transition-all ${
									seatPct >= 90
										? "bg-error"
										: seatPct >= 70
											? "bg-amber-500"
											: "bg-primary"
								}`}
								style={{ width: `${seatPct}%` }}
							/>
						</div>
						<p className="text-xs text-muted font-medium">
							{subscription.seatAvailable} seat
							{subscription.seatAvailable !== 1 ? "s" : ""} available for new
							users
						</p>
					</div>

					<div className="rounded-default bg-muted/5 border border-border p-4 space-y-2 text-sm">
						<div className="flex justify-between text-muted font-medium">
							<span>Base price</span>
							<span>{formatNaira(subscription.priceMonthly)} / mo</span>
						</div>
						{(subscription.includedSeats ?? 0) > 0 && (
							<div className="flex justify-between text-muted font-medium">
								<span>
									{subscription.includedSeats} seats included
								</span>
								<span>{formatNaira(0)}</span>
							</div>
						)}
						{subscription.seatPrice > 0 &&
							(subscription.billableSeats ?? 0) > 0 && (
								<div className="flex justify-between text-muted font-medium">
									<span>
										{subscription.billableSeats} extra seat
										{(subscription.billableSeats ?? 0) !== 1
											? "s"
											: ""}{" "}
										× {formatNaira(subscription.seatPrice)}
									</span>
									<span>
										{formatNaira(
											(subscription.billableSeats ?? 0) *
												subscription.seatPrice,
										)}{" "}
										/ mo
									</span>
								</div>
							)}
						<div className="flex justify-between font-black text-foreground pt-2 border-t border-border">
							<span>Recurring total</span>
							<span>{formatNaira(subscription.monthlyCost)} / mo</span>
						</div>
					</div>
				</div>
			) : (
				<div className="rounded-default border border-dashed border-border bg-muted/5 p-8 text-center">
					<span className="material-icons-outlined text-muted/40 text-4xl block mb-2">
						credit_card_off
					</span>
					<p className="font-bold text-foreground">No Active Plan</p>
					<p className="text-sm text-muted mt-1 font-medium">
						Choose a plan below to unlock features and invite your team.
					</p>
				</div>
			)}

			<div className="rounded-default border border-border bg-card p-6 shadow-soft space-y-4">
				<div>
					<label className="block text-sm font-bold text-foreground capitalize mb-3">
						Billing Cycle
					</label>
					<div className="flex gap-2">
						{(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
							<button
								key={cycle}
								type="button"
								onClick={() => setBillingCycle(cycle)}
								className={`px-4 py-2 rounded-default text-xs font-bold capitalize border-[0.5px] transition-all ${
									billingCycle === cycle
										? "bg-primary text-white border-primary"
										: "border-border text-muted hover:text-foreground"
								}`}
							>
								{cycle}
							</button>
						))}
					</div>
					<p className="text-xs text-muted font-medium mt-2">
						Recurring charges use Paystack subscriptions and renew automatically.
					</p>
				</div>
				<label className="block text-sm font-bold text-foreground capitalize">
					Seats For Plan Change
				</label>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setSeats((s) => Math.max(1, s - 1))}
						className="w-9 h-9 rounded-default border border-border flex items-center justify-center text-foreground hover:bg-muted/10 font-bold"
						aria-label="Decrease seats"
					>
						−
					</button>
					<span className="text-lg font-black text-foreground w-8 text-center">
						{seats}
					</span>
					<button
						type="button"
						onClick={() => setSeats((s) => s + 1)}
						className="w-9 h-9 rounded-default border border-border flex items-center justify-center text-foreground hover:bg-muted/10 font-bold"
						aria-label="Increase seats"
					>
						+
					</button>
					<span className="text-sm text-muted font-medium">seats</span>
				</div>
			</div>

			{subscription && (
				<div className="rounded-default border border-primary/20 bg-primary/5 p-6 shadow-soft space-y-4">
					<div>
						<h3 className="text-lg font-black text-foreground tracking-tight">
							Add Seats On Current Plan
						</h3>
						<p className="text-xs text-muted font-medium mt-1">
							Stay on {subscription.planName}.{" "}
							{(subscription.includedSeats ?? 0) > 0
								? `First ${subscription.includedSeats} seats are included; you only pay for seats above that.`
								: "Recurring charge is base price plus per-seat fees."}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() =>
								setSeatUpgradeTarget((s) => {
									const min = subscription.seats + 1;
									const current = s ?? min;
									return Math.max(min, current - 1);
								})
							}
							className="w-9 h-9 rounded-default border border-border flex items-center justify-center font-bold"
						>
							−
						</button>
						<span className="text-lg font-black w-8 text-center">
							{seatUpgradeTarget ?? subscription.seats + 1}
						</span>
						<button
							type="button"
							onClick={() =>
								setSeatUpgradeTarget(
									(seatUpgradeTarget ?? subscription.seats + 1) + 1,
								)
							}
							className="w-9 h-9 rounded-default border border-border flex items-center justify-center font-bold"
						>
							+
						</button>
					</div>
					{(() => {
						const currentPlan = plans.find((p) => p.id === subscription.planId);
						const target =
							seatUpgradeTarget ?? subscription.seats + 1;
						if (!currentPlan) return null;
						const included = currentPlan.includedSeats ?? 0;
						const billable = Math.max(0, target - included);
						const prevBillable = Math.max(
							0,
							subscription.seats - included,
						);
						const addedBillable = billable - prevBillable;
						const total = calcTotal(currentPlan, target, billingCycle);
						const dueToday = calcSeatUpgradeDelta(
							currentPlan,
							subscription.seats,
							target,
							billingCycle,
						);
						return (
							<div className="text-sm font-medium text-foreground space-y-1">
								<p>
									Total seats: {target} ({included} included, {billable}{" "}
									billable)
								</p>
								{addedBillable > 0 && currentPlan.seatPrice > 0 && (
									<p className="text-muted">
										+{addedBillable} new paid seat
										{addedBillable !== 1 ? "s" : ""} ×{" "}
										{formatNaira(currentPlan.seatPrice)} — already-paid seats
										are not charged again
									</p>
								)}
								<p className="font-black text-primary">
									Due today: {formatNaira(dueToday)}
								</p>
								<p className="font-bold">
									New recurring total: {formatNaira(total)}/
									{billingCycle === "yearly" ? "yr" : "mo"}
								</p>
							</div>
						);
					})()}
					<Button
						fullWidth
						isLoading={checkoutLoading}
						onClick={handleSeatUpgrade}
					>
						Pay & Add Seats
					</Button>
				</div>
			)}

			{plans.length > 0 ? (
				<div className="space-y-4">
					<div className="flex flex-wrap items-end justify-between gap-3">
						<div>
							<h3 className="text-lg font-black text-foreground tracking-tight">
								Available Plans
							</h3>
							<p className="text-xs text-muted font-medium mt-1">
								Compare tiers and upgrade when you need more capacity.
							</p>
						</div>
						{showBillingPageLink && (
							<Link
								href={`/${tenantSlug}/settings/billing`}
								className="text-xs font-bold text-primary hover:underline"
							>
								Full billing details →
							</Link>
						)}
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						{plans.map((plan) => {
							const isCurrent = subscription?.planId === plan.id;
							const planTierRank = TIER_ORDER[plan.tier] ?? 0;
							const isUpgrade =
								!isCurrent && planTierRank > currentTierRank;
							const total = calcTotal(plan, seats, billingCycle);
							const isFree = total <= 0;

							return (
								<div
									key={plan.id}
									className={`rounded-default border p-5 space-y-4 bg-card shadow-soft ${
										isCurrent
											? "border-primary ring-1 ring-primary/20"
											: "border-border"
									}`}
								>
									<div className="flex items-start justify-between gap-2">
										<div>
											<p className="font-black text-foreground">
												{plan.name}
											</p>
											<span
												className={`text-xs font-bold px-2 py-0.5 rounded-default mt-1 inline-block capitalize ${TIER_BADGE_CLASS[plan.tier] ?? "bg-foreground/5 text-muted"}`}
											>
												{plan.tier.toLowerCase()}
											</span>
										</div>
										{isCurrent && (
											<span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-default">
												Current
											</span>
										)}
										{isUpgrade && !isCurrent && (
											<span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-default">
												Upgrade
											</span>
										)}
									</div>

									<div>
										<p className="text-2xl font-black text-foreground">
											{formatNaira(plan.priceMonthly)}
											<span className="text-sm font-medium text-muted">
												{" "}
												/ mo base
											</span>
										</p>
										{plan.seatPrice > 0 && (
											<p className="text-xs text-muted font-medium mt-1">
												+ {formatNaira(plan.seatPrice)} per seat ·{" "}
												<span className="text-foreground font-bold">
													{formatNaira(total)}/
													{billingCycle === "yearly" ? "yr" : "mo"} for{" "}
													{seats} seats
												</span>
											</p>
										)}
									</div>

									<Button
										fullWidth
										size="sm"
										variant={isCurrent ? "ghost" : "primary"}
										disabled={isCurrent || checkoutLoading}
										isLoading={
											checkoutLoading && selectedPlanId === plan.id
										}
										onClick={() => handleUpgrade(plan.id)}
									>
										{isCurrent
											? "Current Plan"
											: isFree
												? "Activate Free Plan"
												: isUpgrade
													? "Upgrade"
													: "Switch Plan"}
									</Button>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<p className="text-sm text-muted font-medium">
					No plans are available right now. Contact your platform administrator.
				</p>
			)}
		</div>
	);
}
