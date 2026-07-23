import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
	title: "Terms of Service",
	description:
		"Review the Terms of Service governing your use of Ogaflow's Employee Management System, including your rights, responsibilities, and our commitments to you.",
	path: "/terms",
	keywords: ["Ogaflow terms of service", "terms and conditions", "user agreement"],
});

export default function TermsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
