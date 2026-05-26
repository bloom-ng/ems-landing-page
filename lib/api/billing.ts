import { apiFetch } from "./client";

export type BillingCycle = "monthly" | "yearly";

export interface SubscriptionInfo {
  planId: string;
  planName: string;
  planTier: string;
  seats: number;
  seatUsed: number;
  seatAvailable: number;
  status: "ACTIVE" | "TRIAL" | "EXPIRED";
  billingInterval?: string;
  startedAt: string;
  expiresAt: string | null;
  priceMonthly: number;
  priceYearly?: number;
  seatPrice: number;
  includedSeats?: number;
  billableSeats?: number;
  monthlyCost: number;
  trialDays?: number | null;
}

export interface SubscriptionResponse {
  subscription: SubscriptionInfo | null;
  seatUsed: number;
}

export interface Plan {
  id: string;
  name: string;
  tier: "FREE" | "STARTER" | "PRO" | "ENTERPRISE";
  description?: string | null;
  priceMonthly: number;
  priceYearly: number;
  seatPrice: number;
  includedSeats?: number;
  employeeLimit: number | null;
  trialDays?: number | null;
  _count?: { subscriptions: number };
}

export function getSubscription(tenantSlug: string) {
  return apiFetch<SubscriptionResponse>("/billing/subscription", { tenantSlug });
}

export function getPlans(tenantSlug: string) {
  return apiFetch<Plan[]>("/billing/plans", { tenantSlug });
}

export function initializeCheckout(
  tenantSlug: string,
  body: { planId: string; seats: number; interval?: BillingCycle },
) {
  return apiFetch<
    | { authorizationUrl: string; reference: string }
    | { activated: true; subscription: SubscriptionInfo }
  >("/billing/checkout", { method: "POST", tenantSlug, body });
}

export function initializeSeatUpgrade(
  tenantSlug: string,
  body: { seats: number; interval?: BillingCycle },
) {
  return apiFetch<
    | { authorizationUrl: string; reference: string }
    | { activated: true; subscription: SubscriptionInfo }
  >("/billing/seats/checkout", { method: "POST", tenantSlug, body });
}

export type PaymentStatus = "pending" | "completed";

export function getPaymentStatus(tenantSlug: string, reference: string) {
  return apiFetch<{
    status: PaymentStatus;
    subscription: SubscriptionInfo | null;
    message?: string;
  }>(
    `/billing/payment-status?reference=${encodeURIComponent(reference)}`,
    { tenantSlug },
  );
}

export function updateTenantSubscription(
  tenantId: string,
  body: {
    planId?: string;
    seats?: number;
    status?: "ACTIVE" | "TRIAL" | "EXPIRED";
    expiresAt?: string | null;
  },
) {
  return apiFetch(`/platform/tenants/${tenantId}/subscription`, {
    method: "PATCH",
    body,
  });
}

export function getTenantSubscription(tenantId: string) {
  return apiFetch<{
    subscription: {
      id: string;
      status: string;
      seats: number;
      startedAt: string;
      expiresAt: string | null;
      plan: Plan;
    } | null;
    seatUsed: number;
  }>(`/platform/tenants/${tenantId}/subscription`);
}
