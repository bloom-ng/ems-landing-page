export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const DEFAULT_BASE_URL = API_URL;

class ApiClient {
	private async request(path: string, options: RequestInit = {}) {
		const token =
			typeof window !== "undefined"
				? localStorage.getItem("token")
				: null;

		const isFormData = options.body instanceof FormData;

		const headers: Record<string, string> = {
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options.headers as any),
		};

		if (!isFormData) {
			headers["Content-Type"] = headers["Content-Type"] || "application/json";
		}

		const response = await fetch(`${API_URL}${path}`, {
			...options,
			headers,
		});

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ message: "An error occurred" }));
			throw new Error(error.message || "Something went wrong");
		}

		const payload = await response.json();

		// Unwrap standard envelope
		if (
			payload &&
			typeof payload === "object" &&
			"success" in payload &&
			"data" in payload
		) {
			return payload.data;
		}

		return payload;
	}

	get(path: string) {
		return this.request(path, { method: "GET" });
	}

	post(path: string, body: any) {
		const isFormData = body instanceof FormData;
		return this.request(path, {
			method: "POST",
			body: isFormData ? body : JSON.stringify(body),
		});
	}

	put(path: string, body: any) {
		const isFormData = body instanceof FormData;
		return this.request(path, {
			method: "PUT",
			body: isFormData ? body : JSON.stringify(body),
		});
	}

	patch(path: string, body: any) {
		const isFormData = body instanceof FormData;
		return this.request(path, {
			method: "PATCH",
			body: isFormData ? body : JSON.stringify(body),
		});
	}

	delete(path: string) {
		return this.request(path, { method: "DELETE" });
	}

	async uploadFile(path: string, file: File, fieldName = "file") {
		const token =
			typeof window !== "undefined"
				? localStorage.getItem("token")
				: null;
		const formData = new FormData();
		formData.append(fieldName, file);

		const response = await fetch(`${API_URL}${path}`, {
			method: "POST",
			headers: {
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: formData,
		});

		if (!response.ok) {
			const error = await response
				.json()
				.catch(() => ({ message: "Upload failed" }));
			throw new Error(error.message || "Upload failed");
		}

		const payload = await response.json();
		if (
			payload &&
			typeof payload === "object" &&
			"success" in payload &&
			"data" in payload
		) {
			return payload.data;
		}
		return payload;
	}
}

export const api = new ApiClient();
