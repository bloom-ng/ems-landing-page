"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
	const [activeTab, setActiveTab] = useState("Book a Demo");

	const contactInfo = [
		{
			label: "Abuja",
			value: "Gwarinpa, Abuja",
			icon: "location_on",
		},
		{
			label: "Mail",
			value: "hello@ogaflow.com",
			icon: "mail",
		},
		{
			label: "Phone",
			value: "+234 800 OGAFLOW",
			icon: "call",
		},
		{
			label: "Hours",
			value: "Mon–Fri, 8am–6pm WAT",
			icon: "schedule",
		},
	];

	const tabs = ["Book a Demo", "Start a Trial", "Talk to Sales", "Get Support"];

	return (
		<main className="flex flex-col min-h-screen bg-white">
			{/* Hero Section */}
			<section className="bg-[#F5F5F7] pt-12 md:pt-20 pb-12 md:pb-16 text-center">
				<div className="mx-auto max-w-[1280px] px-6">
					<h1 className="text-[28px] md:text-[45px] lg:text-[50px] font-bold text-black mb-6 font-nunito tracking-tight">
						Let us talk about your team
					</h1>
					<p className="mx-auto max-w-2xl text-[14px] md:text-[18px] text-black/70 mb-10 md:mb-12 font-nunito leading-relaxed">
						Whether you want to upgrade your enterprise infrastructure, a demo, have questions, or are ready to start, we are here.
					</p>

					{/* Info Cards */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20">
						{contactInfo.map((info) => (
							<div
								key={info.label}
								className="bg-white p-6 md:p-8 rounded-[24px] border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group"
							>
								<div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green/10 flex items-center justify-center text-green mb-4 md:mb-6 group-hover:scale-110 transition-transform">
									<span className="material-icons-outlined !text-xl md:!text-2xl">{info.icon}</span>
								</div>
								<span className="text-[12px] font-black tracking-widest text-muted-foreground uppercase mb-2">
									{info.label}
								</span>
								<span className="text-[14px] md:text-[16px] font-bold text-black font-nunito">
									{info.value}
								</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Form Section */}
			<section className="mx-auto max-w-4xl w-full px-6 py-12 md:pb-20 md:mt-12">
				<div className="bg-[#AFB1B5]/5 p-6 md:p-12 rounded-[32px] border border-border shadow-2xl shadow-black/5">
					<div className="mb-8 md:mb-10">
						<h2 className="text-[20px] md:text-[24px] font-bold text-black mb-2 font-nunito">
							Send us a message
						</h2>
						<p className="text-[14px] md:text-[16px] text-black/60 font-nunito">
							We respond within 1 business day.
						</p>
					</div>

					{/* Tabs */}
					<div className="flex flex-wrap gap-2 mb-8 md:mb-10">
						{tabs.map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[12px] md:text-[14px] font-bold transition-all ${
									activeTab === tab
										? "bg-green/10 text-green border border-green/20"
										: "text-black/50 hover:text-black/70 hover:bg-black/5"
								}`}
							>
								{tab}
							</button>
						))}
					</div>

					{/* Form */}
					<form className="space-y-4 md:space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
							<div className="space-y-2">
								<label className="text-[13px] md:text-[14px] font-bold text-black/70 font-nunito ml-1">Full name</label>
								<input
									type="text"
									placeholder="Jace Norman"
									className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all font-nunito text-[14px] md:text-[16px]"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-[13px] md:text-[14px] font-bold text-black/70 font-nunito ml-1">Work email</label>
								<input
									type="email"
									placeholder="add@company.com"
									className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all font-nunito text-[14px] md:text-[16px]"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
							<div className="space-y-2">
								<label className="text-[13px] md:text-[14px] font-bold text-black/70 font-nunito ml-1">Company</label>
								<input
									type="text"
									placeholder="Acme Ltd"
									className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all font-nunito text-[14px] md:text-[16px]"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-[13px] md:text-[14px] font-bold text-black/70 font-nunito ml-1">Team size</label>
								<select className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all font-nunito appearance-none cursor-pointer text-[14px] md:text-[16px]">
									<option>10</option>
									<option>50</option>
									<option>100</option>
									<option>500+</option>
								</select>
							</div>
						</div>

						<div className="space-y-2">
							<label className="text-[13px] md:text-[14px] font-bold text-black/70 font-nunito ml-1">Message</label>
							<textarea
								rows={4}
								placeholder="Tell us about your team and what you need..."
								className="w-full px-4 md:px-5 py-3 md:py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green transition-all font-nunito resize-none text-[14px] md:text-[16px]"
							/>
						</div>

						<div className="pt-4">
							<Button
								variant="primary"
								size="lg"
								className="w-full py-6 rounded-2xl text-[18px] md:text-[20px]/[24px] font-bold uppercase tracking-[0.02em] font-nunito !bg-green !border-green/20 hover:!bg-green/90 shadow-xl shadow-green/20 h-16"
							>
								Send Message
							</Button>
						</div>

						<p className="text-center text-[12px] text-black/40 font-nunito mt-6">
							By submitting, you agree to our <a href="#" className="underline hover:text-green transition-colors">Privacy Policy</a>.
						</p>
					</form>
				</div>
			</section>
		</main>
	);
}
