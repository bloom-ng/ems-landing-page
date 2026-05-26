import { apiFetch } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Urgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RequisitionStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
export type ApplicationStatus =
	| "NEW"
	| "IN_PROGRESS"
	| "OFFER"
	| "HIRED"
	| "REFUSED";
export type ApplicationSource =
	| "LINKEDIN"
	| "INDEED"
	| "WEBSITE"
	| "REFERRAL"
	| "INTERNAL"
	| "SOCIAL_MEDIA"
	| "EMAIL"
	| "OTHER";
export type Degree =
	| "NONE"
	| "ASSOCIATE"
	| "BACHELOR"
	| "MASTER"
	| "PHD"
	| "OTHER";

export interface JobStage {
	id: string;
	name: string;
	order: number;
	color: string;
	jobId: string;
	isFolded: boolean;
}

export interface JobRequisition {
	id: string;
	jobTitle: string;
	jobDescription: string;
	skillsRequired: string;
	headcount: number;
	urgency: Urgency;
	reason: string;
	status: RequisitionStatus;
	departmentId: string | null;
	preferredStartDate: string | null;
	salaryBandMin: number | null;
	salaryBandMax: number | null;
	contractType: string | null;
	hrNotes: string | null;
	jobId: string | null;
	requestedById: string;
	reviewedById: string | null;
	reviewedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Job {
	id: string;
	tenantId: string;
	title: string;
	description: string;
	location: string | null;
	employmentType: string;
	departmentId: string | null;
	targetCount: number;
	isPublished: boolean;
	isArchived: boolean;
	interviewSurveyId: string | null;
	stages?: JobStage[];
	requisition?: JobRequisition | null;
	_count?: { applications: number };
	createdAt: string;
	updatedAt: string;
}

export interface Candidate {
	id: string;
	name: string;
	email: string;
	phone: string | null;
	mobile: string | null;
	linkedinUrl: string | null;
	degree: Degree;
	resumeUrl: string | null;
	isActive: boolean;
	_count?: { applications: number };
}

export interface Application {
	id: string;
	tenantId: string;
	jobId: string;
	candidateId: string;
	stageId: string | null;
	status: ApplicationStatus;
	source: ApplicationSource;
	evaluation: number;
	appliedAt: string;
	candidate?: Candidate;
	job?: Pick<Job, "id" | "title">;
	stage?: JobStage | null;
	offer?: Offer | null;
	stageHistory?: ApplicationStageHistory[];
	activities?: Activity[];
	chatMessages?: ChatMessage[];
	_count?: { activities: number; chatMessages: number };
}

export interface ApplicationStageHistory {
	id: string;
	applicationId: string;
	stageId: string;
	stageName: string;
	enteredAt: string;
	exitedAt: string | null;
	durationHours: number | null;
}



export interface Activity {
	id: string;
	applicationId: string;
	type: string;
	summary: string;
	dueDate: string | null;
	isDone: boolean;
	assignedToId: string | null;
}

export interface ChatMessage {
	id: string;
	content: string;
	isInternal: boolean;
	type: "LOG" | "NOTE" | "MESSAGE";
	authorId: string;
	createdAt: string;
}

export interface RequisitionChatMessage {
	id: string;
	requisitionId: string;
	content: string;
	isInternal: boolean;
	authorId: string;
	createdAt: string;
}

// ─── Job Requisitions ─────────────────────────────────────────────────────────

export const listRequisitions = (tenantSlug: string) =>
	apiFetch<JobRequisition[]>("/api/recruitment/requisitions", { tenantSlug });

export const getRequisition = (tenantSlug: string, id: string) =>
	apiFetch<JobRequisition>(`/api/recruitment/requisitions/${id}`, {
		tenantSlug,
	});

export const createRequisition = (
	tenantSlug: string,
	data: {
		jobTitle: string;
		jobDescription: string;
		skillsRequired: string;
		headcount: number;
		urgency: Urgency;
		reason: string;
		departmentId?: string;
		preferredStartDate?: string;
	},
) =>
	apiFetch<JobRequisition>("/api/recruitment/requisitions", {
		tenantSlug,
		method: "POST",
		body: data,
	});

export const submitRequisition = (tenantSlug: string, id: string) =>
	apiFetch<JobRequisition>(
		`/api/recruitment/requisitions/${id}/submit`,
		{ tenantSlug, method: "PATCH", body: {} },
	);

export const approveRequisition = (
	tenantSlug: string,
	id: string,
	data: {
		contractType?: string;
		salaryBandMin?: number;
		salaryBandMax?: number;
		hrNotes?: string;
	},
) =>
	apiFetch<{ requisition: JobRequisition; job: Job }>(
		`/api/recruitment/requisitions/${id}/approve`,
		{ tenantSlug, method: "PATCH", body: data },
	);

export const rejectRequisition = (
	tenantSlug: string,
	id: string,
	data: { hrNotes: string },
) =>
	apiFetch<JobRequisition>(
		`/api/recruitment/requisitions/${id}/reject`,
		{ tenantSlug, method: "PATCH", body: data },
	);

export const listRequisitionChatter = (tenantSlug: string, id: string) =>
	apiFetch<RequisitionChatMessage[]>(
		`/api/recruitment/requisitions/${id}/chatter`,
		{ tenantSlug },
	);

export const postRequisitionChatter = (
	tenantSlug: string,
	id: string,
	data: { content: string; isInternal: boolean },
) =>
	apiFetch<RequisitionChatMessage>(
		`/api/recruitment/requisitions/${id}/chatter`,
		{ tenantSlug, method: "POST", body: data },
	);

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const listJobs = (tenantSlug: string) =>
	apiFetch<Job[]>("/api/recruitment/jobs", { tenantSlug });

export const getJob = (tenantSlug: string, id: string) =>
	apiFetch<Job>(`/api/recruitment/jobs/${id}`, { tenantSlug });

export const createJob = (
	tenantSlug: string,
	data: {
		title: string;
		description?: string;
		location?: string;
		employmentType?: string;
		targetCount?: number;
	},
) =>
	apiFetch<Job>("/api/recruitment/jobs", {
		tenantSlug,
		method: "POST",
		body: data,
	});

export const updateJob = (
	tenantSlug: string,
	id: string,
	data: Partial<{
		title: string;
		description: string;
		location: string;
		employmentType: string;
		targetCount: number;
		interviewSurveyId: string | null;
	}>,
) =>
	apiFetch<Job>(`/api/recruitment/jobs/${id}`, {
		tenantSlug,
		method: "PUT",
		body: data,
	});

export const listPublicSurveysForDropdown = (tenantSlug: string) =>
	apiFetch<{ id: string; title: string }[]>("/api/survey/surveys", { tenantSlug }).then(
		(surveys) => surveys.filter((s: { id: string; title: string; isPublic?: boolean }) => s.isPublic),
	);

export const toggleJobPublish = (tenantSlug: string, id: string) =>
	apiFetch<Job>(`/api/recruitment/jobs/${id}/publish`, {
		tenantSlug,
		method: "PATCH",
		body: {},
	});

// ─── Stages ───────────────────────────────────────────────────────────────────

export const listStages = (tenantSlug: string, jobId?: string) =>
	apiFetch<JobStage[]>(
		`/api/recruitment/stages${jobId ? `?jobId=${jobId}` : ""}`,
		{ tenantSlug },
	);

export const createStage = (
	tenantSlug: string,
	data: { name: string; order: number; color: string; jobId: string },
) =>
	apiFetch<JobStage>("/api/recruitment/stages", {
		tenantSlug,
		method: "POST",
		body: data,
	});

export const deleteStage = (tenantSlug: string, id: string) =>
	apiFetch<void>(`/api/recruitment/stages/${id}`, {
		tenantSlug,
		method: "DELETE",
	});

// ─── Candidates ───────────────────────────────────────────────────────────────

export const listCandidates = (tenantSlug: string) =>
	apiFetch<Candidate[]>("/api/recruitment/candidates", { tenantSlug });

export const getCandidate = (tenantSlug: string, id: string) =>
	apiFetch<Candidate & { applications: Application[] }>(
		`/api/recruitment/candidates/${id}`,
		{ tenantSlug },
	);

export const createCandidate = (
	tenantSlug: string,
	data: {
		name: string;
		email: string;
		phone?: string;
		degree?: string;
		linkedinUrl?: string;
	},
) =>
	apiFetch<Candidate>("/api/recruitment/candidates", {
		tenantSlug,
		method: "POST",
		body: data,
	});

// ─── Applications ─────────────────────────────────────────────────────────────

export const listApplications = (
	tenantSlug: string,
	params?: { jobId?: string; stageId?: string; status?: string },
) => {
	const qs = new URLSearchParams();
	if (params?.jobId) qs.set("jobId", params.jobId);
	if (params?.stageId) qs.set("stageId", params.stageId);
	if (params?.status) qs.set("status", params.status);
	const query = qs.toString();
	return apiFetch<Application[]>(
		`/api/recruitment/applications${query ? `?${query}` : ""}`,
		{ tenantSlug },
	);
};

export const getApplication = (tenantSlug: string, id: string) =>
	apiFetch<Application>(`/api/recruitment/applications/${id}`, { tenantSlug });

export const createApplication = (
	tenantSlug: string,
	data: { jobId: string; candidateId: string; stageId?: string; source?: string },
) =>
	apiFetch<Application>("/api/recruitment/applications", {
		tenantSlug,
		method: "POST",
		body: data,
	});

export const moveApplicationStage = (
	tenantSlug: string,
	id: string,
	stageId: string,
) =>
	apiFetch<Application>(`/api/recruitment/applications/${id}/stage`, {
		tenantSlug,
		method: "PATCH",
		body: { stageId },
	});

export const refuseApplication = (
	tenantSlug: string,
	id: string,
	data: { refuseReason: string; note?: string },
) =>
	apiFetch<Application>(`/api/recruitment/applications/${id}/refuse`, {
		tenantSlug,
		method: "PATCH",
		body: data,
	});

export const listApplicationChatter = (tenantSlug: string, id: string) =>
	apiFetch<ChatMessage[]>(
		`/api/recruitment/applications/${id}/chatter`,
		{ tenantSlug },
	);

export const postApplicationChatter = (
	tenantSlug: string,
	id: string,
	data: { content: string; isInternal: boolean },
) =>
	apiFetch<ChatMessage>(`/api/recruitment/applications/${id}/chatter`, {
		tenantSlug,
		method: "POST",
		body: data,
	});

// ─── Public API (no auth required) ───────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const listPublicJobs = (tenantSlug: string) =>
	apiFetch<Job[]>("/api/recruitment/public/jobs", { tenantSlug });

export const getPublicJob = (tenantSlug: string, id: string) =>
	apiFetch<Job>(`/api/recruitment/public/jobs/${id}`, { tenantSlug });

export async function uploadResumeFile(
	tenantSlug: string,
	file: File,
): Promise<{ url: string; filename: string }> {
	const formData = new FormData();
	formData.append("file", file);
	const res = await fetch(`${API_BASE}/api/recruitment/public/upload`, {
		method: "POST",
		headers: { "X-Tenant-Slug": tenantSlug },
		body: formData,
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({ message: "Upload failed" }));
		throw new Error(err.message || "Upload failed");
	}
	const payload = await res.json();
	return payload.data ?? payload;
}

export const submitPublicApplication = (
	tenantSlug: string,
	jobId: string,
	data: {
		name: string;
		email: string;
		phone?: string;
		linkedinUrl?: string;
		resumeUrl?: string;
		coverNote?: string;
	},
) =>
	apiFetch<{ applicationId: string; candidateId: string; message: string }>(
		`/api/recruitment/public/apply/${jobId}`,
		{ tenantSlug, method: "POST", body: data },
	);

// ─── Recruiter / Email / Interview ───────────────────────────────────────────

export const assignRecruiter = (
	tenantSlug: string,
	applicationId: string,
	recruiterId: string,
) =>
	apiFetch<Application>(`/api/recruitment/applications/${applicationId}/recruiter`, {
		tenantSlug,
		method: "PATCH",
		body: { recruiterId },
	});

export const sendCandidateEmail = (
	tenantSlug: string,
	applicationId: string,
	data: { subject: string; body: string; templateKey?: string },
) =>
	apiFetch<{ message: string; chatterEntry: ChatMessage }>(
		`/api/recruitment/applications/${applicationId}/email`,
		{ tenantSlug, method: "POST", body: data },
	);

export const scheduleInterview = (
	tenantSlug: string,
	applicationId: string,
	data: {
		type: "PHONE" | "VIDEO" | "ONSITE";
		dateTime: string;
		duration?: number;
		videoCallUrl?: string;
		notes?: string;
	},
) =>
	apiFetch<Activity>(`/api/recruitment/applications/${applicationId}/interview`, {
		tenantSlug,
		method: "POST",
		body: data,
	});

// ─── Recruitment-scoped user list (no user:read required) ──────────────────────
export interface RecruitmentUser {
	id: string;
	name: string;
	email: string;
	status: string;
}

export const listRecruitmentUsers = (tenantSlug: string) =>
	apiFetch<RecruitmentUser[]>("/api/recruitment/users", { tenantSlug });

// ─── Offer & Hire ─────────────────────────────────────────────────────────────

export interface Offer {
	id: string;
	applicationId: string;
	jobTitle: string;
	yearlyCost: number | null;
	contractStartDate: string | null;
	status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
	acceptedAt: string | null;
	createdAt: string;
}

export const getOffer = (tenantSlug: string, applicationId: string) =>
	apiFetch<Offer | null>(`/api/recruitment/applications/${applicationId}/offer`, { tenantSlug });

export const createOffer = (
	tenantSlug: string,
	applicationId: string,
	data: { jobTitle?: string; yearlyCost?: number; contractStartDate?: string },
) =>
	apiFetch<Offer>(`/api/recruitment/applications/${applicationId}/offer`, {
		tenantSlug,
		method: "POST",
		body: data,
	});

export const patchOfferStatus = (
	tenantSlug: string,
	applicationId: string,
	status: "ACCEPTED" | "REJECTED",
) =>
	apiFetch<Offer>(`/api/recruitment/applications/${applicationId}/offer/status`, {
		tenantSlug,
		method: "PATCH",
		body: { status },
	});

export const hireApplicant = (tenantSlug: string, applicationId: string) =>
	apiFetch<{ application: Application; staffAccountCreated: boolean; message: string }>(
		`/api/recruitment/applications/${applicationId}/hire`,
		{ tenantSlug, method: "POST", body: {} },
	);
