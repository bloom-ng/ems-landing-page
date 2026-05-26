"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { ApplicationCard } from "./ApplicationCard";
import {
	createApplication,
	moveApplicationStage,
	type Application,
	type JobStage,
	type Candidate,
} from "@/lib/api/recruitment";
import { toast } from "sonner";

interface KanbanBoardProps {
	tenantSlug: string;
	jobId: string;
	stages: JobStage[];
	applications: Application[];
	candidates: Candidate[];
	onRefresh: () => void;
}

const statusColors: Record<string, string> = {
	NEW: "bg-blue-500/10 text-blue-600",
	IN_PROGRESS: "bg-amber-500/10 text-amber-600",
	OFFER: "bg-violet-500/10 text-violet-600",
	HIRED: "bg-emerald-500/10 text-emerald-600",
	REFUSED: "bg-rose-500/10 text-rose-600",
};

export function KanbanBoard({
	tenantSlug,
	jobId,
	stages,
	applications,
	candidates,
	onRefresh,
}: KanbanBoardProps) {
	const router = useRouter();

	// ── drag-and-drop state ─────────────────────────────────────────────────────
	const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
	const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

	const handleDrop = async (targetStageId: string) => {
		setDragOverStageId(null);
		if (!draggedAppId) return;
		const dragged = applications.find((a) => a.id === draggedAppId);
		if (!dragged || dragged.stageId === targetStageId) {
			setDraggedAppId(null);
			return;
		}
		setDraggedAppId(null);
		try {
			await moveApplicationStage(tenantSlug, draggedAppId, targetStageId);
			toast.success("Stage updated");
			onRefresh();
		} catch (err: any) {
			toast.error(err.message ?? "Failed to move candidate");
		}
	};

	// ── add application modal ──────────────────────────────────────────────────
	const [addStageId, setAddStageId] = useState<string | null>(null);
	const [addCandidateId, setAddCandidateId] = useState("");
	const [addSource, setAddSource] = useState("WEBSITE");
	const [isAdding, setIsAdding] = useState(false);

	const handleAddApplication = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!addCandidateId || !addStageId) return;
		setIsAdding(true);
		try {
			await createApplication(tenantSlug, {
				jobId,
				candidateId: addCandidateId,
				stageId: addStageId,
				source: addSource,
			});
			toast.success("Application added");
			setAddStageId(null);
			setAddCandidateId("");
			setAddSource("WEBSITE");
			onRefresh();
		} catch (err: any) {
			toast.error(err.message ?? "Failed to add application");
		} finally {
			setIsAdding(false);
		}
	};

	const appsPerStage = (stageId: string) =>
		applications.filter((a) => a.stageId === stageId);

	const unstaged = applications.filter((a) => !a.stageId);

	return (
		<>
			{/* ── Kanban columns ───────────────────────────────────────────── */}
			<div className="flex gap-4 overflow-x-auto pb-4 min-h-[520px]">
				{stages.length === 0 && (
					<div className="flex-1 flex items-center justify-center text-muted font-bold text-xs capitalize tracking-widest">
						No stages yet. Create stages to build your pipeline.
					</div>
				)}

				{stages.map((stage) => {
					const stageApps = appsPerStage(stage.id);
					const isOver = dragOverStageId === stage.id;
					return (
						<div
							key={stage.id}
							className="flex-shrink-0 w-64 flex flex-col"
						>
							{/* Column header */}
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-2">
									<div
										className="w-2 h-2 rounded-full shrink-0"
										style={{ background: stage.color }}
									/>
									<span className="text-xs font-black text-foreground tracking-tight">
										{stage.name}
									</span>
									<span className="text-[10px] font-black bg-muted/10 text-muted px-1.5 py-0.5 rounded-full">
										{stageApps.length}
									</span>
								</div>
								<button
									onClick={() => setAddStageId(stage.id)}
									className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary/10 text-muted hover:text-primary transition-colors"
									title="Add application"
								>
									<span className="material-icons-outlined text-[16px]">add</span>
								</button>
							</div>

							{/* Drop zone — highlights when dragging over */}
							<div
								className={`flex-1 space-y-2 rounded-xl border p-2 min-h-[200px] transition-colors ${
									isOver
										? "bg-primary/5 border-primary/30 border-dashed"
										: "bg-foreground/[0.02] border-border/50"
								}`}
								onDragOver={(e) => { e.preventDefault(); setDragOverStageId(stage.id); }}
								onDragLeave={() => setDragOverStageId(null)}
								onDrop={(e) => { e.preventDefault(); void handleDrop(stage.id); }}
							>
								{stageApps.length === 0 ? (
									<div className="h-full flex items-center justify-center">
										<span className="text-[10px] font-bold text-muted/40 capitalize tracking-widest">
											{isOver ? "Drop here" : "Empty"}
										</span>
									</div>
								) : (
									stageApps.map((app) => (
										<div
											key={app.id}
											draggable
											onDragStart={() => setDraggedAppId(app.id)}
											onDragEnd={() => { setDraggedAppId(null); setDragOverStageId(null); }}
											className={`cursor-grab active:cursor-grabbing transition-opacity ${
												draggedAppId === app.id ? "opacity-40" : "opacity-100"
											}`}
										>
											<ApplicationCard
												application={app}
												onClick={() =>
													router.push(`/${tenantSlug}/recruitment/applications/${app.id}`)
												}
											/>
										</div>
									))
								)}
							</div>
						</div>
					);
				})}

				{/* Unstaged column */}
				{unstaged.length > 0 && (
					<div className="flex-shrink-0 w-64 flex flex-col">
						<div className="flex items-center gap-2 mb-3">
							<div className="w-2 h-2 rounded-full bg-muted/30 shrink-0" />
							<span className="text-xs font-black text-muted tracking-tight">
								Unstaged
							</span>
							<span className="text-[10px] font-black bg-muted/10 text-muted px-1.5 py-0.5 rounded-full">
								{unstaged.length}
							</span>
						</div>
						<div className="flex-1 space-y-2 rounded-xl bg-foreground/[0.02] border border-dashed border-border/50 p-2">
							{unstaged.map((app) => (
								<ApplicationCard
									key={app.id}
									application={app}
									onClick={() =>
										router.push(`/${tenantSlug}/recruitment/applications/${app.id}`)
									}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{/* ── Add application modal ────────────────────────────────────── */}
			<Modal
				isOpen={!!addStageId}
				onClose={() => setAddStageId(null)}
				title="Add Application"
			>
				<form onSubmit={handleAddApplication} className="space-y-4">
					<Select
						label="Candidate"
						value={addCandidateId}
						onChange={(e) => setAddCandidateId(e.target.value)}
						options={[
							{ label: "Select candidate…", value: "" },
							...candidates.map((c) => ({
								label: `${c.name} (${c.email})`,
								value: c.id,
							})),
						]}
						required
					/>
					<Select
						label="Source"
						value={addSource}
						onChange={(e) => setAddSource(e.target.value)}
						options={[
							{ label: "Website", value: "WEBSITE" },
							{ label: "LinkedIn", value: "LINKEDIN" },
							{ label: "Indeed", value: "INDEED" },
							{ label: "Referral", value: "REFERRAL" },
							{ label: "Internal", value: "INTERNAL" },
							{ label: "Social Media", value: "SOCIAL_MEDIA" },
							{ label: "Email", value: "EMAIL" },
							{ label: "Other", value: "OTHER" },
						]}
					/>
					<div className="pt-2 flex justify-end gap-3">
						<Button
							variant="outline"
							type="button"
							onClick={() => setAddStageId(null)}
						>
							Cancel
						</Button>
						<Button type="submit" isLoading={isAdding}>
							Add Application
						</Button>
					</div>
				</form>
			</Modal>
		</>
	);
}
