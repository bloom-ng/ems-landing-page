"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

interface ChatterMessage {
	id: string;
	content: string;
	isInternal: boolean;
	type: "LOG" | "NOTE" | "MESSAGE";
	authorId: string;
	createdAt: string;
}

interface ChatterPanelProps {
	messages: ChatterMessage[];
	onPost: (content: string, isInternal: boolean) => Promise<void>;
	isPosting?: boolean;
}

function timeAgo(dateStr: string) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	return `${Math.floor(hrs / 24)}d ago`;
}

export function ChatterPanel({ messages, onPost, isPosting }: ChatterPanelProps) {
	const [content, setContent] = useState("");
	const [isInternal, setIsInternal] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim()) return;
		await onPost(content.trim(), isInternal);
		setContent("");
	};

	return (
		<div className="flex flex-col h-full">
			{/* Message list */}
			<div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 max-h-[360px]">
				{messages.length === 0 ? (
					<p className="text-center text-[10px] font-bold text-muted capitalize tracking-widest py-8">
						No messages yet.
					</p>
				) : (
					messages.map((msg) => {
						if (msg.type === "LOG") {
							return (
								<div
									key={msg.id}
									className="flex items-center gap-2 py-1"
								>
									<div className="h-px flex-1 bg-border" />
									<span className="text-[10px] font-bold text-muted capitalize tracking-widest shrink-0">
										{msg.content}
									</span>
									<div className="h-px flex-1 bg-border" />
								</div>
							);
						}
						return (
							<div key={msg.id} className="flex items-start gap-3">
								<div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
									<span className="material-icons-outlined text-[14px]">
										{msg.isInternal ? "lock" : "person"}
									</span>
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										{msg.isInternal && (
											<span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black capitalize tracking-widest bg-amber-500/10 text-amber-600">
												Internal note
											</span>
										)}
										<span className="text-[10px] text-muted font-bold capitalize tracking-widest">
											{timeAgo(msg.createdAt)}
										</span>
									</div>
									<p className="text-sm text-foreground font-bold leading-relaxed">
										{msg.content}
									</p>
								</div>
							</div>
						);
					})
				)}
				<div ref={bottomRef} />
			</div>

			{/* Compose */}
			<form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-border space-y-3">
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="Write a message or note…"
					rows={3}
					className="w-full bg-foreground/5 border-[0.5px] border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 resize-none transition-all"
				/>
				<div className="flex items-center justify-between">
					<label className="flex items-center gap-2 cursor-pointer select-none">
						<div
							onClick={() => setIsInternal(!isInternal)}
							className={`w-8 h-4 rounded-full transition-colors relative ${isInternal ? "bg-amber-500" : "bg-muted/30"}`}
						>
							<div
								className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${isInternal ? "translate-x-4" : "translate-x-0.5"}`}
							/>
						</div>
						<span className="text-[10px] font-black capitalize tracking-widest text-muted">
							Internal note
						</span>
					</label>
					<Button
						type="submit"
						size="sm"
						isLoading={isPosting}
						disabled={!content.trim()}
					>
						<span className="material-icons-outlined text-sm mr-1">send</span>
						Send
					</Button>
				</div>
			</form>
		</div>
	);
}
