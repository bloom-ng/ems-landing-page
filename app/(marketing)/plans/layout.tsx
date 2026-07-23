import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
	title: "Pricing & Plans",
	description:
		"Simple, transparent pricing for Ogaflow. Choose a plan that scales with your team, pay per seat, and start with a free trial — no hidden fees.",
	path: "/plans",
	keywords: [
		"Ogaflow pricing",
		"HR software pricing",
		"employee management pricing",
		"per seat pricing",
		"HR software plans",
		"free trial",
	],
});

export default function PlansLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
