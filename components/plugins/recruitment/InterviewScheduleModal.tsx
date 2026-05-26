"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

type InterviewType = "PHONE" | "VIDEO" | "ONSITE";

interface InterviewScheduleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSchedule: (data: {
		type: InterviewType;
		dateTime: string;
		duration: number;
		videoCallUrl?: string;
		notes?: string;
	}) => Promise<void>;
	candidateName: string;
	jobTitle: string;
}

export function InterviewScheduleModal({
	isOpen,
	onClose,
	onSchedule,
	candidateName,
	jobTitle,
}: InterviewScheduleModalProps) {
	const [type, setType] = useState<InterviewType>("VIDEO");
	const [date, setDate] = useState("");
	const [time, setTime] = useState("09:00");
	const [duration, setDuration] = useState(60);
	const [videoCallUrl, setVideoCallUrl] = useState("");
	const [notes, setNotes] = useState("");
	const [isScheduling, setIsScheduling] = useState(false);
	const [error, setError] = useState("");

	const handleSchedule = async () => {
		if (!date || !time) {
			setError("Please set a date and time.");
			return;
		}
		setError("");
		setIsScheduling(true);
		try {
			const dateTime = new Date(`${date}T${time}`).toISOString();
			await onSchedule({
				type,
				dateTime,
				duration,
				videoCallUrl: videoCallUrl || undefined,
				notes: notes || undefined,
			});
			onClose();
			// Reset
			setDate("");
			setTime("09:00");
			setDuration(60);
			setVideoCallUrl("");
			setNotes("");
		} catch (err: any) {
			setError(err.message || "Failed to schedule interview.");
		} finally {
			setIsScheduling(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Schedule Interview">
			<div className="space-y-5">
				{/* Header badge */}
				<div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
						<span className="material-icons-outlined text-primary text-sm">calendar_month</span>
					</div>
					<div>
						<p className="font-black text-foreground text-sm">{candidateName}</p>
						<p className="text-[10px] font-bold text-muted capitalize tracking-widest">{jobTitle}</p>
					</div>
				</div>

				{error && (
					<div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-sm font-bold text-rose-600">
						{error}
					</div>
				)}

				{/* Interview type */}
				<Select
					label="Interview Type"
					value={type}
					onChange={(e) => setType(e.target.value as InterviewType)}
					options={[
						{ value: "PHONE", label: "📞 Phone Call" },
						{ value: "VIDEO", label: "🎥 Video Call" },
						{ value: "ONSITE", label: "🏢 On-Site" },
					]}
				/>

				{/* Date + Time */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="text-[10px] font-black capitalize tracking-widest text-muted ml-1 mb-1.5 block">
							Date
						</label>
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							min={new Date().toISOString().split("T")[0]}
							className="w-full bg-foreground/5 border-[0.5px] border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
						/>
					</div>
					<div>
						<label className="text-[10px] font-black capitalize tracking-widest text-muted ml-1 mb-1.5 block">
							Time
						</label>
						<input
							type="time"
							value={time}
							onChange={(e) => setTime(e.target.value)}
							className="w-full bg-foreground/5 border-[0.5px] border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
						/>
					</div>
				</div>

				{/* Duration */}
				<Select
					label="Duration"
					value={String(duration)}
					onChange={(e) => setDuration(Number(e.target.value))}
					options={[
						{ value: "30", label: "30 minutes" },
						{ value: "45", label: "45 minutes" },
						{ value: "60", label: "1 hour" },
						{ value: "90", label: "1.5 hours" },
						{ value: "120", label: "2 hours" },
					]}
				/>

				{/* Video call URL — only shown for VIDEO type */}
				{type === "VIDEO" && (
					<div>
						<label className="text-[10px] font-black capitalize tracking-widest text-muted ml-1 mb-1.5 block">
							Video Call URL
						</label>
						<div className="relative">
							<span className="absolute left-3.5 top-1/2 -translate-y-1/2">
								<span className="material-icons-outlined text-muted text-base">videocam</span>
							</span>
							<input
								type="url"
								value={videoCallUrl}
								onChange={(e) => setVideoCallUrl(e.target.value)}
								placeholder="https://meet.google.com/abc-def or Zoom link…"
								className="w-full pl-10 bg-foreground/5 border-[0.5px] border-border rounded-lg pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
							/>
						</div>
					</div>
				)}

				{/* Notes */}
				<div>
					<label className="text-[10px] font-black capitalize tracking-widest text-muted ml-1 mb-1.5 block">
						Notes / Agenda
					</label>
					<textarea
						rows={3}
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						placeholder="Topics to cover, preparation instructions for candidate…"
						className="w-full bg-foreground/5 border-[0.5px] border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 resize-none transition-all"
					/>
				</div>

				<div className="pt-2 flex justify-end gap-3">
					<Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
					<Button onClick={handleSchedule} isLoading={isScheduling}>
						<span className="material-icons-outlined text-sm mr-1">event</span>
						Schedule Interview
					</Button>
				</div>
			</div>
		</Modal>
	);
}
