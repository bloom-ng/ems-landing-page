"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getPublicPlans, type PublicPlan } from "@/lib/api/public";
import { formatNaira } from "@/lib/currency";

export default function PlansPage() {
	const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
	const [seatCount, setSeatCount] = useState(25);
	const [apiPlans, setApiPlans] = useState<PublicPlan[]>([]);
	const [plansLoading, setPlansLoading] = useState(true);

	useEffect(() => {
		getPublicPlans()
			.then(setApiPlans)
			.catch(() => setApiPlans([]))
			.finally(() => setPlansLoading(false));
	}, []);

	function calcPlanTotal(plan: PublicPlan, seats: number) {
		const base =
			billingCycle === "annual" ? plan.priceYearly : plan.priceMonthly;
		const billable = Math.max(0, seats - (plan.includedSeats ?? 0));
		return base + (plan.seatPrice ?? 0) * billable;
	}

	const plansFromApi = apiPlans.map((plan) => {
		const isEnterprise = plan.tier === "ENTERPRISE";
		const displayPrice =
			plan.priceMonthly <= 0 && plan.seatPrice <= 0
				? 0
				: (billingCycle === "annual" ? plan.priceYearly : plan.priceMonthly);

		return {
			id: plan.id,
			name: plan.name || plan.tier,
			price: isEnterprise && plan.priceMonthly >= 20000 ? "Custom" : displayPrice,
			description: plan.description ?? "",
			seatPrice: plan.seatPrice,
			includedSeats: plan.includedSeats,
			trialDays: plan.trialDays,
			cta: isEnterprise ? "Contact Us" : "Get Started",
			variant: (plan.tier === "STARTER" ? "primary" : "outline") as
				| "primary"
				| "outline",
			highlight: plan.tier === "STARTER",
			features: plan.features,
		};
	});

	const plans = plansFromApi;

	const faqs = [
		{
			question: "What counts as a seat?",
			answer: "A seat is one active employee account. Deactivated accounts do not count toward your total.",
		},
		{
			question: "Can I change plans anytime?",
			answer: "Yes, upgrade or downgrade at any time. Changes are prorated to your billing cycle.",
		},
		{
			question: "Is there a setup fee?",
			answer: "No setup fees, ever. You only pay the per-seat monthly or annual fee.",
		},
		{
			question: "What payment methods do you accept?",
			answer: "All major credit cards, bank transfers, and invoice billing for Enterprise.",
		},
	];

	const starterPlan = apiPlans.find((p) => p.tier === "STARTER");
	const starterPrice = starterPlan ? calcPlanTotal(starterPlan, seatCount) : 0;

	return (
		<main className="flex flex-col bg-white overflow-x-hidden">
			{/* Hero Section */}
			<section className="pt-12 md:pt-20 pb-16 text-center">
				<div className="mx-auto max-w-[1280px] w-full flex flex-col justify-center items-center text-center px-6">
					<h1 className="w-full max-w-[763px] text-[28px]/[36px] md:text-[40px]/[48px] lg:text-[50px]/[58px] font-bold text-black text-center mb-6 lg:mb-4 font-nunito tracking-tight">
						Simple pricing for teams
					</h1>
					<p className="w-full max-w-[700px] text-[14px]/[22px] md:text-[18px]/[26px] font-normal text-black text-center mb-10 font-nunito">
						Get a pricing plan that scales with your organizations and also scale up or down anytime you want.
					</p>

					{/* Billing Toggle */}
					<div className="flex justify-center mb-12 md:mb-16">
						<div className="flex items-center p-1 bg-green/5 rounded-full border border-green/10">
							<button
								onClick={() => setBillingCycle("monthly")}
								className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all ${billingCycle === "monthly" ? "bg-green text-white shadow-lg shadow-green/20" : "text-green hover:bg-green/5"
									}`}
							>
								Monthly
							</button>
							<button
								onClick={() => setBillingCycle("annual")}
								className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all ${billingCycle === "annual" ? "bg-green text-white shadow-lg shadow-green/20" : "text-green hover:bg-green/5"
									}`}
							>
								Annual (20% off)
							</button>
						</div>
					</div>

					{/* Pricing Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
						{plansLoading && (
							<p className="col-span-full text-center text-muted-foreground font-medium">
								Loading plans…
							</p>
						)}
						{plans.map((plan) => (
							<div
								key={plan.name}
								className={`flex flex-col p-6 md:p-8 rounded-[24px] border transition-all hover:shadow-2xl hover:shadow-green/5 ${plan.highlight ? "border-green bg-green/5 ring-1 ring-green/50 shadow-xl shadow-green/5" : "border-border bg-white"
									}`}
							>
								<div className="text-left mb-8">
									<span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase block mb-4">
										{plan.name}
									</span>
									<div className="flex items-baseline gap-1">
										<span className="text-3xl md:text-4xl font-black text-black">
											{typeof plan.price === "number"
												? formatNaira(plan.price)
												: plan.price}
										</span>
										{typeof plan.price === "number" && (
											<span className="text-sm font-bold text-muted-foreground">/mo</span>
										)}
									</div>
									{plan.seatPrice && (
										<div className="mt-1">
											<p className="text-[10px] font-bold text-muted-foreground">
												{formatNaira(plan.seatPrice)}/seat —{" "}
												{plan.includedSeats ?? 0}{" "}
												seats included
											</p>
										</div>
									)}
									<p className="mt-4 text-[13px] font-medium text-black/60 leading-relaxed">
										{plan.description}
									</p>
								</div>

								<div className="mb-8">
									<Link
										href={
											plan.cta === "Contact Us"
												? "/contact"
												: `/signup/tenant${"id" in plan && plan.id ? `?planId=${plan.id}` : ""}`
										}
									>
										<Button
											variant={plan.variant}
											className={`w-full py-4 rounded-xl text-[18px] font-bold capitalize tracking-[0.02em] font-nunito h-14 ${plan.variant === "primary"
												? "!bg-green !text-white !border-green/20 hover:!bg-green/90 shadow-lg shadow-green/20"
												: "!bg-green/10 !text-green !border-green/10 hover:!bg-green/20"
												}`}
										>
											{plan.cta}
										</Button>
									</Link>
								</div>

								<ul className="flex-1 space-y-4 text-left">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-start gap-3">
											<span className="material-icons-outlined text-[18px] text-green font-bold">
												check
											</span>
											<span className="text-[13px] font-medium text-black/70">{feature}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Seat Based Pricing Section */}
			<section className="py-16 md:py-24 bg-white border-y border-border/10">
				<div className="mx-auto max-w-7xl px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
						<div className="space-y-8">
							<div className="text-left">
								<h2 className="w-full max-w-[763px] text-[28px]/[36px] md:text-[40px]/[48px] lg:text-[50px]/[58px] font-bold text-black mb-6 font-nunito tracking-tight">
									Seat based pricing
								</h2>
								<p className="w-full max-w-[700px] text-[14px]/[22px] md:text-[18px]/[26px] font-normal text-black mb-10 font-nunito">
									Pay only for the seats you use. Scale up or down anytime.
								</p>
							</div>

							<div className="bg-muted/5 p-6 md:p-8 rounded-[24px] border border-border shadow-sm">
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
									<span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Number of Seats</span>
									<div className="flex items-center gap-4 bg-green/5 p-2 rounded-xl border border-green/10">
										<button
											onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
											className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-border text-green hover:bg-green hover:text-white transition-all shadow-sm"
										>
											<span className="material-icons-outlined text-sm">remove</span>
										</button>
										<span className="text-xl font-black text-green w-12 text-center font-nunito">{seatCount}</span>
										<button
											onClick={() => setSeatCount(seatCount + 1)}
											className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-border text-green hover:bg-green hover:text-white transition-all shadow-sm"
										>
											<span className="material-icons-outlined text-sm">add</span>
										</button>
									</div>
								</div>

								<div className="relative pt-6 pb-2">
									<input
										type="range"
										min="1"
										max="500"
										value={seatCount}
										onChange={(e) => setSeatCount(parseInt(e.target.value))}
										className="w-full h-2 bg-green/10 rounded-full appearance-none cursor-pointer accent-green"
									/>
									<div className="flex justify-between mt-4">
										<span className="text-[10px] font-black text-muted-foreground uppercase">1 seat</span>
										<span className="text-[10px] font-black text-muted-foreground uppercase">500+ seats</span>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-center lg:justify-end">
							{/* Result Card */}
							<div className="bg-muted/5 w-full max-w-md p-8 md:p-10 rounded-[32px] border-2 border-green shadow-2xl shadow-green/10 transform hover:scale-[1.01] transition-transform">
								<div className="text-left mb-8">
									<span className="text-green text-[16px] font-bold font-nunito tracking-[0.2em] uppercase inline-block mb-6">
										{starterPlan?.name || "STARTER"}
									</span>
									<div className="flex items-baseline gap-1">
										<span className="text-5xl md:text-6xl font-black text-black font-nunito tracking-tighter">
											{formatNaira(starterPrice)}
										</span>
										<span className="text-lg font-bold text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
									</div>
									<p className="mt-2 text-sm font-bold text-muted-foreground">
										{formatNaira(starterPlan?.seatPrice || 0)}/seat beyond included — {seatCount} seats
									</p>
									<p className="mt-4 text-[15px] font-medium text-black/60 leading-relaxed font-nunito">
										{starterPlan?.description || "For small teams getting started with HR."}
									</p>
								</div>

								<Button
									variant="primary"
									size="lg"
									className="w-full py-6 rounded-2xl text-[20px]/[24px] font-bold uppercase tracking-[0.02em] font-nunito !bg-green !text-white !border-green/20 hover:!bg-green/90 shadow-xl shadow-green/20 mb-8 h-16"
								>
									Get Started
								</Button>

								<ul className="space-y-4">
									{[
										"Up to 50 seats",
										"Time & attendance",
										"Leave management",
										"Basic reporting",
										"Email support",
									].map((feature) => (
										<li key={feature} className="flex items-center gap-4">
											<div className="w-5 h-5 rounded-full bg-green/10 flex items-center justify-center">
												<span className="material-icons-outlined text-[14px] text-green font-black">check</span>
											</div>
											<span className="text-[14px] font-semibold text-black/80 font-nunito">{feature}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="bg-[#AFB1B5]/5 py-16 md:py-24">
				<div className="mx-auto max-w-4xl px-6">
					<h2 className="text-[28px] md:text-[40px] font-bold text-black text-center mb-12 md:mb-16 font-nunito tracking-tight">
						Frequently Asked Questions
					</h2>
					<div className="space-y-0">
						{faqs.map((faq, index) => (
							<div key={index} className="py-6 md:py-8 border-b border-border/50 last:border-0 group">
								<h3 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4 group-hover:text-green transition-colors font-nunito">
									{faq.question}
								</h3>
								<p className="text-[14px] md:text-[16px] text-black/70 leading-relaxed font-normal font-nunito">
									{faq.answer}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
