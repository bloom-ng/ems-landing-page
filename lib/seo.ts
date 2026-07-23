import type { Metadata } from "next";

/**
 * Central SEO configuration for the Ogaflow marketing site.
 * Consumed by the root layout (site-wide defaults + JSON-LD) and by
 * per-route `layout.tsx` files that override title/description/canonical.
 */

export const siteConfig = {
	name: "Ogaflow",
	// Marketing site origin. Override in production via NEXT_PUBLIC_SITE_URL.
	url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ogaflow.com").replace(
		/\/$/,
		"",
	),
	appUrl: process.env.NEXT_PUBLIC_FRONTEND_URL ?? "https://app.ogaflow.com",
	tagline: "One system, every team, all in one place.",
	description:
		"Ogaflow is an all-in-one Employee Management System that unifies HR, payroll, attendance, recruitment, and performance management for growing teams. From hiring to payroll, one platform handles it all.",
	// Short description for social cards (kept under ~200 chars).
	shortDescription:
		"All-in-one Employee Management System for HR, payroll, attendance, recruitment, and performance — one platform for every team.",
	locale: "en_US",
	twitterHandle: "@ogaflow",
	themeColor: "#10B981",
	keywords: [
		"Ogaflow",
		"employee management system",
		"EMS software",
		"HR software",
		"HRIS",
		"HR management platform",
		"payroll software",
		"payroll software Nigeria",
		"attendance management",
		"performance management",
		"appraisal software",
		"recruitment software",
		"applicant tracking system",
		"employee self-service",
		"HR SaaS",
		"workforce management",
		"leave management",
		"helpdesk software",
		"knowledge base software",
	],
} as const;

/** Absolute URL helper for canonical / OG links. */
export function absoluteUrl(path = "/"): string {
	return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Build page-level metadata that inherits the site-wide OpenGraph/Twitter
 * defaults from the root layout while overriding the fields a page cares about.
 */
export function buildMetadata({
	title,
	description,
	path = "/",
	keywords,
}: {
	title: string;
	description: string;
	path?: string;
	keywords?: string[];
}): Metadata {
	const canonical = absoluteUrl(path);
	return {
		title,
		description,
		keywords: keywords ?? [...siteConfig.keywords],
		alternates: { canonical },
		openGraph: {
			title,
			description,
			url: canonical,
			siteName: siteConfig.name,
			type: "website",
			locale: siteConfig.locale,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
	};
}
