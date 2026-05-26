import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/components/providers/ToastProvider";

const nunitoSans = Nunito_Sans({
	variable: "--font-nunito",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Ems Platform",
	description: "Multi-tenant Employee Management System Platform",
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
