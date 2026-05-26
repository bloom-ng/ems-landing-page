"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SolutionsPage() {
	const [activeTab, setActiveTab] = React.useState("All");

	const features = [
		{
			id: 1,
			title: "Automated Scheduling Engine",
			desc: "Real-time clock-in/out, GPS geofencing, overtime tracking, and automated timesheets synced to payroll.",
			icon: "calendar_month",
			category: "HR",
		},
		{
			id: 2,
			title: "Seamless Payroll",
			desc: "Direct integration from time sheets to deposits. Error free, compliant and transparent.",
			icon: "payments",
			category: "Accounting",
		},
		{
			id: 3,
			title: "Performance Tracking",
			desc: "Visualize KPIs, track goals and facilitate meaningful 1 on 1s with structured data.",
			icon: "bar_chart",
			category: "Employee",
		},
		{
			id: 4,
			title: "Global Compliance Guardrails",
			desc: "Stay ahead of labor regulations, mandatory breaks tracking and audit ready reporting.",
			icon: "language",
			category: "HR",
		},
	];

	const filteredFeatures = activeTab === "All" 
		? features 
		: features.filter(f => f.category === activeTab);

	const tabs = ["All", "HR", "Accounting", "Employee"];

	return (
		<>
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-32 pb-16 md:pb-24 bg-[#FCFAFC]">
				<div className="mx-auto max-w-[1280px] w-full flex flex-col justify-center items-center text-center px-6">
					<h1 className="w-full max-w-[763px] text-[28px]/[36px] md:text-[40px]/[48px] lg:text-[50px]/[58px] font-bold text-black text-center mb-6 lg:mb-4 font-nunito tracking-tight">
						Intelligent operations<br className="hidden md:block" /> for modern teams
					</h1>
					<p className="w-full max-w-[700px] text-[14px]/[22px] md:text-[18px]/[26px] font-normal text-black text-center mb-10 font-nunito">
						Automate scheduling, streamline payroll and unlock performance insight with structured transparency.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-[20px] lg:gap-[28px] w-full sm:w-auto">
						<Button
							variant="primary"
							size="lg"
							className="w-full sm:w-auto !bg-green !border-green/20 hover:!bg-green/90 px-8 shadow-2xl shadow-green/30 text-[18px]/[24px] font-bold tracking-[0.02em] font-nunito h-14"
						>
							Explore Platform
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="w-full sm:w-auto !bg-green/10 !text-green !border-green/10 hover:!bg-green/20 px-8 text-[18px]/[24px] font-bold tracking-[0.02em] font-nunito h-14"
						>
							Book Demo
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-16 md:py-24 bg-white">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-12 md:mb-16">
						<h2 className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] font-bold leading-tight tracking-[0.02em] text-left font-nunito text-black">
							Features
						</h2>
						
						{/* Tabs */}
						<div className="flex flex-wrap gap-2 md:gap-4 border-b border-border/20 pb-6">
							{tabs.map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`px-4 py-2 rounded-full text-[12px] md:text-[14px] font-bold transition-all ${
										activeTab === tab 
										? "bg-green/10 text-green border border-green/20 shadow-sm" 
										: "text-black/40 hover:text-black/70 hover:bg-black/5"
									}`}
								>
									{tab}
								</button>
							))}
						</div>
					</div>

					<div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
						{filteredFeatures.map((feature) => (
							<div 
								key={feature.id}
								className="group flex flex-col gap-6 rounded-[24px] border border-border bg-[#F8FAF8]/50 p-6 md:p-10 transition-all hover:bg-white hover:border-green/30 hover:shadow-2xl hover:-translate-y-1"
							>
								<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green/10 text-green group-hover:bg-green group-hover:text-white transition-all duration-300">
									<span className="material-icons-outlined !text-3xl">
										{feature.icon}
									</span>
								</div>
								<div>
									<h3 className="mb-3 text-xl md:text-2xl font-bold font-nunito text-black">
										{feature.title}
									</h3>
									<p className="text-[14px] md:text-[16px] leading-relaxed font-nunito text-black/70">
										{feature.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Ready CTA Section */}
			<section className="py-16 md:py-24 bg-white">
				<div className="mx-auto max-w-5xl px-6">
					<div className="rounded-[32px] border border-border bg-[#AFB1B5]/5 p-8 md:p-24 text-center shadow-border relative overflow-hidden group">
						<div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-green/5 blur-3xl transition-all group-hover:scale-150" />
						<div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-green/5 blur-3xl transition-all group-hover:scale-150" />
						
						<h2 className="relative mb-6 text-[28px] md:text-[36px] lg:text-[40px] font-bold leading-tight tracking-[0.02em] text-center font-nunito text-black">
							Ready to see it in action?
						</h2>
						<p className="relative mx-auto mb-10 max-w-2xl text-[14px]/[22px] md:text-[18px]/[26px] font-normal text-black text-center font-nunito">
							Book a 20-minute demo and we will walk you through everything relevant to your business.
						</p>
						<div className="relative flex justify-center">
							<Button
								variant="primary"
								size="lg"
								className="w-full sm:w-auto !bg-green !border-green/20 hover:!bg-green/90 px-12 py-4 text-[18px]/[24px] font-bold tracking-[0.02em] font-nunito shadow-2xl shadow-green/20 h-14"
							>
								Book Demo
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
