import { apiFetch } from "./client";

export const projectApi = {
	getProjects: async (tenantSlug: string, status?: string, page: number = 1, limit: number = 12) => {
		let url = `/api/project?page=${page}&limit=${limit}`;
		if (status) url += `&status=${status}`;
		const res = await apiFetch<any>(url, { tenantSlug });
		return res;
	},
	getProject: async (tenantSlug: string, id: string) => {
		const res = await apiFetch<any>(`/api/project/${id}`, { tenantSlug });
		return res;
	},
	getPublicProject: async (tenantSlug: string, id: string) => {
		const res = await apiFetch<any>(`/api/project/public/${id}`, { tenantSlug });
		return res;
	},
	createProject: async (tenantSlug: string, data: { name: string; description?: string; timesheet?: boolean; billable?: boolean; customerId?: string; sendToCustomer?: boolean }) => {
		const res = await apiFetch<any>("/api/project", { method: "POST", body: data, tenantSlug });
		return res;
	},
	updateProject: async (tenantSlug: string, id: string, data: any) => {
		const res = await apiFetch<any>(`/api/project/${id}`, { method: "PUT", body: data, tenantSlug });
		return res;
	},
	deleteProject: async (tenantSlug: string, id: string) => {
		const res = await apiFetch<any>(`/api/project/${id}`, { method: "DELETE", tenantSlug });
		return res;
	},
	approveProject: async (tenantSlug: string, id: string) => {
		const res = await apiFetch<any>(`/api/project/${id}/approve`, { method: "PUT", tenantSlug });
		return res;
	},
	
	// Stages
	getStages: async (tenantSlug: string, projectId: string) => {
		const res = await apiFetch<any>(`/api/project/${projectId}/stages`, { tenantSlug });
		return res;
	},
	createStage: async (tenantSlug: string, data: { projectId: string; name: string; order?: number }) => {
		const res = await apiFetch<any>("/api/project/stages", { method: "POST", body: data, tenantSlug });
		return res;
	},
	updateStage: async (tenantSlug: string, id: string, data: { name?: string; order?: number }) => {
		const res = await apiFetch<any>(`/api/project/stages/${id}`, { method: "PUT", body: data, tenantSlug });
		return res;
	},
	reorderStages: async (tenantSlug: string, projectId: string, stages: { id: string; order: number }[]) => {
		const res = await apiFetch<any>(`/api/project/${projectId}/stages/reorder`, { method: "PUT", body: { stages }, tenantSlug });
		return res;
	},
	deleteStage: async (tenantSlug: string, id: string) => {
		const res = await apiFetch<any>(`/api/project/stages/${id}`, { method: "DELETE", tenantSlug });
		return res;
	},

	// Tasks
	getTasks: async (tenantSlug: string, projectId: string) => {
		const res = await apiFetch<any>(`/api/project/tasks?projectId=${projectId}`, { tenantSlug });
		return res;
	},
	getTask: async (tenantSlug: string, id: string) => {
		const res = await apiFetch<any>(`/api/project/tasks/${id}`, { tenantSlug });
		return res;
	},
	createTask: async (tenantSlug: string, data: any) => {
		const res = await apiFetch<any>("/api/project/tasks", { method: "POST", body: data, tenantSlug });
		return res;
	},
	updateTask: async (tenantSlug: string, id: string, data: any) => {
		const res = await apiFetch<any>(`/api/project/tasks/${id}`, { method: "PUT", body: data, tenantSlug });
		return res;
	},
	deleteTask: async (tenantSlug: string, id: string) => {
		const res = await apiFetch<any>(`/api/project/tasks/${id}`, { method: "DELETE", tenantSlug });
		return res;
	},
	uploadAttachment: async (tenantSlug: string, taskId: string, file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		const res = await apiFetch<any>(`/api/project/tasks/${taskId}/attachments`, {
			method: "POST",
			body: formData,
			tenantSlug
		});
		return res;
	},
	deleteAttachment: async (tenantSlug: string, taskId: string, attachmentId: string) => {
		const res = await apiFetch<any>(`/api/project/tasks/${taskId}/attachments/${attachmentId}`, {
			method: "DELETE",
			tenantSlug
		});
		return res;
	},
	createTaskMessage: async (tenantSlug: string, taskId: string, content: string) => {
		const res = await apiFetch<any>(`/api/project/tasks/${taskId}/messages`, {
			method: "POST",
			body: { content },
			tenantSlug
		});
		return res;
	},
	createScheduledActivity: async (tenantSlug: string, taskId: string, data: { type: string; assigneeId: string; dueDate: string; note?: string }) => {
		const res = await apiFetch<any>(`/api/project/tasks/${taskId}/scheduled-activities`, {
			method: "POST",
			body: data,
			tenantSlug
		});
		return res;
	},
	updateScheduledActivity: async (tenantSlug: string, taskId: string, activityId: string, data: { isCompleted?: boolean; type?: string; assigneeId?: string; dueDate?: string; note?: string }) => {
		const res = await apiFetch<any>(`/api/project/tasks/${taskId}/scheduled-activities/${activityId}`, {
			method: "PUT",
			body: data,
			tenantSlug
		});
		return res;
	},
	deleteScheduledActivity: async (tenantSlug: string, taskId: string, activityId: string) => {
		const res = await apiFetch<any>(`/api/project/tasks/${taskId}/scheduled-activities/${activityId}`, {
			method: "DELETE",
			tenantSlug
		});
		return res;
	},
	getAnalytics: async (tenantSlug: string, filters: { projectId?: string; assigneeId?: string; startDate?: string; endDate?: string } = {}) => {
		const queryParams = new URLSearchParams(filters as any).toString();
		const res = await apiFetch<any>(`/api/project/analytics?${queryParams}`, { tenantSlug });
		return res;
	},

	// Timesheets
	getTimesheets: async (tenantSlug: string, filters: { projectId?: string; taskId?: string; userId?: string } = {}) => {
		const queryParams = new URLSearchParams(filters as any).toString();
		const res = await apiFetch<any>(`/api/project/timesheets?${queryParams}`, { tenantSlug });
		return res;
	},
	logTime: async (tenantSlug: string, data: any) => {
		const res = await apiFetch<any>("/api/project/timesheets", { method: "POST", body: data, tenantSlug });
		return res;
	},
	deleteTimesheet: async (tenantSlug: string, id: string) => {
		const res = await apiFetch<any>(`/api/project/timesheets/${id}`, { method: "DELETE", tenantSlug });
		return res;
	},
	getTimer: async (tenantSlug: string) => {
		const res = await apiFetch<any>("/api/project/timer", { tenantSlug });
		return res;
	},
	startTimer: async (tenantSlug: string, taskId: string) => {
		const res = await apiFetch<any>("/api/project/timer/start", { method: "POST", body: { taskId }, tenantSlug });
		return res;
	},
	stopTimer: async (tenantSlug: string, description?: string) => {
		const res = await apiFetch<any>("/api/project/timer/stop", { method: "POST", body: { description }, tenantSlug });
		return res;
	},
};

