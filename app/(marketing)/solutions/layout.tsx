import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
	title: "Solutions & Features",
	description:
		"Explore Ogaflow's solutions: employee self-service, seamless payroll, attendance tracking, recruitment, performance appraisals, helpdesk, and a knowledge base — everything your team needs in one platform.",
	path: "/solutions",
	keywords: [
		"HR solutions",
		"employee self-service",
		"payroll management",
		"attendance tracking",
		"recruitment software",
		"performance appraisal",
		"helpdesk",
		"knowledge base",
	],
});

export default function SolutionsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
