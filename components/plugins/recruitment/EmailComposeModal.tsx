"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const TEMPLATES: Record<string, { subject: string; body: string }> = {
	application_received: {
		subject: "Your Application for {{job_title}}",
		body: `Thank you for applying for the {{job_title}} position at {{company}}.

We've received your application and our team will review it shortly. We'll be in touch with next steps.

Best regards,
The {{company}} Team`,
	},
	interview_invitation: {
		subject: "Interview Invitation — {{job_title}}",
		body: `Hi {{candidate_name}},

We're pleased to invite you to interview for the {{job_title}} position at {{company}}.

Please reply to this email to confirm your availability and we will coordinate accordingly.

We look forward to speaking with you!

Best regards,
The {{company}} Team`,
	},
	stage_update: {
		subject: "Update on Your Application — {{job_title}}",
		body: `Hi {{candidate_name}},

We wanted to keep you updated on your application for the {{job_title}} position at {{company}}.

Your application is progressing well and we'll be in touch with more details soon.

Best regards,
The {{company}} Team`,
	},
	rejection: {
		subject: "Application Update — {{job_title}}",
		body: `Hi {{candidate_name}},

Thank you for your interest in the {{job_title}} position at {{company}} and for taking the time to go through our process.

After careful consideration, we've decided to move forward with other candidates at this time. We'll keep your details on file and may reach out for future opportunities.

We wish you all the best in your search.

Best regards,
The {{company}} Team`,
	},
	offer: {
		subject: "We'd Like to Make You an Offer — {{job_title}}",
		body: `Hi {{candidate_name}},

We are delighted to offer you the {{job_title}} position at {{company}}.

Please find your offer details in a follow-up message. Kindly review and revert at your earliest convenience.

We look forward to welcoming you to the team!

Best regards,
The {{company}} Team`,
	},
};

const TEMPLATE_LABELS: Record<string, string> = {
	application_received: "Application Received",
	interview_invitation: "Interview Invitation",
	stage_update: "Stage Update",
	rejection: "Rejection",
	offer: "Offer",
};

function fillVars(
	text: string,
	vars: { candidateName: string; jobTitle: string; company: string },
) {
	return text
		.replace(/{{candidate_name}}/g, vars.candidateName)
		.replace(/{{job_title}}/g, vars.jobTitle)
		.replace(/{{company}}/g, vars.company)
		.replace(/{{date}}/g, new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
}

interface EmailComposeModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSend: (subject: string, body: string, templateKey?: string) => Promise<void>;
	candidateName: string;
	jobTitle: string;
	company: string;
	initialTemplate?: string;
}

export function EmailComposeModal({
	isOpen,
	onClose,
	onSend,
	candidateName,
	jobTitle,
	company,
	initialTemplate = "stage_update",
}: EmailComposeModalProps) {
	const [templateKey, setTemplateKey] = useState(initialTemplate);
	const [subject, setSubject] = useState("");
	const [body, setBody] = useState("");
	const [isSending, setIsSending] = useState(false);

	const vars = { candidateName, jobTitle, company };

	useEffect(() => {
		if (!isOpen) return;
		const tpl = TEMPLATES[templateKey];
		if (tpl) {
			setSubject(fillVars(tpl.subject, vars));
			setBody(fillVars(tpl.body, vars));
		}
	}, [templateKey, isOpen]);

	const handleSend = async () => {
		if (!subject.trim() || !body.trim()) return;
		setIsSending(true);
		try {
			await onSend(subject, body, templateKey);
			onClose();
		} finally {
			setIsSending(false);
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Send Email to Candidate">
			<div className="space-y-4">
				{/* To field */}
				<div className="bg-foreground/5 rounded-lg px-4 py-2.5 flex items-center gap-2">
					<span className="text-[10px] font-black capitalize tracking-widest text-muted shrink-0">To:</span>
					<span className="text-sm font-bold text-foreground">{candidateName}</span>
				</div>

				{/* Template selector */}
				<div>
					<label className="text-[10px] font-black capitalize tracking-widest text-muted ml-1 mb-1.5 block">
						Template
					</label>
					<select
						value={templateKey}
						onChange={(e) => setTemplateKey(e.target.value)}
						className="w-full bg-foreground/5 border-[0.5px] border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
					>
						{Object.entries(TEMPLATE_LABELS).map(([k, l]) => (
							<option key={k} value={k}>{l}</option>
						))}
					</select>
				</div>

				{/* Subject */}
				<div>
					<label className="text-[10px] font-black capitalize tracking-widest text-muted ml-1 mb-1.5 block">
						Subject
					</label>
					<input
						type="text"
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						className="w-full bg-foreground/5 border-[0.5px] border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
					/>
				</div>

				{/* Body */}
				<div>
					<label className="text-[10px] font-black capitalize tracking-widest text-muted ml-1 mb-1.5 block">
						Message
					</label>
					<textarea
						rows={9}
						value={body}
						onChange={(e) => setBody(e.target.value)}
						className="w-full bg-foreground/5 border-[0.5px] border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 resize-y transition-all font-medium leading-relaxed"
					/>
				</div>

				{/* Variable hint */}
				<p className="text-[10px] font-bold text-muted">
					Variables available: <code className="text-primary">{"{{candidate_name}}"}</code>, <code className="text-primary">{"{{job_title}}"}</code>, <code className="text-primary">{"{{company}}"}</code>, <code className="text-primary">{"{{date}}"}</code>
				</p>

				<div className="pt-3 flex justify-end gap-3">
					<Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
					<Button onClick={handleSend} isLoading={isSending} disabled={!subject.trim() || !body.trim()}>
						<span className="material-icons-outlined text-sm mr-1">send</span>
						Send Email
					</Button>
				</div>
			</div>
		</Modal>
	);
}
