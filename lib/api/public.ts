import { apiFetch } from "./client";

export interface PublicPlan {
  id: string;
  name: string;
  tier: string;
  description: string | null;
  currency?: string;
  priceMonthly: number;
  priceYearly: number;
  seatPrice: number;
  includedSeats: number;
  employeeLimit: number | null;
  trialDays: number | null;
  features: string[];
}

export function getPublicPlans() {
  return apiFetch<PublicPlan[]>("/public/plans");
}
