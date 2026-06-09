"use client";

import React from "react";
import Link from "next/link";

export function MarketingFooter() {
	const footerLinks = [
		{
			title: "Product",
			links: [
				{ label: "Features", href: "#" },
				{ label: "Solutions", href: "/solutions" },
				{ label: "Integrations", href: "#" },
				{ label: "Security", href: "#" },
			],
		},
		{
			title: "Company",
			links: [
				{ label: "Blog", href: "#" },
				{ label: "Contact Us", href: "#" },
				{ label: "Pricing", href: "#" },
			],
		},
		{
			title: "Resources",
			links: [
				{ label: "Documentation", href: "#" },
				{ label: "Help Centre", href: "#" },
				{ label: "Reference", href: "#" },
			],
		},
		{
			title: "Legal",
			links: [
				{ label: "Privacy Policy", href: "#" },
				{ label: "Terms Of Service", href: "#" },
			],
		},
	];

	return (
		<footer className="border-t border-border bg-white pt-24 pb-12">
			<div className="mx-auto max-w-7xl px-6">
				<div className="mb-24 grid gap-16 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<div className="mb-8 flex items-center gap-3">
							<div className="h-8 w-6 rounded-inner bg-green shadow-sm" />
							<span className="text-2xl font-black tracking-tighter text-black">
								OGAFLOW
							</span>
						</div>
						<p className="max-w-sm text-base text-neutral-400 font-medium">
							The modern employee management platform for growing teams.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-12 sm:grid-cols-4 lg:col-span-7">
						{footerLinks.map((col, i) => (
							<div key={i}>
								<h4 className="mb-8 text-lg font-bold text-neutral-400">
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
						<div className="h-6 w-6 rounded-full border border-border flex items-center justify-center text-[10px] font-black text-neutral-400">
							©
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
