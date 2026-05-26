"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
	getVersions,
	getVersion,
	restoreVersion,
} from "@/lib/api/knowledge";
import { toast } from "sonner";

interface VersionHistoryModalProps {
	articleId: string;
	onClose: () => void;
	onRestored: () => void;
}

export default function VersionHistoryModal({
	articleId,
	onClose,
	onRestored,
}: VersionHistoryModalProps) {
	const params = useParams();
	const tenantSlug = params.tenantSlug as string;

	const [versions, setVersions] = useState<any[]>([]);
	const [selected, setSelected] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRestoring, setIsRestoring] = useState(false);

	useEffect(() => {
		getVersions(tenantSlug, articleId)
			.then(setVersions)
			.catch(() => toast.error("Failed to load versions"))
			.finally(() => setIsLoading(false));
	}, [tenantSlug, articleId]);

	const handleSelect = async (versionId: string) => {
		try {
			const v = await getVersion(tenantSlug, articleId, versionId);
			setSelected(v);
		} catch {
			toast.error("Failed to load version content");
		}
	};

	const handleRestore = async () => {
		if (!selected) return;
		setIsRestoring(true);
		try {
			await restoreVersion(tenantSlug, articleId, selected.id);
			toast.success("Version restored");
			onRestored();
			onClose();
		} catch {
			toast.error("Failed to restore version");
		} finally {
			setIsRestoring(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-card border border-border rounded-2xl shadow-2xl w-[900px] max-w-[95vw] h-[80vh] flex flex-col overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
					<div className="flex items-center gap-3">
						<span className="material-icons-outlined text-primary text-[22px]">history</span>
						<h2 className="text-lg font-black tracking-tight text-foreground">
							Version History
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/5 transition-all"
					>
						<span className="material-icons-outlined text-[20px]">close</span>
					</button>
				</div>

				<div className="flex flex-1 min-h-0">
					{/* Version list */}
					<div className="w-64 border-r border-border flex flex-col flex-shrink-0">
						<p className="text-[10px] font-black capitalize tracking-widest text-muted px-4 py-3 border-b border-border">
							{versions.length} version{versions.length !== 1 ? "s" : ""}
						</p>
						<div className="flex-1 overflow-y-auto">
							{isLoading ? (
								<div className="flex items-center justify-center h-24">
									<div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
								</div>
							) : versions.length === 0 ? (
								<p className="text-xs text-muted font-bold text-center p-6">
									No versions saved yet
								</p>
							) : (
								versions.map((v) => (
									<button
										key={v.id}
										onClick={() => handleSelect(v.id)}
										className={`w-full text-left px-4 py-3 border-b border-border/50 transition-all hover:bg-foreground/5 ${
											selected?.id === v.id
												? "bg-primary/10 border-l-2 border-l-primary"
												: ""
										}`}
									>
										<p className="text-xs font-black text-foreground truncate">
											{v.title}
										</p>
										<p className="text-[10px] text-muted font-bold mt-0.5">
											{new Date(v.createdAt).toLocaleString()}
										</p>
										<p className="text-[10px] text-muted capitalize tracking-widest mt-0.5">
											by {v.savedBy}
										</p>
									</button>
								))
							)}
						</div>
					</div>

					{/* Preview pane */}
					<div className="flex-1 flex flex-col min-w-0">
						{selected ? (
							<>
								<div className="flex-1 overflow-y-auto p-6">
									<div
										className="prose prose-sm max-w-none"
										dangerouslySetInnerHTML={{
											__html: selected.content,
										}}
									/>
								</div>
								<div className="px-6 py-4 border-t border-border flex items-center justify-between flex-shrink-0">
									<p className="text-xs text-muted font-bold">
										Restoring will replace the current content with this version.
									</p>
									<button
										onClick={handleRestore}
										disabled={isRestoring}
										className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-black capitalize tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
									>
										{isRestoring ? (
											<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										) : (
											<span className="material-icons-outlined text-[16px]">restore</span>
										)}
										Restore this version
									</button>
								</div>
							</>
						) : (
							<div className="flex-1 flex items-center justify-center text-center p-8">
								<div>
									<span className="material-icons-outlined text-4xl text-muted/30">history</span>
									<p className="text-sm text-muted font-bold mt-3">
										Select a version on the left to preview it
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
