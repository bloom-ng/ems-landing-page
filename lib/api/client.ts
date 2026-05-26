export interface ApiClientOptions {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: unknown;
	tenantSlug?: string;
	authToken?: string;
}

export interface ApiErrorPayload {
	message: string;
	code?: string;
	details?: unknown;
}

export class ApiError extends Error {
	readonly status: number;
	readonly payload?: ApiErrorPayload;

	constructor(status: number, payload?: ApiErrorPayload) {
		super(payload?.message ?? `Request failed with status ${status}`);
		this.status = status;
		this.payload = payload;
	}
}

const DEFAULT_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export async function apiFetch<T>(
	path: string,
	options: ApiClientOptions = {},
): Promise<T> {
	const { method = "GET", body, tenantSlug, authToken } = options;

	const headers: Record<string, string> = {};
	const isFormData = body instanceof FormData;

	if (!isFormData) {
		headers["Content-Type"] = "application/json";
	}

	if (tenantSlug) {
		headers["X-Tenant-Slug"] = tenantSlug;
	}

	let finalAuthToken = authToken;
	if (!finalAuthToken && typeof window !== 'undefined') {
		finalAuthToken = localStorage.getItem('token') || undefined;
	}

	if (finalAuthToken) {
		headers.Authorization = `Bearer ${finalAuthToken}`;
	}

	const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
		method,
		headers,
		body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
		cache: "no-store",
	});

	const contentType = response.headers.get("content-type");
	const isJson = contentType?.includes("application/json");
	const payload = isJson ? await response.json() : undefined;

	if (!response.ok) {
		throw new ApiError(
			response.status,
			payload as ApiErrorPayload | undefined,
		);
	}

	// Unwrap standard envelope if it exists
	if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
		return (payload as any).data as T;
	}

	return payload as T;
}
