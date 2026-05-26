import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/api/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";

interface NavItem {
	label: string;
	href: string;
	icon: string; // Material Icons name
}

interface SidebarProps {
	items: NavItem[];
	title: string;
	subtitle?: string;
	tenantSlug?: string;
	showNewProject?: boolean;
	footerContent?: React.ReactNode;
	isOpen?: boolean;
	onToggle?: () => void;
	logoUrl?: string;
}

export function Sidebar({
	items,
	title,
	subtitle,
	tenantSlug,
	showNewProject = true,
	footerContent,
	isOpen,
	onToggle,
	logoUrl,
}: SidebarProps) {
	const pathname = usePathname();

	const handleLogout = () => {
		logout(tenantSlug);
	};

	return (
		<>
			{/* Mobile Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[75] md:hidden animate-in fade-in duration-300"
					onClick={onToggle}
				/>
			)}

			<aside
				className={`fixed md:sticky top-0 left-0 z-[80] w-64 border-r-[0.5px] border-border flex flex-col bg-sidebar h-screen transition-all duration-300 ease-in-out ${
					isOpen
						? "translate-x-0"
						: "-translate-x-full md:translate-x-0"
				}`}
			>
				<div className="p-6 flex items-center justify-between">
					<div className="flex items-center gap-3">
						{logoUrl ? (
							<div className="h-10 w-10 rounded-default overflow-hidden bg-primary/5 flex items-center justify-center shadow-lg shadow-primary/20">
								<img
									src={
										logoUrl.startsWith("/uploads")
											? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${logoUrl}`
											: logoUrl
									}
									alt={`${title} logo`}
									className="w-full h-full object-contain"
								/>
							</div>
						) : (
							<div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
								<span className="material-icons-outlined text-[24px]">
									admin_panel_settings
								</span>
							</div>
						)}
						<div>
							<h1 className="text-sm font-bold tracking-tight text-foreground leading-tight">
								{title}
							</h1>
							{subtitle && (
								<p className="text-[10px] font-bold text-muted tracking-widest mt-0.5 capitalize">
									{subtitle}
								</p>
							)}
						</div>
					</div>

					<button
						onClick={onToggle}
						className="md:hidden p-2 text-muted hover:text-primary transition-colors"
					>
						<span className="material-icons-outlined">close</span>
					</button>
				</div>

				<nav className="flex-1 px-4 space-y-1 py-1 overflow-y-auto">
					{items.map((item) => {
						const isRootDashboard =
							item.href === "/platform" ||
							(tenantSlug && item.href === `/${tenantSlug}`);

						const hasMoreSpecificMatch = items.some(
							(other) =>
								other !== item &&
								other.href.length > item.href.length &&
								(pathname === other.href ||
									pathname.startsWith(other.href + "/")),
						);

						const isActive = isRootDashboard
							? pathname === item.href
							: (pathname === item.href ||
									pathname.startsWith(item.href + "/")) &&
								!hasMoreSpecificMatch;
						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => isOpen && onToggle?.()}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
									isActive
										? "bg-primary/10 text-primary font-semibold"
										: "text-muted hover:bg-foreground/5 dark:hover:bg-foreground/10"
								}`}
							>
								<span
									className={`material-icons-outlined text-[22px] transition-transform duration-200 ${isActive ? "scale-105" : "group-hover:scale-105"}`}
								>
									{item.icon}
								</span>
								<span className="text-sm tracking-tight">
									{item.label}
								</span>
							</Link>
						);
					})}
				</nav>

				<div className="p-4 mt-auto border-t-[0.5px] border-border space-y-1">
					{footerContent && (
						<div className="mb-4">{footerContent}</div>
					)}

					<ThemeToggle />

					<Button
						variant="ghost"
						fullWidth
						size="sm"
						onClick={handleLogout}
						className="justify-start gap-3 py-2 text-muted hover:text-rose-500 hover:bg-rose-500/10 font-bold text-xs capitalize tracking-widest"
					>
						<span className="material-icons-outlined text-[20px]">
							logout
						</span>
						Logout
					</Button>
				</div>
			</aside>
		</>
	);
}
