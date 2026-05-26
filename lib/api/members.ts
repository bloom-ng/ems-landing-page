import { apiFetch } from "./client";

export interface Member {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INVITED' | 'DISABLED';
  roles: { id: string; name: string }[];
  joinedAt: string;
}

export interface InviteMemberInput {
  name: string;
  email: string;
  roleId?: string;
}

export async function listMembers(tenantSlug: string): Promise<Member[]> {
  return apiFetch<Member[]>(`/tenant/members`, { tenantSlug });
}

export async function inviteMember(tenantSlug: string, data: InviteMemberInput): Promise<Member> {
  return apiFetch<Member>(`/tenant/members/invite`, {
    tenantSlug,
    method: 'POST',
    body: data,
  });
}

export async function resendInvite(tenantSlug: string, userId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/tenant/members/${userId}/resend-invite`, {
    tenantSlug,
    method: 'POST',
  });
}

export async function updateMember(tenantSlug: string, userId: string, data: Partial<InviteMemberInput>): Promise<Member> {
  return apiFetch<Member>(`/tenant/members/${userId}`, {
    tenantSlug,
    method: 'PUT',
    body: data,
  });
}

export async function removeMember(tenantSlug: string, userId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/tenant/members/${userId}`, {
    tenantSlug,
    method: 'DELETE',
  });
}

export async function cancelInvite(tenantSlug: string, userId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/tenant/members/${userId}/invite`, {
    tenantSlug,
    method: 'DELETE',
  });
}
