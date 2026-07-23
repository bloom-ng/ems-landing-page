import React from "react";
import { MarketingHeader } from "@/components/marketing/Header";
import { MarketingFooter } from "@/components/marketing/Footer";

export default function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-white text-black selection:bg-green/30 font-nunito">
			<a href="#main-content" className="skip-link">
				Skip to main content
			</a>
			<MarketingHeader />
			<main id="main-content" tabIndex={-1}>
				{children}
			</main>
			<MarketingFooter />
		</div>
	);
}
