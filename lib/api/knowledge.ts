// Shared API helper for the knowledge module
import { apiFetch } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KnowledgeArticle {
	id: string;
	tenantId: string;
	createdById: string;
	title: string;
	content: string;
	emoji: string | null;
	coverImage: string | null;
	parentId: string | null;
	sortOrder: number;
	isLocked: boolean;
	isTrashed: boolean;
	isArchived: boolean;
	defaultAccess: "CAN_EDIT" | "CAN_READ" | "NO_ACCESS";
	visibility: "EVERYONE" | "MEMBERS_ONLY";
	isFavourite: boolean;
	createdAt: string;
	updatedAt: string;
	properties?: ArticleProperty[];
	_count?: { children: number; versions: number };
}

export interface KnowledgeTemplate {
	id: string;
	tenantId: string | null;
	name: string;
	description: string | null;
	emoji: string | null;
	content: string;
	isBuiltIn: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ArticleMember {
	id: string;
	articleId: string;
	userId: string;
	access: "CAN_EDIT" | "CAN_READ" | "NO_ACCESS";
	user?: { id: string; name: string; email: string } | null;
}

export interface ArticleVersion {
	id: string;
	articleId: string;
	title: string;
	content: string;
	savedById: string;
	createdAt: string;
}

export interface ArticleProperty {
	id: string;
	articleId: string;
	label: string;
	type: "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "SELECT" | "USER_REF";
	value: string | null;
	sortOrder: number;
}

// ─── Article tree ─────────────────────────────────────────────────────────────

export async function getArticleTree(tenantSlug: string) {
	return apiFetch<KnowledgeArticle[]>("/api/knowledge/articles", { tenantSlug });
}

// ─── Single article ───────────────────────────────────────────────────────────

export async function getArticle(tenantSlug: string, id: string) {
	return apiFetch<KnowledgeArticle>(`/api/knowledge/articles/${id}`, { tenantSlug });
}

// ─── Create article ───────────────────────────────────────────────────────────

export async function createArticle(
	tenantSlug: string,
	data: {
		title?: string;
		content?: string;
		parentId?: string;
		emoji?: string;
		templateId?: string;
	},
) {
	return apiFetch<KnowledgeArticle>("/api/knowledge/articles", {
		tenantSlug,
		method: "POST",
		body: data,
	});
}

// ─── Update article ───────────────────────────────────────────────────────────

export async function updateArticle(
	tenantSlug: string,
	id: string,
	data: { title?: string; content?: string; emoji?: string; coverImage?: string },
) {
	return apiFetch<KnowledgeArticle>(`/api/knowledge/articles/${id}`, {
		tenantSlug,
		method: "PUT",
		body: data,
	});
}

// ─── Move article ─────────────────────────────────────────────────────────────

export async function moveArticle(
	tenantSlug: string,
	id: string,
	parentId: string | null,
	sortOrder: number,
) {
	return apiFetch<KnowledgeArticle>(`/api/knowledge/articles/${id}/move`, {
		tenantSlug,
		method: "PATCH",
		body: { parentId, sortOrder },
	});
}

// ─── Trash / restore ──────────────────────────────────────────────────────────

export async function trashArticle(tenantSlug: string, id: string) {
	return apiFetch<{ message: string }>(`/api/knowledge/articles/${id}`, {
		tenantSlug,
		method: "DELETE",
	});
}

export async function restoreArticle(tenantSlug: string, id: string) {
	return apiFetch<KnowledgeArticle>(`/api/knowledge/articles/${id}/restore`, {
		tenantSlug,
		method: "PATCH",
	});
}

export async function listTrashedArticles(tenantSlug: string) {
	return apiFetch<KnowledgeArticle[]>("/api/knowledge/articles/trash", { tenantSlug });
}

// ─── Lock ─────────────────────────────────────────────────────────────────────

export async function toggleLock(tenantSlug: string, id: string) {
	return apiFetch<KnowledgeArticle>(`/api/knowledge/articles/${id}/lock`, {
		tenantSlug,
		method: "PATCH",
	});
}

// ─── Favourite ────────────────────────────────────────────────────────────────

export async function toggleFavourite(tenantSlug: string, id: string) {
	return apiFetch<KnowledgeArticle>(`/api/knowledge/articles/${id}/favourite`, {
		tenantSlug,
		method: "PATCH",
	});
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchArticles(tenantSlug: string, q: string) {
	return apiFetch<KnowledgeArticle[]>(
		`/api/knowledge/search?q=${encodeURIComponent(q)}`,
		{ tenantSlug },
	);
}

// ─── Related (cross-module widget) ────────────────────────────────────────────

export async function getRelatedArticles(tenantSlug: string, context: string) {
	return apiFetch<KnowledgeArticle[]>(
		`/api/knowledge/related?context=${encodeURIComponent(context)}`,
		{ tenantSlug },
	);
}

// ─── Members ──────────────────────────────────────────────────────────────────

export async function getMembers(tenantSlug: string, articleId: string) {
	return apiFetch<ArticleMember[]>(`/api/knowledge/articles/${articleId}/members`, {
		tenantSlug,
	});
}

export async function inviteMember(
	tenantSlug: string,
	articleId: string,
	userId: string,
	access: "CAN_EDIT" | "CAN_READ" | "NO_ACCESS",
) {
	return apiFetch<ArticleMember>(`/api/knowledge/articles/${articleId}/members`, {
		tenantSlug,
		method: "POST",
		body: { userId, access },
	});
}

export async function removeMember(
	tenantSlug: string,
	articleId: string,
	userId: string,
) {
	return apiFetch<{ message: string }>(
		`/api/knowledge/articles/${articleId}/members/${userId}`,
		{ tenantSlug, method: "DELETE" },
	);
}

export async function updateAccessSettings(
	tenantSlug: string,
	articleId: string,
	data: {
		defaultAccess?: "CAN_EDIT" | "CAN_READ" | "NO_ACCESS";
		visibility?: "EVERYONE" | "MEMBERS_ONLY";
	},
) {
	return apiFetch<KnowledgeArticle>(`/api/knowledge/articles/${articleId}/access`, {
		tenantSlug,
		method: "PUT",
		body: data,
	});
}

// ─── Versions ─────────────────────────────────────────────────────────────────

export async function getVersions(tenantSlug: string, articleId: string) {
	return apiFetch<ArticleVersion[]>(`/api/knowledge/articles/${articleId}/versions`, {
		tenantSlug,
	});
}

export async function getVersion(
	tenantSlug: string,
	articleId: string,
	versionId: string,
) {
	return apiFetch<ArticleVersion>(
		`/api/knowledge/articles/${articleId}/versions/${versionId}`,
		{ tenantSlug },
	);
}

export async function restoreVersion(
	tenantSlug: string,
	articleId: string,
	versionId: string,
) {
	return apiFetch<KnowledgeArticle>(
		`/api/knowledge/articles/${articleId}/versions/${versionId}/restore`,
		{ tenantSlug, method: "POST" },
	);
}

// ─── Properties ───────────────────────────────────────────────────────────────

export async function getProperties(tenantSlug: string, articleId: string) {
	return apiFetch<ArticleProperty[]>(
		`/api/knowledge/articles/${articleId}/properties`,
		{ tenantSlug },
	);
}

export async function addProperty(
	tenantSlug: string,
	articleId: string,
	data: {
		label: string;
		type: "TEXT" | "NUMBER" | "DATE" | "BOOLEAN" | "SELECT" | "USER_REF";
		value?: string;
	},
) {
	return apiFetch<ArticleProperty>(`/api/knowledge/articles/${articleId}/properties`, {
		tenantSlug,
		method: "POST",
		body: data,
	});
}

export async function deleteProperty(
	tenantSlug: string,
	articleId: string,
	propId: string,
) {
	return apiFetch<{ message: string }>(
		`/api/knowledge/articles/${articleId}/properties/${propId}`,
		{ tenantSlug, method: "DELETE" },
	);
}

// ─── Templates ────────────────────────────────────────────────────────────────

export async function getTemplates(tenantSlug: string) {
	return apiFetch<KnowledgeTemplate[]>("/api/knowledge/templates", { tenantSlug });
}
