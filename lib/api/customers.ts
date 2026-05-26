import { apiFetch } from "./client";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const customerApi = {
  listCustomers: async (tenantSlug: string) => {
    return apiFetch<Customer[]>(`/api/accounting/customers`, { tenantSlug });
  },
};
