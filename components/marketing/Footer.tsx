"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
	const footerLinks = [
		{
			title: "Product",
			links: [
				{ label: "Features", href: "/solutions" },
				{ label: "Solutions", href: "/solutions" },
			],
		},
		{
			title: "Company",
			links: [
				{ label: "Contact Us", href: "/contact" },
				{ label: "Pricing", href: "/plans" },
			],
		},
		{
			title: "Resources",
			links: [
				{ label: "Documentation", href: "#" },
			],
		},
		{
			title: "Legal",
			links: [
				{ label: "Privacy Policy", href: "/privacy" },
				{ label: "Terms Of Service", href: "/terms" },
			],
		},
	];

	return (
		<footer className="bg-[#FEFEFE] pt-24 pb-12">
			<div className="mx-auto max-w-7xl px-6">
				<div className="mb-24 grid gap-16 lg:grid-cols-12">
					<div className="lg:-mt-12 lg:col-span-5">
						<div className="gap-3">
							{/* <div className="h-8 w-6 rounded-inner bg-green shadow-sm" />
							<span className="text-2xl font-black tracking-tighter text-black">
								OGAFLOW
							</span> */}
							<Image src="/images/ogaflow-logo.png" alt="OgaFlow" width={150} height={150} />
						</div>
						<p className="max-w-sm lg:pr-20 lg:-mt-6 text-[20px] text-neutral-400 font-medium">
							One platform to manage your entire workforce
						</p>
					</div>

					<div className="grid grid-cols-2 gap-12 sm:grid-cols-4 lg:col-span-7">
						{footerLinks.map((col, i) => (
							<div key={i}>
								<h4 className="mb-8 text-lg font-bold text-neutral-400 !uppercase">
									{col.title}
								</h4>
								<ul className="space-y-4">
									{col.links.map((link) => (
										<li key={link.label}>
											<Link
												href={link.href}
												className="text-base text-black hover:text-green transition-colors"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col items-center justify-center border-t border-border/50 pt-8 gap-6">
					<div className="flex items-center gap-2">
						<div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black text-neutral-400">
							<Image src="/images/copyright.png" alt="" aria-hidden="true" width={20} height={20} />
						</div>
						<p className="text-sm text-neutral-400">
							2026. Ogaflow. All rights reserved
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
