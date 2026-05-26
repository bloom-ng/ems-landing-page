"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	toggleLock,
	toggleFavourite,
	trashArticle,
} from "@/lib/api/knowledge";
import { toast } from "sonner";

interface ArticleToolbarProps {
	article: {
		id: string;
		title: string;
		emoji: string | null;
		isLocked: boolean;
		isFavourite: boolean;
	};
	isSaving: boolean;
	onTitleChange: (title: string) => void;
	onEmojiChange: (emoji: string) => void;
	onShareClick: () => void;
	onVersionHistoryClick: () => void;
	onArticleDeleted: () => void;
	onArticleUpdated: () => void;
}

const QUICK_EMOJIS = [
	"📄","📋","📝","📊","📅","✅","🎯","🔍","💡","⚡","🚀","🏢","👥","🎙️","📈","🔒","📌","🗂️","🌐","🛠️",
];

export default function ArticleToolbar({
	article,
	isSaving,
	onTitleChange,
	onEmojiChange,
	onShareClick,
	onVersionHistoryClick,
	onArticleDeleted,
	onArticleUpdated,
}: ArticleToolbarProps) {
	const params = useParams();
	const router = useRouter();
	const tenantSlug = params.tenantSlug as string;

	const [showMoreMenu, setShowMoreMenu] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [isFavourite, setIsFavourite] = useState(article.isFavourite);
	const [isLocked, setIsLocked] = useState(article.isLocked);

	const handleFavourite = async () => {
		try {
			const res = await toggleFavourite(tenantSlug, article.id);
			setIsFavourite(res.isFavourite);
		} catch {
			toast.error("Failed to update favourite");
		}
	};

	const handleLock = async () => {
		try {
			const res = await toggleLock(tenantSlug, article.id);
			setIsLocked(res.isLocked);
			onArticleUpdated();
			toast.success(res.isLocked ? "Article locked" : "Article unlocked");
		} catch {
			toast.error("Failed to toggle lock");
		}
		setShowMoreMenu(false);
	};

	const handleTrash = async () => {
		if (!confirm("Move this article to trash?")) return;
		try {
			await trashArticle(tenantSlug, article.id);
			toast.success("Moved to trash");
			onArticleDeleted();
			router.push(`/${tenantSlug}/knowledge`);
		} catch {
			toast.error("Failed to trash article");
		}
		setShowMoreMenu(false);
	};

	return (
		<div className="h-14 border-b border-border flex items-center px-6 gap-3 bg-background/80 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
			{/* Emoji picker */}
			<div className="relative">
				<button
					onClick={() => setShowEmojiPicker((p) => !p)}
					className="text-2xl hover:bg-foreground/5 rounded-lg p-1 transition-colors"
					title="Change emoji"
				>
					{article.emoji || "📄"}
				</button>
				{showEmojiPicker && (
					<>
						<div
							className="fixed inset-0 z-40"
							onClick={() => setShowEmojiPicker(false)}
						/>
						<div className="absolute top-10 left-0 z-50 bg-card border border-border rounded-2xl shadow-xl p-3 w-56 grid grid-cols-5 gap-1.5 animate-in fade-in zoom-in-95 duration-150">
							{QUICK_EMOJIS.map((e) => (
								<button
									key={e}
									onClick={() => {
										onEmojiChange(e);
										setShowEmojiPicker(false);
									}}
									className="text-xl hover:bg-primary/10 rounded-lg p-1 transition-colors aspect-square"
								>
									{e}
								</button>
							))}
						</div>
					</>
				)}
			</div>

			{/* Title input */}
			<input
				type="text"
				value={article.title}
				onChange={(e) => onTitleChange(e.target.value)}
				disabled={isLocked}
				className="flex-1 bg-transparent text-foreground font-black text-lg tracking-tight outline-none placeholder:text-muted/40 min-w-0"
				placeholder="Untitled"
			/>

			{/* Auto-save indicator */}
			{isSaving && (
				<span className="text-[10px] font-black capitalize tracking-widest text-muted animate-pulse">
					Saving…
				</span>
			)}

			{/* Right actions */}
			<div className="flex items-center gap-2">
				{/* Favourite */}
				<button
					onClick={handleFavourite}
					className={`p-2 rounded-lg transition-all ${
						isFavourite
							? "text-amber-500 bg-amber-500/10"
							: "text-muted hover:text-amber-500 hover:bg-amber-500/10"
					}`}
					title={isFavourite ? "Remove from favourites" : "Add to favourites"}
				>
					<span className="material-icons-outlined text-[20px]">
						{isFavourite ? "star" : "star_border"}
					</span>
				</button>

				{/* Share */}
				<button
					onClick={onShareClick}
					className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-xs font-black capitalize tracking-widest"
				>
					<span className="material-icons-outlined text-[16px]">share</span>
					Share
				</button>

				{/* More actions */}
				<div className="relative">
					<button
						onClick={() => setShowMoreMenu((p) => !p)}
						className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/5 transition-all"
					>
						<span className="material-icons-outlined text-[20px]">more_horiz</span>
					</button>

					{showMoreMenu && (
						<>
							<div
								className="fixed inset-0 z-40"
								onClick={() => setShowMoreMenu(false)}
							/>
							<div className="absolute top-10 right-0 z-50 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
								<div className="p-1.5 space-y-0.5">
									<button
										onClick={onVersionHistoryClick}
										className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
									>
										<span className="material-icons-outlined text-[16px]">history</span>
										Version History
									</button>
									<button
										onClick={handleLock}
										className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
									>
										<span className="material-icons-outlined text-[16px]">
											{isLocked ? "lock_open" : "lock"}
										</span>
										{isLocked ? "Unlock Article" : "Lock Article"}
									</button>
									<button
										onClick={() => {
											window.print();
											setShowMoreMenu(false);
										}}
										className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
									>
										<span className="material-icons-outlined text-[16px]">picture_as_pdf</span>
										Download as PDF
									</button>
									<div className="h-px bg-border my-1" />
									<button
										onClick={handleTrash}
										className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"
									>
										<span className="material-icons-outlined text-[16px]">delete_outline</span>
										Move to Trash
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
