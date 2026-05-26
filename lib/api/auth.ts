import { apiFetch } from "./client";

export interface PlatformLoginResponse {
	token: string;
	expiresIn: number;
}

export interface PlatformAdmin {
	id: string;
	email: string;
	name: string;
	role: string;
}

export interface TenantUser {
	id: string;
	email: string;
	name: string;
	tenantId: string;
	roles: string[];
}

export interface TenantLoginResponse {
	token: string;
	expiresIn: number;
	user: TenantUser;
}

export interface TenantOnboardResponse {
	tenantSlug: string;
	token: string;
	user: TenantUser;
}

export function loginPlatform(input: {
	email: string;
	password: string;
}): Promise<PlatformLoginResponse> {
	return apiFetch<PlatformLoginResponse>("/platform/auth/login", {
		method: "POST",
		body: input,
	});
}

export function getPlatformMe(authToken: string): Promise<PlatformAdmin> {
	return apiFetch<PlatformAdmin>("/platform/auth/me", {
		method: "GET",
		authToken,
	});
}

export function loginTenant(input: {
	email: string;
	password: string;
	tenantSlug: string;
}): Promise<TenantLoginResponse> {
	const { tenantSlug, ...body } = input;

	return apiFetch<TenantLoginResponse>("/tenant/auth/login", {
		method: "POST",
		tenantSlug,
		body,
	});
}

export function registerTenantUser(input: {
	tenantSlug: string;
	name: string;
	email: string;
	password: string;
	role?: string;
}): Promise<TenantLoginResponse> {
	const { tenantSlug, ...body } = input;

	return apiFetch<TenantLoginResponse>("/tenant/auth/register", {
		method: "POST",
		tenantSlug,
		body,
	});
}

export function getTenantMe(
	tenantSlug: string,
	authToken: string,
): Promise<TenantUser & { permissions: string[] }> {
	return apiFetch<TenantUser & { permissions: string[] }>("/tenant/auth/me", {
		method: "GET",
		tenantSlug,
		authToken,
	});
}

export function onboardTenant(input: {
	companyName: string;
	tenantSlug?: string;
	country?: string;
	adminName: string;
	adminEmail: string;
	adminPassword: string;
	planId?: string;
}): Promise<TenantOnboardResponse> {
	return apiFetch<TenantOnboardResponse>("/platform/tenants/onboard", {
		method: "POST",
		body: input,
	});
}

export async function getInviteInfo(token: string): Promise<{
	id: string;
	email: string;
	name: string;
	tenantId: string;
	tenantSlug: string;
	tenantName: string;
}> {
	return apiFetch<{
		id: string;
		email: string;
		name: string;
		tenantId: string;
		tenantSlug: string;
		tenantName: string;
	}>(`/api/auth/invite/${token}`);
}

export function acceptInvite(input: {
	tenantSlug?: string;
	token: string;
	password: string;
}): Promise<{ id: string; email: string; name: string; status: string }> {
	const { tenantSlug, ...body } = input;
	return apiFetch<{ id: string; email: string; name: string; status: string }>(
		tenantSlug ? "/tenant/auth/accept-invite" : "/api/auth/accept-invite",
		{
			method: "POST",
			tenantSlug,
			body,
		},
	);
}

export function forgotPassword(input: {
	tenantSlug: string;
	email: string;
}): Promise<{ message: string }> {
	const { tenantSlug, ...body } = input;
	return apiFetch<{ message: string }>("/tenant/auth/forgot-password", {
		method: "POST",
		tenantSlug,
		body,
	});
}

export function resetPassword(input: {
	tenantSlug: string;
	token: string;
	password: string;
}): Promise<{ message: string }> {
	const { tenantSlug, ...body } = input;
	return apiFetch<{ message: string }>("/tenant/auth/reset-password", {
		method: "POST",
		tenantSlug,
		body,
	});
}

export function logout(tenantSlug?: string) {
	if (typeof window !== "undefined") {
		localStorage.removeItem("token");
		if (tenantSlug) {
			window.location.href = `/${tenantSlug}/auth/login`;
		} else {
			window.location.href = "/platform/login";
		}
	}
}
