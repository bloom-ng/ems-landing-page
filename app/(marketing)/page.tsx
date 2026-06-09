"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function MarketingPage() {
	return (
		<>
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-20 lg:pt-24 pb-32 bg-[#FCFAFC]">
				<div className="mx-auto max-w-[1280px] w-full min-h-[600px] lg:min-h-[984px] flex flex-col justify-center lg:justify-between items-center text-center px-6">
					<div className="flex justify-center mb-8 lg:mb-0">
						<div className="flex items-center gap-[10px] w-[199px] h-[40px] p-[8px] rounded-[40px] border-[0.5px] border-green/20 bg-green/10 transition-all hover:bg-green/20 cursor-default justify-center">
							<div className="h-2 w-2 rounded-full bg-green animate-pulse" />
							<span className="text-[11px] font-black text-green tracking-widest uppercase">
								Free 7 Days Trial
							</span>
						</div>
					</div>

					<h1 className="w-full max-w-[763px] text-[30px]/[38px] md:text-[45px]/[53px] lg:text-[50px]/[58px] font-bold text-black text-center mb-6 lg:mb-0 font-nunito">
						Manage Your Entire Workforce In One Place
					</h1>

					<p className="w-full max-w-[620px] text-[14px]/[22px] sm:text-[20px]/[28px] font-normal text-black text-center mb-8 lg:mb-0 font-nunito">
						Ogaflow brings payroll, attendance, leaves, scheduling, and performance into a single clean workspace, for teams of any size.
					</p>

					<div className="flex justify-center w-full py-4">
						<div className="relative w-full max-w-[896px] overflow-hidden rounded-[16px] border border-border bg-green/5 aspect-[16/9] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] group">
							<video
								className="w-full h-full object-cover"
								autoPlay
								loop
								muted
								playsInline
							>
								<source src="https://bloomdigitmedia.com/images/hero-vid.mp4" type="video/mp4" />
								<div className="absolute inset-0 flex items-center justify-center bg-green/5">
									<span className="text-4xl font-black text-green/20 tracking-tighter uppercase select-none transition-all group-hover:scale-105 group-hover:text-green/20">
										Video Demo
									</span>
								</div>
							</video>
							<div className="absolute inset-0 bg-gradient-to-br from-green/20 via-transparent to-transparent opacity-30 pointer-events-none" />
						</div>
					</div>

					<div className="flex justify-center mt-8 lg:mt-4">
						<Button variant="primary" size="lg" className="!bg-green !border-green/20 hover:!bg-green/90 px-8 sm:px-10 py-4 sm:py-5 shadow-2xl shadow-green/30 text-[20px]/[24px] font-bold tracking-[0.02em] font-nunito">
							Start Free Trial
						</Button>
					</div>
				</div>
			</section>

			{/* Built for Real Teams */}
			<section className="py-20">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-10 flex flex-col items-start">
						<h2 className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] font-bold leading-tight md:leading-[48px] lg:leading-[56px] tracking-[0.02em] text-left font-nunito text-black">
							Built For Real Teams
						</h2>
						<p className="max-w-2xl text-[20px] font-normal text-black leading-[28px] tracking-[0.02em] font-nunito">
							Whether you are a 10 person startup or a 5,000 person enterprise, Ogaflow scales to fit your needs.
						</p>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{ title: "Small Businesses (1–50)", icon: "groups" },
							{ title: "Mid-size (50–500)", icon: "corporate_fare" },
							{ title: "Enterprise (500+)", icon: "domain" },
							{ title: "Multi-location", icon: "public" },
						].map((item, i) => (
							<div
								key={i}
								className="flex flex-col gap-6 rounded-default border border-border bg-neutral-50/50 p-8 transition-all hover:bg-white hover:shadow-2xl group"
							>
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-inner bg-green/10 text-green group-hover:scale-110 transition-transform">
									<span className="material-icons-outlined !text-2xl">
										{item.icon}
									</span>
								</div>
								<span className="text-lg font-black text-black">
									{item.title}
								</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Trusted By */}
			<section className="border-border py-15 bg-[#FCFAFC]">
				<div className="mx-auto max-w-7xl px-6 text-center">
					<h3 className="mb-5 text-[24px] font-bold leading-[32px] tracking-[0.02em] text-black font-nunito">
						TRUSTED BY
					</h3>
					<div className="flex flex-wrap justify-center gap-8 sm:gap-20 opacity-30 grayscale transition-all hover:opacity-100 hover:grayscale-0">
						{[1, 2, 3, 4, 5].map((i) => (
							<span key={i} className="text-3xl font-black tracking-tighter text-black select-none">
								BLOOM
							</span>
						))}
					</div>
				</div>
			</section>

			{/* Modern Platform (Features) */}
			<section className="bg-neutral-50/50 py-20 border-border/50">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-16 lg:mb-24 text-center">
						<h2 className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] mx-auto max-w-4xl font-bold leading-tight md:leading-[48px] lg:leading-[56px] tracking-[0.02em] text-center font-nunito text-black">
							A Modern Platform For The Full Employee Lifecycle
						</h2>
						<p className="mx-auto max-w-3xl text-[20px] font-normal text-black leading-[28px] tracking-[0.02em] font-nunito">
							From first hire to final payslip. Ogaflow handles every step so your HR team can focus on people, not paperwork.
						</p>
					</div>

					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{[
							{
								title: "Time & Attendance",
								desc: "Real-time clock-in/out, GPS geofencing, overtime tracking, and automated timesheets synced to payroll.",
								icon: "schedule",
							},
							{
								title: "Payroll Management",
								desc: "Automate salary calculations, statutory deductions, multi-currency payments, and payslip distribution.",
								icon: "payments",
							},
							{
								title: "Leave Management",
								desc: "Approve, track, and forecast leave balances with a visual drag-and-drop calendar and custom policies.",
								icon: "event_available",
							},
							{
								title: "Performance Reviews",
								desc: "OKR tracking, 360° peer reviews, manager notes, and development plans tied together in one flow.",
								icon: "bar_chart",
							},
							{
								title: "Self-Service Portal",
								desc: "Employees update profiles, request time off, and view payslips without needing HR involvement.",
								icon: "person_search",
							},
							{
								title: "Analytics & Reporting",
								desc: "Live workforce dashboards and AI-generated insights surfacing trends and risks before they compound.",
								icon: "trending_up",
							},
						].map((feature, i) => (
							<div
								key={i}
								className="group rounded-default border border-border bg-white p-10 transition-all hover:-translate-y-2 hover:border-green/30 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)]"
							>
								<div className="mb-8 flex h-14 w-14 items-center justify-center rounded-inner bg-green/10 text-green group-hover:bg-green group-hover:text-white transition-all duration-300">
									<span className="material-icons-outlined !text-3xl">
										{feature.icon}
									</span>
								</div>
								<h3 className="mb-4 text-2xl font-bold font-nunito text-black">
									{feature.title}
								</h3>
								<p className="text-base font-normal leading-relaxed font-nunito text-black">
									{feature.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>


			{/* Final CTA */}
			<section className="py-20 bg-white">
				<div className="mx-auto max-w-4xl px-6">
					<div className="rounded-[32px] border border-border bg-[#AFB1B5]/5 p-8 sm:p-24 text-center shadow-border relative overflow-hidden group">
						<div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-green/5 blur-3xl transition-all group-hover:scale-150" />
						<div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-green/5 blur-3xl transition-all group-hover:scale-150" />
						
						<h2 className="relative mb-8 text-[32px] md:text-[36px] lg:text-[40px] font-bold leading-tight md:leading-[44px] lg:leading-[56px] tracking-[0.02em] text-center font-nunito text-black">
							Ready To Automate Your Workflow?
						</h2>
						<p className="relative mx-auto mb-14 max-w-2xl text-[18px] font-normal text-black leading-[28px] tracking-[0.02em] text-center font-nunito">
							Join thousands of companies using Ogaflow to save time, reduce errors, and build better workplaces.
						</p>
						<div className="relative flex flex-col items-center justify-center gap-4 sm:gap-[28px] sm:flex-row">
							<Button variant="primary" size="lg" className="!bg-green !border-green/20 hover:!bg-green/90 px-10 py-5 text-[20px]/[24px] font-bold tracking-[0.02em] font-nunito shadow-2xl shadow-green/20">
								Get Started For Free
							</Button>
							<Button variant="outline" size="lg" className="!text-green !border-green/20 hover:!bg-green/5 px-10 py-5 text-[20px]/[24px] font-bold tracking-[0.02em] font-nunito">
								View Pricing
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
