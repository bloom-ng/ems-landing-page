"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export function MarketingHeader() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const pathname = usePathname();

	const navLinks = [
		{ label: "Home", href: "/" },
		{ label: "Solutions", href: "/solutions" },
		{ label: "Plan", href: "/plans" },
		{ label: "Contact", href: "/contact" },
	];

	// Close the mobile menu on Escape
	React.useEffect(() => {
		if (!isMenuOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsMenuOpen(false);
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [isMenuOpen]);

	return (
		<nav
			className="sticky top-0 z-50 w-full bg-[#FEFEFE] backdrop-blur-md"
			aria-label="Primary"
		>
			<div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
				<div className="flex items-center gap-12">
					<Link href="/" className="flex items-center gap-3 group" aria-label="OgaFlow — home">
						{/* <div className="h-8 w-6 rounded-inner bg-green transition-transform group-hover:scale-110 shadow-sm" />
						<span className="text-xl font-black tracking-tighter text-black">
							OGAFLOW
						</span> */}
						<Image src="/images/ogaflow-logo.png" alt="OgaFlow" width={150} height={150} />
					</Link>

					<div className="hidden items-center gap-8 lg:flex">
						{navLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								aria-current={pathname === link.href ? "page" : undefined}
								className={`text-[16px]/[24px] font-normal transition-colors hover:text-green ${pathname === link.href ? "text-green" : "text-[#878A90]"
									}`}
							>
								{link.label}
							</Link>
						))}
					</div>
				</div>

				<div className="flex items-center gap-4 sm:gap-[28px]">
					<div className="hidden sm:flex items-center gap-4 sm:gap-[28px]">

						<Link href={process.env.NEXT_PUBLIC_FRONTEND_URL ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/signup/tenant` : "https://app.ogaflow.com/signup/tenant"} className="w-auto sm:w-[215px]">
							<Button
								variant="primary"
								size="md"
								className="!bg-[#10B981] hover:!bg-[#10B981]/90 h-[40px] sm:h-[50px] w-full px-6 sm:px-0 text-sm sm:text-[16px]/[24px] font-normal font-medium text-[#F8FAFC]"
							>
								Get Started For Free
							</Button>
						</Link>
					</div>

					<button
						type="button"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
						aria-expanded={isMenuOpen}
						aria-controls="mobile-menu"
						className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-black lg:hidden"
					>
						<span className="material-icons-outlined" aria-hidden="true">
							{isMenuOpen ? "close" : "menu"}
						</span>
					</button>
				</div>
			</div>

			{isMenuOpen && (
				<div id="mobile-menu" className="absolute top-20 left-0 right-0 border-b border-border bg-white p-6 shadow-xl lg:hidden">
					<div className="flex flex-col gap-6">
						{navLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								aria-current={pathname === link.href ? "page" : undefined}
								className={`text-lg font-bold ${pathname === link.href ? "text-green" : "text-[#878A90]"
									}`}
								onClick={() => setIsMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
						<hr className="border-border" />
						<div className="flex flex-col gap-4">

							<Link href={process.env.NEXT_PUBLIC_FRONTEND_URL ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}/signup/tenant` : "https://app.ogaflow.com/signup/tenant"} className="w-full">
								<Button
									variant="primary"
									size="lg"
									className="!bg-green !border-green/20 w-full h-12 font-bold"
									onClick={() => setIsMenuOpen(false)}
								>
									Get Started For Free
								</Button>
							</Link>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
