import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
	title: "Contact Us & Book a Demo",
	description:
		"Get in touch with the Ogaflow team. Book a personalized demo, ask questions about our Employee Management System, or talk to sales about the right plan for your organization.",
	path: "/contact",
	keywords: [
		"contact Ogaflow",
		"book a demo",
		"HR software demo",
		"talk to sales",
		"employee management demo",
	],
});

export default function ContactLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
