import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
	title: "Privacy Policy",
	description:
		"Read Ogaflow's Privacy Policy to understand how we collect, use, protect, and manage your personal and organizational data across our Employee Management System.",
	path: "/privacy",
	keywords: ["Ogaflow privacy policy", "data protection", "privacy"],
});

export default function PrivacyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
