"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
	getMembers,
	inviteMember,
	removeMember,
	updateAccessSettings,
} from "@/lib/api/knowledge";
import { apiFetch } from "@/lib/api/client";
import { toast } from "sonner";

interface ShareModalProps {
	article: { id: string; defaultAccess: string; visibility: string };
	onClose: () => void;
	onUpdated: () => void;
}

const ACCESS_LABELS: Record<string, string> = {
	CAN_EDIT: "Can Edit",
	CAN_READ: "Can Read",
	NO_ACCESS: "No Access",
};

export default function ShareModal({
	article,
	onClose,
	onUpdated,
}: ShareModalProps) {
	const params = useParams();
	const tenantSlug = params.tenantSlug as string;

	const [members, setMembers] = useState<any[]>([]);
	const [users, setUsers] = useState<any[]>([]);
	const [defaultAccess, setDefaultAccess] = useState<"CAN_EDIT" | "CAN_READ" | "NO_ACCESS">(article.defaultAccess as "CAN_EDIT" | "CAN_READ" | "NO_ACCESS");
	const [visibility, setVisibility] = useState<"EVERYONE" | "MEMBERS_ONLY">(article.visibility as "EVERYONE" | "MEMBERS_ONLY");
	const [selectedUserId, setSelectedUserId] = useState("");
	const [selectedAccess, setSelectedAccess] = useState<"CAN_EDIT" | "CAN_READ" | "NO_ACCESS">("CAN_READ");
	const [isSaving, setIsSaving] = useState(false);
	const [isInviting, setIsInviting] = useState(false);

	useEffect(() => {
		getMembers(tenantSlug, article.id)
			.then(setMembers)
			.catch(() => {});

		apiFetch<any[]>("/api/recruitment/users", { tenantSlug })
			.then(setUsers)
			.catch(() => {});
	}, [tenantSlug, article.id]);

	const handleSaveAccess = async () => {
		setIsSaving(true);
		try {
			await updateAccessSettings(tenantSlug, article.id, {
				defaultAccess,
				visibility,
			});
			toast.success("Access settings updated");
			onUpdated();
		} catch {
			toast.error("Failed to update access");
		} finally {
			setIsSaving(false);
		}
	};

	const handleInvite = async () => {
		if (!selectedUserId) return;
		setIsInviting(true);
		try {
			await inviteMember(tenantSlug, article.id, selectedUserId, selectedAccess);
			const updated = await getMembers(tenantSlug, article.id);
			setMembers(updated);
			setSelectedUserId("");
			toast.success("Member invited");
		} catch {
			toast.error("Failed to invite member");
		} finally {
			setIsInviting(false);
		}
	};

	const handleRemove = async (userId: string) => {
		try {
			await removeMember(tenantSlug, article.id, userId);
			setMembers((prev) => prev.filter((m) => m.userId !== userId));
			toast.success("Member removed");
		} catch {
			toast.error("Failed to remove member");
		}
	};

	const uninvitedUsers = users.filter(
		(u) => !members.some((m) => m.userId === u.id),
	);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
			<div className="bg-card border border-border rounded-2xl shadow-2xl w-[540px] max-w-[95vw] overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-border">
					<div className="flex items-center gap-3">
						<span className="material-icons-outlined text-primary text-[22px]">share</span>
						<h2 className="text-lg font-black tracking-tight text-foreground">
							Share Article
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/5 transition-all"
					>
						<span className="material-icons-outlined text-[20px]">close</span>
					</button>
				</div>

				<div className="p-6 space-y-6">
					{/* General access */}
					<div className="space-y-3">
						<p className="text-xs font-black capitalize tracking-widest text-muted">
							General Access
						</p>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="text-[11px] font-black capitalize tracking-widest text-muted block mb-1.5">
									Default Access
								</label>
								<select
									value={defaultAccess}
									onChange={(e) => setDefaultAccess(e.target.value as "CAN_EDIT" | "CAN_READ" | "NO_ACCESS")}
									className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-bold text-foreground outline-none focus:border-primary transition-colors"
								>
									<option value="CAN_EDIT">Can Edit</option>
									<option value="CAN_READ">Can Read</option>
									<option value="NO_ACCESS">No Access (Private)</option>
								</select>
							</div>
							<div>
								<label className="text-[11px] font-black capitalize tracking-widest text-muted block mb-1.5">
									Visibility in Sidebar
								</label>
								<select
									value={visibility}
									onChange={(e) => setVisibility(e.target.value as "EVERYONE" | "MEMBERS_ONLY")}
									className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-bold text-foreground outline-none focus:border-primary transition-colors"
								>
									<option value="EVERYONE">Everyone</option>
									<option value="MEMBERS_ONLY">Members Only</option>
								</select>
							</div>
						</div>
						<button
							onClick={handleSaveAccess}
							disabled={isSaving}
							className="w-full py-2.5 rounded-lg bg-primary text-white text-xs font-black capitalize tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
						>
							{isSaving ? "Saving…" : "Save Access Settings"}
						</button>
					</div>

					<div className="h-px bg-border" />

					{/* Invite specific user */}
					<div className="space-y-3">
						<p className="text-xs font-black capitalize tracking-widest text-muted">
							Invite People
						</p>
						<div className="flex gap-2">
							<select
								value={selectedUserId}
								onChange={(e) => setSelectedUserId(e.target.value)}
								className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-bold text-foreground outline-none focus:border-primary transition-colors"
							>
								<option value="">Select a user…</option>
								{uninvitedUsers.map((u) => (
									<option key={u.id} value={u.id}>
										{u.name} ({u.email})
									</option>
								))}
							</select>
							<select
								value={selectedAccess}
								onChange={(e) => setSelectedAccess(e.target.value as "CAN_EDIT" | "CAN_READ" | "NO_ACCESS")}
								className="w-28 bg-background border border-border rounded-lg px-3 py-2 text-sm font-bold text-foreground outline-none focus:border-primary transition-colors"
							>
								<option value="CAN_EDIT">Edit</option>
								<option value="CAN_READ">Read</option>
							</select>
							<button
								onClick={handleInvite}
								disabled={!selectedUserId || isInviting}
								className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-black capitalize tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50"
							>
								{isInviting ? "…" : "Invite"}
							</button>
						</div>
					</div>

					{/* Current members */}
					{members.length > 0 && (
						<div className="space-y-2">
							<p className="text-[10px] font-black capitalize tracking-widest text-muted">
								Current Members
							</p>
							<div className="space-y-1.5 max-h-40 overflow-y-auto">
								{members.map((m) => (
									<div
										key={m.userId}
										className="flex items-center justify-between px-3 py-2 rounded-lg bg-foreground/3 border border-border"
									>
										<div className="flex items-center gap-2">
											<div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">
												{m.user?.name?.charAt(0) || "?"}
											</div>
											<div>
												<p className="text-xs font-black text-foreground">
													{m.user?.name || m.userId}
												</p>
												<p className="text-[10px] text-muted font-bold">
													{ACCESS_LABELS[m.access]}
												</p>
											</div>
										</div>
										<button
											onClick={() => handleRemove(m.userId)}
											className="p-1 rounded text-muted hover:text-rose-500 transition-colors"
										>
											<span className="material-icons-outlined text-[16px]">close</span>
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
