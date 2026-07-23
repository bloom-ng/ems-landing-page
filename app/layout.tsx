import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/components/providers/ToastProvider";
import { siteConfig, absoluteUrl } from "@/lib/seo";

const nunitoSans = Nunito_Sans({
	variable: "--font-nunito",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: `${siteConfig.name} — All-in-One Employee Management System`,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	keywords: [...siteConfig.keywords],
	authors: [{ name: siteConfig.name, url: siteConfig.url }],
	creator: siteConfig.name,
	publisher: siteConfig.name,
	category: "Business Software",
	alternates: {
		canonical: "/",
	},
	icons: {
		icon: "/icons/icon-main.png",
		shortcut: "/icons/icon-main.png",
		apple: "/icons/icon-main.png",
	},
	openGraph: {
		type: "website",
		locale: siteConfig.locale,
		url: siteConfig.url,
		siteName: siteConfig.name,
		title: `${siteConfig.name} — All-in-One Employee Management System`,
		description: siteConfig.shortDescription,
	},
	twitter: {
		card: "summary_large_image",
		site: siteConfig.twitterHandle,
		creator: siteConfig.twitterHandle,
		title: `${siteConfig.name} — All-in-One Employee Management System`,
		description: siteConfig.shortDescription,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
};

export const viewport: Viewport = {
	themeColor: siteConfig.themeColor,
	colorScheme: "light",
};

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Organization",
			"@id": `${siteConfig.url}/#organization`,
			name: siteConfig.name,
			url: siteConfig.url,
			logo: {
				"@type": "ImageObject",
				url: absoluteUrl("/images/ogaflow-logo.png"),
			},
			description: siteConfig.description,
			sameAs: [] as string[],
		},
		{
			"@type": "WebSite",
			"@id": `${siteConfig.url}/#website`,
			url: siteConfig.url,
			name: siteConfig.name,
			description: siteConfig.shortDescription,
			publisher: { "@id": `${siteConfig.url}/#organization` },
			inLanguage: "en",
		},
		{
			"@type": "SoftwareApplication",
			"@id": `${siteConfig.url}/#software`,
			name: siteConfig.name,
			applicationCategory: "BusinessApplication",
			operatingSystem: "Web",
			url: siteConfig.url,
			description: siteConfig.description,
			publisher: { "@id": `${siteConfig.url}/#organization` },
			offers: {
				"@type": "Offer",
				priceCurrency: "NGN",
				price: "0",
				description: "Start with a free trial.",
			},
		},
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={nunitoSans.variable} suppressHydrationWarning>
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;800;900&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
					rel="stylesheet"
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</head>
			<body
				className="antialiased font-nunito transition-colors duration-300"
				suppressHydrationWarning
			>
				{children}
				<ToastProvider />
			</body>
		</html>
	);
}
