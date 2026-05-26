"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function MarketingHeader() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const pathname = usePathname();

	const navLinks = [
		{ label: "Home", href: "/" },
		{ label: "Solutions", href: "/solutions" },
		{ label: "Plan", href: "/plans" },
		{ label: "Contact", href: "/contact" },
	];

	return (
		<nav className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
			<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
				<div className="flex items-center gap-12">
					<Link href="/" className="flex items-center gap-3 group">
						<div className="h-8 w-6 rounded-inner bg-green transition-transform group-hover:scale-110 shadow-sm" />
						<span className="text-xl font-black tracking-tighter text-black">
							JEDAQ
						</span>
					</Link>

					<div className="hidden items-center gap-8 lg:flex">
						{navLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className={`text-[16px]/[24px] font-normal transition-colors hover:text-green ${
									pathname === link.href ? "text-green" : "text-black"
								}`}
							>
								{link.label}
							</Link>
						))}
					</div>
				</div>

				<div className="flex items-center gap-4 sm:gap-[28px]">
					<div className="hidden sm:flex items-center gap-4 sm:gap-[28px]">
						<Link
							href="/login"
							className="text-base sm:text-[16px]/[24px] font-normal text-green transition-colors hover:text-green/80"
						>
							Login
						</Link>
						<Button
							variant="primary"
							size="md"
							className="!bg-green !border-green/20 hover:!bg-green/90 h-[40px] sm:h-[56px] w-auto sm:w-[316px] px-6 sm:px-0 text-sm sm:text-[16px]/[24px] font-normal shadow-lg shadow-green/20"
						>
							Get Started For Free
						</Button>
					</div>

					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-black lg:hidden"
					>
						<span className="material-icons-outlined">
							{isMenuOpen ? "close" : "menu"}
						</span>
					</button>
				</div>
			</div>

			{isMenuOpen && (
				<div className="absolute top-20 left-0 right-0 border-b border-border bg-white p-6 shadow-xl lg:hidden">
					<div className="flex flex-col gap-6">
						{navLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className={`text-lg font-bold ${
									pathname === link.href ? "text-green" : "text-black"
								}`}
								onClick={() => setIsMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
						<hr className="border-border" />
						<div className="flex flex-col gap-4">
							<Link
								href="/login"
								className="flex h-12 items-center justify-center rounded-lg border border-border font-bold text-black"
								onClick={() => setIsMenuOpen(false)}
							>
								Login
							</Link>
							<Button
								variant="primary"
								size="lg"
								className="!bg-green !border-green/20 w-full h-12 font-bold"
								onClick={() => setIsMenuOpen(false)}
							>
								Get Started For Free
							</Button>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
