import { apiFetch } from "./client";

export interface Permission {
	id: string;
	key: string;
	name: string;
	description?: string;
}

export interface Role {
	id: string;
	name: string;
	tenantId: string | null;
	permissions: { permission: Permission }[];
}

export async function getTenantRoles(tenantSlug: string) {
	return apiFetch<Role[]>(`/tenant/roles`, { tenantSlug });
}

export async function createTenantRole(tenantSlug: string, name: string) {
	return apiFetch<Role>(`/tenant/roles`, {
		tenantSlug,
		method: "POST",
		body: { name },
	});
}

export async function deleteTenantRole(tenantSlug: string, roleId: string) {
	return apiFetch<{ message: string }>(`/tenant/roles/${roleId}`, {
		tenantSlug,
		method: "DELETE",
	});
}

export async function updateRolePermissions(tenantSlug: string, roleId: string, permissionIds: string[]) {
	return apiFetch<Role>(`/tenant/roles/${roleId}/permissions`, {
		tenantSlug,
		method: "POST",
		body: { permissionIds },
	});
}

export async function getAllPermissions(tenantSlug: string) {
	return apiFetch<Permission[]>(`/tenant/roles/permissions`, { tenantSlug });
}
