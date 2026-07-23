import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	const routes: {
		path: string;
		priority: number;
		changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
	}[] = [
		{ path: "/", priority: 1, changeFrequency: "weekly" },
		{ path: "/solutions", priority: 0.9, changeFrequency: "weekly" },
		{ path: "/plans", priority: 0.9, changeFrequency: "weekly" },
		{ path: "/contact", priority: 0.7, changeFrequency: "monthly" },
		{ path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
		{ path: "/terms", priority: 0.3, changeFrequency: "yearly" },
	];

	return routes.map(({ path, priority, changeFrequency }) => ({
		url: absoluteUrl(path),
		lastModified,
		changeFrequency,
		priority,
	}));
}
