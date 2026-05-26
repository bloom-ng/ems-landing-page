"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getArticleTree, createArticle, trashArticle, toggleFavourite, type KnowledgeArticle } from "@/lib/api/knowledge";
import { toast } from "sonner";

interface ArticleSidebarProps {
	currentArticleId?: string;
	onArticleCreated?: (id: string) => void;
}

export default function ArticleSidebar({
	currentArticleId,
	onArticleCreated,
}: ArticleSidebarProps) {
	const params = useParams();
	const router = useRouter();
	const tenantSlug = params.tenantSlug as string;

	const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	const [isLoading, setIsLoading] = useState(true);
	const [contextMenu, setContextMenu] = useState<{
		articleId: string;
		x: number;
		y: number;
	} | null>(null);

	const fetchTree = useCallback(async () => {
		try {
			const data = await getArticleTree(tenantSlug);
			setArticles(data);
			// Auto-expand the path to the current article
			if (currentArticleId) {
				const ancestors = new Set<string>();
				const findAncestors = (id: string) => {
					const a = data.find((x: KnowledgeArticle) => x.id === id);
					if (a?.parentId) {
						ancestors.add(a.parentId);
						findAncestors(a.parentId);
					}
				};
				findAncestors(currentArticleId);
				setExpanded((prev) => new Set([...prev, ...ancestors]));
			}
		} catch {
			// silent
		} finally {
			setIsLoading(false);
		}
	}, [tenantSlug, currentArticleId]);

	useEffect(() => {
		fetchTree();
	}, [fetchTree]);

	const handleNewArticle = async (parentId?: string) => {
		try {
			const article = await createArticle(tenantSlug, {
				title: "Untitled",
				parentId,
			});
			await fetchTree();
			if (parentId) setExpanded((prev) => new Set([...prev, parentId]));
			router.push(`/${tenantSlug}/knowledge/${article.id}`);
			onArticleCreated?.(article.id);
		} catch {
			toast.error("Failed to create article");
		}
	};

	const handleTrash = async (id: string) => {
		try {
			await trashArticle(tenantSlug, id);
			toast.success("Article moved to trash");
			await fetchTree();
			if (currentArticleId === id) {
				router.push(`/${tenantSlug}/knowledge`);
			}
		} catch {
			toast.error("Failed to trash article");
		}
	};

	const handleFavourite = async (id: string) => {
		try {
			await toggleFavourite(tenantSlug, id);
			await fetchTree();
		} catch {
			toast.error("Failed to update favourite");
		}
	};

	const toggleExpand = (id: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	// Build tree structure
	const roots = articles.filter((a) => !a.parentId);
	const favourites = articles.filter((a) => a.isFavourite);

	const renderNode = (article: KnowledgeArticle, depth = 0) => {
		const children = articles.filter((a) => a.parentId === article.id);
		const isExpanded = expanded.has(article.id);
		const isActive = article.id === currentArticleId;
		const hasChildren = (article._count?.children ?? 0) > 0;

		return (
			<div key={article.id}>
				<div
					className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-150 ${
						isActive
							? "bg-primary/10 text-primary"
							: "text-muted hover:bg-foreground/5"
					}`}
					style={{ paddingLeft: `${12 + depth * 16}px` }}
				>
					{/* Expand arrow */}
					<button
						onClick={() => hasChildren && toggleExpand(article.id)}
						className={`w-4 h-4 flex items-center justify-center flex-shrink-0 transition-transform ${
							isExpanded ? "rotate-90" : ""
						} ${!hasChildren ? "opacity-0 pointer-events-none" : ""}`}
					>
						<span className="material-icons-outlined text-[14px]">
							chevron_right
						</span>
					</button>

					{/* Article link */}
					<Link
						href={`/${tenantSlug}/knowledge/${article.id}`}
						className="flex items-center gap-1.5 flex-1 min-w-0"
					>
						<span className="text-base leading-none flex-shrink-0">
							{article.emoji || "📄"}
						</span>
						<span
							className={`text-sm truncate font-medium ${isActive ? "text-primary font-semibold" : ""}`}
						>
							{article.title}
						</span>
						{article.isLocked && (
							<span className="material-icons-outlined text-[12px] text-muted/60 flex-shrink-0">
								lock
							</span>
						)}
					</Link>

					{/* Hover actions */}
					<div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 flex-shrink-0 transition-opacity">
						<button
							onClick={() => handleFavourite(article.id)}
							className="p-0.5 rounded hover:bg-primary/10 hover:text-primary"
							title={article.isFavourite ? "Remove favourite" : "Add favourite"}
						>
							<span
								className={`material-icons-outlined text-[14px] ${article.isFavourite ? "text-amber-500" : ""}`}
							>
								{article.isFavourite ? "star" : "star_border"}
							</span>
						</button>
						<button
							onClick={() => handleNewArticle(article.id)}
							className="p-0.5 rounded hover:bg-primary/10 hover:text-primary"
							title="Add child article"
						>
							<span className="material-icons-outlined text-[14px]">add</span>
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								setContextMenu({
									articleId: article.id,
									x: e.clientX,
									y: e.clientY,
								});
							}}
							className="p-0.5 rounded hover:bg-primary/10 hover:text-primary"
						>
							<span className="material-icons-outlined text-[14px]">
								more_horiz
							</span>
						</button>
					</div>
				</div>

				{/* Children */}
				{isExpanded && children.length > 0 && (
					<div>{children.map((c) => renderNode(c, depth + 1))}</div>
				)}
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-32">
				<div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-col h-full">
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3 border-b border-border">
					<span className="text-xs font-black capitalize tracking-widest text-muted">
						Knowledge
					</span>
					<button
						onClick={() => handleNewArticle()}
						className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
						title="New article"
					>
						<span className="material-icons-outlined text-[16px]">add</span>
					</button>
				</div>

				<div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
					{/* Favourites */}
					{favourites.length > 0 && (
						<div className="mb-2">
							<p className="text-[10px] font-black capitalize tracking-widest text-muted px-3 mb-1">
								⭐ Favourites
							</p>
							{favourites.map((a) => (
								<div key={`fav-${a.id}`}>
									<Link
										href={`/${tenantSlug}/knowledge/${a.id}`}
										className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
											a.id === currentArticleId
												? "bg-primary/10 text-primary font-semibold"
												: "text-muted hover:bg-foreground/5"
										}`}
									>
										<span>{a.emoji || "📄"}</span>
										<span className="truncate font-medium">{a.title}</span>
									</Link>
								</div>
							))}
							<div className="h-px bg-border mx-3 my-2" />
						</div>
					)}

					{/* Workspace tree */}
					<div>
						<p className="text-[10px] font-black capitalize tracking-widest text-muted px-3 mb-1">
							🏢 Workspace
						</p>
						{roots.length > 0 ? (
							roots.map((a) => renderNode(a))
						) : (
							<p className="text-[11px] text-muted font-bold px-3 py-4 text-center">
								No articles yet
							</p>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className="px-4 py-3 border-t border-border">
					<button
						onClick={() => handleNewArticle()}
						className="w-full flex items-center gap-2 text-[11px] font-black capitalize tracking-widest text-muted hover:text-primary transition-colors"
					>
						<span className="material-icons-outlined text-[16px]">add_circle_outline</span>
						New Article
					</button>
				</div>
			</div>

			{/* Context menu */}
			{contextMenu && (
				<>
					<div
						className="fixed inset-0 z-40"
						onClick={() => setContextMenu(null)}
					/>
					<div
						className="fixed z-50 w-44 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
						style={{ top: contextMenu.y, left: contextMenu.x }}
					>
						<div className="p-1.5 space-y-0.5">
							<button
								onClick={() => {
									handleNewArticle(contextMenu.articleId);
									setContextMenu(null);
								}}
								className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
							>
								<span className="material-icons-outlined text-[16px]">add</span>
								New Child Article
							</button>
							<button
								onClick={() => {
									handleFavourite(contextMenu.articleId);
									setContextMenu(null);
								}}
								className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
							>
								<span className="material-icons-outlined text-[16px]">star_border</span>
								Toggle Favourite
							</button>
							<div className="h-px bg-border my-1" />
							<button
								onClick={() => {
									handleTrash(contextMenu.articleId);
									setContextMenu(null);
								}}
								className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"
							>
								<span className="material-icons-outlined text-[16px]">delete_outline</span>
								Move to Trash
							</button>
						</div>
					</div>
				</>
			)}
		</>
	);
}
