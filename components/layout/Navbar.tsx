"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface NavbarProps {
	userName?: string;
	userRole?: string;
	pageTitle?: string;
	tenantSlug?: string;
	onSearch?: (query: string) => void;
	onMenuClick?: () => void;
	notificationCount?: number;
}

export function Navbar({
	userName,
	userRole,
	pageTitle,
	tenantSlug,
	onSearch,
	onMenuClick,
	notificationCount = 0,
}: NavbarProps) {
	return (
		<header className="h-16 border-b-[0.5px] border-border flex items-center justify-between px-4 md:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-[70] transition-all duration-300">
			<div className="flex items-center gap-2 md:gap-4">
				<button
					onClick={onMenuClick}
					className="p-2 -ml-2 text-muted hover:text-primary transition-colors md:hidden"
				>
					<span className="material-icons-outlined text-[24px]">
						menu
					</span>
				</button>
				<h2 className="text-sm md:text-lg font-bold uppercase tracking-tight text-foreground line-clamp-1">
					{pageTitle || "Platform Admin: Dashboard"}
				</h2>
			</div>

			<div className="flex items-center gap-3 md:gap-6">
				<div className="relative w-48 lg:w-72 group hidden sm:block">
					<Input
						type="text"
						placeholder="Search resources..."
						className="pl-10 h-auto text-sm"
						onChange={(e) => onSearch?.(e.target.value)}
					/>
					<span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px] group-focus-within:text-primary transition-colors pointer-events-none">
						search
					</span>
				</div>

				<div className="flex items-center gap-2">
					{tenantSlug ? (
						<NotificationBell tenantSlug={tenantSlug} />
					) : (
						<button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative transition-all group">
							<span className="material-icons-outlined group-hover:text-primary transition-colors">
								notifications
							</span>
						</button>
					)}

					<div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 md:mx-2" />

					<div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
						<div className="text-right hidden lg:block leading-none">
							<p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
								{userName || "Admin"}
							</p>
							<p className="text-[10px] font-bold text-muted dark:text-slate-400 capitalize tracking-widest mt-1">
								{userRole || "Admin"}
							</p>
						</div>
						<div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black overflow-hidden group-hover:scale-110 transition-transform">
							{userName?.charAt(0) || "A"}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
