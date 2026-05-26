"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";

interface AuditLog {
	id: string;
	action: string;
	userId: string;
	ipAddress: string;
	route: string;
	method: string;
	statusCode: number;
	createdAt: string;
}

const PAGE_SIZE = 10;

export function AuditLogTable({ tenantSlug }: { tenantSlug?: string }) {
	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		async function fetchLogs() {
			setIsLoading(true);
			try {
				const endpoint = tenantSlug
					? `/api/audit-logs/tenant?page=${page}&limit=${PAGE_SIZE}`
					: `/api/audit-logs/platform?page=${page}&limit=${PAGE_SIZE}`;

				const data = await apiFetch<{
					items: AuditLog[];
					meta: { total: number; totalPages: number };
				}>(endpoint, { tenantSlug });
				setLogs(data.items);
				setTotal(data.meta.total);
			} catch (err) {
				console.error("Failed to fetch audit logs", err);
			} finally {
				setIsLoading(false);
			}
		}
		fetchLogs();
	}, [tenantSlug, page]);

	const totalPages = Math.ceil(total / PAGE_SIZE);

	if (isLoading) {
		return (
			<div className="p-8 text-center animate-pulse font-bold tracking-widest text-xs capitalize text-muted">
				Loading logs...
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<Card className="overflow-hidden border-border bg-card/50 backdrop-blur-sm shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-border">
								<th className="p-4 text-xs font-bold capitalize tracking-widest text-muted">
									Action / Route
								</th>
								<th className="p-4 text-xs font-bold capitalize tracking-widest text-muted">
									User ID
								</th>
								<th className="p-4 text-xs font-bold capitalize tracking-widest text-muted">
									IP Address
								</th>
								<th className="p-4 text-xs font-bold capitalize tracking-widest text-muted">
									Status
								</th>
								<th className="p-4 text-xs font-bold capitalize tracking-widest text-muted">
									Date
								</th>
							</tr>
						</thead>
						<tbody>
							{logs.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="p-8 text-center text-muted font-bold tracking-widest text-xs capitalize"
									>
										No logs found
									</td>
								</tr>
							) : (
								logs.map((log) => (
									<tr
										key={log.id}
										className="border-b border-border/50 hover:bg-foreground/[0.02] transition-colors group"
									>
										<td className="p-4">
											<span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
												{log.action}
											</span>
										</td>
										<td className="p-4">
											<span className="text-xs font-medium text-muted truncate max-w-[120px] block">
												{log.userId || "SYSTEM"}
											</span>
										</td>
										<td className="p-4">
											<span className="text-xs font-medium text-muted">
												{log.ipAddress || "unknown"}
											</span>
										</td>
										<td className="p-4">
											<span
												className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize tracking-widest shadow-sm ${
													log.statusCode >= 200 &&
													log.statusCode < 300
														? "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20"
														: log.statusCode >= 400
															? "bg-rose-500/10 text-rose-500 shadow-rose-500/20"
															: "bg-amber-500/10 text-amber-500 shadow-amber-500/20"
												}`}
											>
												{log.statusCode}
											</span>
										</td>
										<td className="p-4">
											<span className="text-xs text-muted font-medium">
												{new Date(
													log.createdAt,
												).toLocaleString()}
											</span>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</Card>
			<Pagination
				page={page}
				totalPages={totalPages}
				total={total}
				pageSize={PAGE_SIZE}
				onPageChange={setPage}
			/>
		</div>
	);
}
