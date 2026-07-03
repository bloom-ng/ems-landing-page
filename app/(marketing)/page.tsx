"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function MarketingPage() {
	return (
		<>
			{/* Hero Section */}
			<section className="relative overflow-hidden pt-20 lg:pt-24 pb-32 bg-[#F8FAFC]">
				<div className="mx-auto max-w-[1280px] w-full min-h-[600px] lg:min-h-[984px] flex flex-col justify-center lg:justify-between items-center text-center px-6">
					<div className="flex justify-center mb-8 lg:mb-0">
						<div className="flex items-center gap-[10px] w-[199px] h-[40px] p-[8px] rounded-[40px] border-[0.5px] border-[#10B981] bg-[#10B981]/10 transition-all hover:bg-green/20 cursor-default justify-center">
							<div className="h-2 w-2 rounded-full bg-green animate-pulse" />
							<span className="text-[15px] text-green tracking-widest uppercase">
								Welcome to Ogaflow
							</span>
						</div>
					</div>

					<h1 className="w-full max-w-[763px] text-[30px]/[38px] md:text-[45px]/[53px] lg:px-24 lg:text-[50px]/[58px] font-bold text-black text-center mb-6 lg:mb-0 font-nunito !normal-case">
						One system, every team, all in one place.
					</h1>

					<p className="w-full max-w-[620px] text-[14px]/[22px] sm:text-[20px]/[28px] font-normal text-black text-center mb-8 lg:mb-0 font-nunito">
						From hiring, to payroll, attendance to performance, one system handles it all.
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
						<Button variant="primary" size="lg" className="!bg-green !border-green/20 hover:!bg-green/90 px-8 sm:px-10 py-3 sm:py-3.5 text-[20px]/[24px] font-bold tracking-[0.02em] font-nunito">
							Start Free Trial
						</Button>
					</div>
				</div>
			</section>

			{/* Built for Real Teams */}
			<section className="py-20 bg-[#FEFEFE]">
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
								className="flex flex-col gap-6 rounded-[16px] border-[0.5px] border-[#AFB1B5] bg-[#F8FAFC] p-8 transition-all group"
							>
								<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-green/10 text-green group-hover:scale-110 transition-transform">
									<span className="material-icons-outlined !text-2xl">
										{item.icon}
									</span>
								</div>
								<span className="text-lg font-bold text-black">
									{item.title}
								</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Trusted By */}
			<section className="border-border py-15 bg-[#F8FAFC]">
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
			<section className="bg-[#FEFEFE] py-20 border-border/50">
				<div className="mx-auto max-w-7xl px-6">
					<div className="mb-16 lg:mb-24 text-center">
						<h2 className="mb-6 text-[32px] md:text-[40px] lg:text-[48px] mx-auto max-w-4xl font-bold leading-tight md:leading-[48px] lg:leading-[56px] lg:px-32 tracking-[0.02em] text-center font-nunito !normal-case text-black">
							Every employee journey simplified
						</h2>
						<p className="mx-auto max-w-3xl text-[20px] font-normal text-black leading-[28px] tracking-[0.02em] font-nunito">
							Manage employee operations so hiring, leave requests, and payroll are simple, automated, and stress-free.
						</p>
					</div>

					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{[
							{
								title: "Time & Attendance",
								desc: "Employees clock in, GPS verifies location, and overtime is tracked automatically before payroll runs.",
								icon: "schedule",
							},
							{
								title: "Payroll Management",
								desc: "Automate payroll, deductions, multi-currency payments, and payslip delivery in one system.",
								icon: "payments",
							},
							{
								title: "Leave Management",
								desc: "Manage leave requests with fast approvals and a visual calendar that keeps teams organized.",
								icon: "event_available",
							},
							{
								title: "Performance Reviews",
								desc: "Track OKRs, feedback, reviews, and employee growth all in one place.",
								icon: "bar_chart",
							},
							{
								title: "Self-Service Portal",
								desc: "Employees can manage profiles, request leave, and access payslips without HR assistance.",
								icon: "person_search",
							},
							{
								title: "Analytics & Reporting",
								desc: "Monitor workforce data in real time with dashboards and AI insights that help identify trends and risks early.",
								icon: "trending_up",
							},
						].map((feature, i) => (
							<div
								key={i}
								className="group rounded-[16px] border-[0.5px] border-[#AFB1B5] bg-[#F8FAFC] p-6 transition-all hover:-translate-y-2 hover:border-[#10B981]"
							>
								<div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[8px] bg-green/10 text-green group-hover:bg-green group-hover:text-white transition-all duration-300">
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
			<section className="py-20 bg-[#FEFEFE]">
				<div className="mx-auto max-w-4xl px-6">
					<div className="rounded-[16px] border-[0.5px] border-[#AFB1B5] bg-[#F8FAFC] p-8 sm:p-24 text-center relative overflow-hidden group">
						<h2 className="relative mb-8 text-[32px] md:text-[36px] lg:text-[48px] lg:px-8 font-bold leading-tight md:leading-[44px] lg:leading-[56px] tracking-[0.02em] text-center font-nunito text-black">
							Your team runs better from here
						</h2>
						<p className="relative mx-auto mb-14 max-w-2xl text-[18px] lg:px-12 font-normal text-black leading-[28px] tracking-[0.02em] text-center font-nunito">
							Less stress, more time, stronger teams. Join thousands of companies already excelling with EMS.
						</p>
						<div className="relative flex flex-col items-center justify-center gap-4 sm:gap-[28px] sm:flex-row">
							<Button
								variant="primary"
								size="lg"
								className="w-full sm:w-[230px] px-8 !bg-[#10B981] !text-[#F8FAFC] text-[20px]/[24px] font-bold tracking-[0.02em] font-nunito h-14 !border-transparent shadow-none"
							>
								Get Started For Free
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="w-full sm:w-[230px] px-8 !bg-[#10B981]/10 !text-[#10B981] text-[20px]/[24px] font-bold tracking-[0.02em] font-nunito h-14 !border-transparent shadow-none"
							>
								View Pricing
							</Button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
