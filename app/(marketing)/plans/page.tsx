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
	const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

	const STATIC_PLAN_FEATURES: Record<number, { title: string }[]> = {
		750: [
			{ title: "Employee Database Management" },
			{ title: "HR Management" },
			{ title: "Accounting Management" },
			{ title: "Roles & Access Management" },
		],
		1500: [
			{ title: "Everything in tier 1" },
			{ title: "Department Management" },
			{ title: "Financial Operations" },
			{ title: "Survey & Appraisal Management" },
		],
		2500: [
			{ title: "Everything in tier 2" },
			{ title: "Advanced Accounting Tools" },
			{ title: "Helpdesk Management" },
			{ title: "Recruitment & Requisition Management" },
			{ title: "Project Management" },
			{ title: "Company Policies & Knowledge Management" },
		],
	};

	// Real plan data from api.ogaflow.com/public/plans (used as fallback when proxy is unavailable locally)
	const FALLBACK_PLANS: PublicPlan[] = [
		{
			id: "82c3f9ac-ceac-4652-b293-7d7f3670e284",
			name: "Tier 1",
			tier: "STARTER",
			description: null,
			currency: "NGN",
			priceMonthly: 0,
			priceYearly: 0,
			seatPrice: 750,
			includedSeats: 0,
			employeeLimit: null,
			trialDays: null,
			features: [],
		},
		{
			id: "7825c4cc-9196-4812-83aa-803aff06524c",
			name: "Tier 2",
			tier: "PRO",
			description: null,
			currency: "NGN",
			priceMonthly: 0,
			priceYearly: 0,
			seatPrice: 1500,
			includedSeats: 0,
			employeeLimit: null,
			trialDays: null,
			features: [],
		},
		{
			id: "a0127e2a-177f-4800-9ff9-614a18cd0dda",
			name: "Tier 3",
			tier: "ENTERPRISE",
			description: null,
			currency: "NGN",
			priceMonthly: 0,
			priceYearly: 0,
			seatPrice: 2500,
			includedSeats: 0,
			employeeLimit: null,
			trialDays: null,
			features: [],
		},
	];

	useEffect(() => {
		fetch("/api/proxy/plans")
			.then((res) => {
				if (!res.ok) throw new Error("proxy failed");
				return res.json();
			})
			.then((payload) => {
				if (payload && typeof payload === "object" && "success" in payload && "data" in payload) {
					setApiPlans(payload.data);
				} else if (Array.isArray(payload)) {
					setApiPlans(payload);
				} else {
					setApiPlans(FALLBACK_PLANS);
				}
			})
			.catch(() => {
				// Proxy unavailable locally (macOS LibreSSL TLS issue) — use cached real data
				setApiPlans(FALLBACK_PLANS);
			})
			.finally(() => setPlansLoading(false));
	}, []);

	// Set default selected plan to STARTER once plans load
	useEffect(() => {
		if (apiPlans.length > 0 && selectedPlanId === null) {
			const starter = apiPlans.find((p) => p.tier === "STARTER") ?? apiPlans[0];
			setSelectedPlanId(starter.id);
		}
	}, [apiPlans]);

	/** Price per seat adjusted for billing cycle (annual = 10% off) */
	function effectiveSeatPrice(plan: PublicPlan) {
		return billingCycle === "annual"
			? Math.round(plan.seatPrice * 0.9)
			: plan.seatPrice;
	}

	/** Total cost for the result card */
	function calcPlanTotal(plan: PublicPlan, seats: number) {
		const billable = Math.max(0, seats - (plan.includedSeats ?? 0));
		return effectiveSeatPrice(plan) * billable;
	}

	const plansFromApi = apiPlans.map((plan) => {
		const isStarter = plan.tier === "STARTER" || plan.name === "Tier 1";
		const isEnterprise = plan.tier === "ENTERPRISE" || plan.name === "Tier 3";

		return {
			id: plan.id,
			name: plan.name || plan.tier,
			price: effectiveSeatPrice(plan),
			seatPrice: plan.seatPrice,
			includedSeats: plan.includedSeats,
			trialDays: plan.trialDays,
			cta: "Get Started",
			ctaHref: "https://app.ogaflow.com/signup/tenant",
			isStarter,
			isEnterprise,
			features: STATIC_PLAN_FEATURES[plan.seatPrice] || [],
		};
	});

	const plans = plansFromApi;

	const faqs = [
		{
			question: "How do companies get started with the EMS?",
			answer: "Companies can subscribe to a plan, set up their organization profile, and begin adding employees, departments, and operational records to the system.",
		},
		{
			question: "Is the EMS subscription-based?",
			answer: "Yes. The EMS operates on a subscription model.",
		},
		{
			question: "How does pricing work?",
			answer: "Pricing depends on the subscription plan selected. Different plans provide access to different plugins and platform features.",
		},
		{
			question: "Can I upgrade the subscription plan later?",
			answer: "Yes. Companies can upgrade their subscription plans to access additional plugins and features as their needs grow.",
		},
	];

	// The plan shown in the seat-based calculator card
	const selectedApiPlan =
		apiPlans.find((p) => p.id === selectedPlanId) ??
		apiPlans.find((p) => p.tier === "STARTER") ??
		apiPlans[0] ??
		null;

	const selectedPrice = selectedApiPlan ? calcPlanTotal(selectedApiPlan, seatCount) : 0;

	return (
		<main className="flex flex-col overflow-x-hidden">
			{/* Hero Section */}
			<section className="pt-12 bg-[#F8FAFC] md:pt-20 pb-16 text-center">
				<div className="mx-auto max-w-[1280px] w-full flex flex-col justify-center items-center text-center px-6">
					<h1 className="w-full max-w-[763px] text-[28px]/[36px] md:text-[40px]/[48px] lg:text-[50px]/[58px] font-bold text-black text-center mb-6 lg:mb-4 font-nunito tracking-tight">
						Simple pricing for teams
					</h1>
					<p className="w-full max-w-[700px] text-[14px]/[22px] md:text-[18px]/[26px] font-normal text-black text-center mb-10 font-nunito">
						Get a pricing plan that scales with your organizations and also scale up or down anytime you want.
					</p>

					{/* Billing Toggle */}
					<div className="flex justify-center mb-12 md:mb-16">
						<div className="flex items-center h-[56px] p-1.5 gap-1 bg-[#10B981]/10 rounded-[8px]">
							<button
								onClick={() => setBillingCycle("monthly")}
								className={`h-full w-[150px] md:w-[258px] px-2 md:px-6 flex items-center justify-center rounded-[8px] text-[14px] md:text-[15px] font-bold transition-all ${billingCycle === "monthly"
									? "bg-[#10B981] text-[#F8FAFC] shadow-sm"
									: "text-[#10B981] hover:bg-[#10B981]/5"
									}`}
							>
								Monthly
							</button>
							<button
								onClick={() => setBillingCycle("annual")}
								className={`h-full w-[150px] md:w-[258px] px-2 md:px-6 flex items-center justify-center rounded-[8px] text-[14px] md:text-[15px] font-bold transition-all ${billingCycle === "annual"
									? "bg-[#10B981] text-[#F8FAFC] shadow-sm"
									: "text-[#10B981] hover:bg-[#10B981]/5"
									}`}
							>
								Annual (10% off)
							</button>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 w-full bg-[#FEFEFE]">
				<div className="mx-auto max-w-7xl px-6 text-center">
					{/* Pricing Cards */}
					{plansLoading ? (
						/* Loading skeleton */
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-start">
							{[1, 2, 3, 4].map((i) => (
								<div key={i} className="flex flex-col p-6 md:p-8 rounded-[16px] border-[0.5px] border-[#AFB1B5] bg-[#F8FAFC] animate-pulse">
									<div className="h-4 w-16 bg-gray-200 rounded mb-4" />
									<div className="h-10 w-24 bg-gray-200 rounded mb-4" />
									<div className="h-4 w-full bg-gray-200 rounded mb-2" />
									<div className="h-4 w-3/4 bg-gray-200 rounded mb-8" />
									<div className="h-12 w-full bg-gray-200 rounded mb-6" />
									<div className="space-y-3 pt-6 border-t-[0.5px] border-[#AFB1B5]">
										{[1, 2, 3, 4].map((j) => (
											<div key={j} className="h-4 w-full bg-gray-200 rounded" />
										))}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start max-w-6xl mx-auto">
							{plans.map((plan) => {
								const isSelected = plan.id === selectedPlanId;
								return (
									<div
										key={plan.id}
										onClick={() => setSelectedPlanId(plan.id)}
										className={`group flex flex-col p-8 rounded-[16px] border-[0.5px] bg-[#F8FAFC] transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:bg-[#FEFEFE] ${
											isSelected
												? "border-[#10B981]"
												: "border-[#E2E8F0] hover:border-[#10B981]"
										}`}
									>
										<div className="text-left mb-6">
											<span className={`text-[14px] font-bold tracking-widest uppercase block mb-6 ${plan.isStarter ? "text-[#10B981]" : "text-[#878A90]"}`}>
												{plan.name}
											</span>

											<div className="flex items-baseline mb-4">
												<span className="text-[40px] md:text-[48px] font-bold text-[#101622] tracking-tight leading-none">
													{formatNaira(plan.price as number)}
												</span>
												<span className="text-[16px] md:text-[18px] font-medium text-[#101622] ml-1">
													/seat
												</span>
											</div>

											<div className="mb-6">
												<p className="text-[13px] md:text-[14px] font-medium text-[#878A90]">
													per seat · billed {billingCycle === "annual" ? "annually" : "monthly"}
												</p>
											</div>

											<div className="mb-8">
												<Link href={plan.ctaHref} className="w-full block" onClick={(e) => e.stopPropagation()}>
													<Button className="w-full py-4 rounded-[12px] text-[16px] font-bold tracking-wide font-nunito h-14 !border-transparent shadow-none transition-all !bg-[#10B981]/10 !text-[#10B981] group-hover:!bg-[#10B981] group-hover:!text-[#FEFEFE]">
														{plan.cta}
													</Button>
												</Link>
											</div>

											<div className="w-full h-[0.5px] bg-[#E2E8F0] mb-8" />
										</div>

										{plan.features && plan.features.length > 0 && (
											<ul className="flex-1 space-y-5 text-left">
												{plan.features.map((feature: any, idx: number) => (
													<li key={idx} className="flex items-center gap-3.5">
														<div className="w-[18px] h-[18px] rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
															<img src="/images/check.png" alt="check" style={{ width: '8px', height: '6px' }} />
														</div>
														<span className="text-[15px] font-medium text-[#101622] leading-tight">{feature.title}</span>
													</li>
												))}
											</ul>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			</section>

			{/* Seat Based Pricing Section */}
			<section className="py-16 md:py-24 bg-[#FEFEFE] border-y border-border/10">
				<div className="mx-auto max-w-7xl px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
						<div className="space-y-8">
							<div className="text-left">
								<h2 className="w-full max-w-[763px] text-[28px]/[36px] md:text-[40px]/[48px] lg:text-[50px]/[58px] font-bold text-[#101622] mb-6 font-nunito tracking-tight">
									Seat based pricing
								</h2>
								<p className="w-full max-w-[700px] text-[14px]/[22px] md:text-[18px]/[26px] font-normal text-[#878A90] mb-10 font-nunito">
									Pay only for the seats you use. Scale up or down anytime.
								</p>
							</div>

							<div className="bg-[#F8FAFC] p-6 md:p-8 rounded-[16px] border-[0.5px] border-[#AFB1B5]">
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
									<span className="text-[14px] md:text-[16px] font-bold text-[#101622]">Number of Seats</span>
									<div className="flex items-center gap-4">
										<button
											onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
											className="w-8 h-8 flex items-center justify-center rounded-[4px] bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-all"
										>
											<span className="text-[16px] font-bold leading-none mt-[-2px]">-</span>
										</button>
										<span className="text-[18px] md:text-[20px] font-bold text-[#10B981] min-w-[32px] text-center font-nunito">{seatCount}</span>
										<button
											onClick={() => setSeatCount(seatCount + 1)}
											className="w-8 h-8 flex items-center justify-center rounded-[4px] bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-all"
										>
											<span className="text-[16px] font-bold leading-none mt-[-2px]">+</span>
										</button>
									</div>
								</div>

								<div className="relative pt-2 pb-2">
									<input
										type="range"
										min="1"
										max="500"
										value={seatCount}
										onChange={(e) => setSeatCount(parseInt(e.target.value))}
										className="w-full h-2 bg-[#10B981]/10 rounded-full appearance-none cursor-pointer accent-[#10B981]"
										style={{
											background: `linear-gradient(to right, #10B981 0%, #10B981 ${(seatCount / 500) * 100}%, rgba(16, 185, 129, 0.1) ${(seatCount / 500) * 100}%, rgba(16, 185, 129, 0.1) 100%)`
										}}
									/>
									<div className="flex justify-between mt-4">
										<span className="text-[10px] md:text-[12px] font-medium text-[#878A90]">1 seat</span>
										<span className="text-[10px] md:text-[12px] font-medium text-[#878A90]">500+ seats</span>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-center lg:justify-end">
							{/* Result Card */}
							{plansLoading ? (
								<div className="w-full max-w-md flex flex-col p-6 md:p-8 rounded-[16px] border-[0.5px] border-[#AFB1B5] bg-[#F8FAFC] animate-pulse">
									<div className="h-4 w-20 bg-gray-200 rounded mb-4" />
									<div className="h-10 w-28 bg-gray-200 rounded mb-2" />
									<div className="h-4 w-24 bg-gray-200 rounded mb-4" />
									<div className="h-12 w-full bg-gray-200 rounded mb-6" />
									<div className="space-y-3 pt-6 border-t-[0.5px] border-[#AFB1B5]">
										{[1, 2, 3, 4].map((j) => (
											<div key={j} className="h-4 w-full bg-gray-200 rounded" />
										))}
									</div>
								</div>
							) : selectedApiPlan ? (
								<div className="w-full max-w-md flex flex-col p-6 md:p-8 rounded-[16px] border-[0.5px] border-[#AFB1B5] bg-[#F8FAFC]">
									<div className="text-left mb-6">
										<span className="text-[13px] font-bold tracking-widest uppercase block mb-4 text-[#10B981]">
											{selectedApiPlan.name}
										</span>
										<div className="flex items-baseline gap-1">
											<span className="text-[32px] md:text-[40px] font-bold text-[#101622] tracking-tight">
												{formatNaira(selectedPrice)}
											</span>
											<span className="text-[14px] font-medium text-[#878A90]">/mo</span>
										</div>
										<div className="mt-2">
											<p className="text-[13px] font-medium text-[#878A90]">
												{formatNaira(effectiveSeatPrice(selectedApiPlan))}/seat · {seatCount} seat{seatCount !== 1 ? "s" : ""}
												{billingCycle === "annual" && (
													<span className="ml-2 text-[#10B981] font-semibold">10% off</span>
												)}
											</p>
										</div>
										{selectedApiPlan.description && (
											<p className="mt-4 text-[13px] md:text-[14px] font-medium text-[#101622] leading-[22px]">
												{selectedApiPlan.description}
											</p>
										)}
									</div>

									<div className="mb-6">
										<Link href="https://app.ogaflow.com/signup/tenant" className="w-full block">
											<Button className="w-full py-3 rounded-[8px] text-[16px] md:text-[18px] font-bold tracking-[0.02em] font-nunito h-12 md:h-14 !border-transparent shadow-none transition-all !bg-[#10B981] !text-[#F8FAFC] hover:!bg-[#10B981]/90">
												Get Started
											</Button>
										</Link>
									</div>

									<ul className="space-y-4 text-left border-t-[0.5px] border-[#AFB1B5] pt-6">
										{STATIC_PLAN_FEATURES[selectedApiPlan.seatPrice]?.map((feature, idx) => (
											<li key={idx} className="flex items-start gap-3">
												<div className="w-[12px] h-[12px] rounded-[12px] bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-1">
													<img src="/images/check.png" alt="check" style={{ width: '5.83px', height: '4.47px' }} />
												</div>
												<span className="text-[13px] md:text-[14px] font-medium text-[#101622] leading-tight mt-0.5">{feature.title}</span>
											</li>
										))}
									</ul>
								</div>
							) : null}
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
								<h3 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4 font-nunito">
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
