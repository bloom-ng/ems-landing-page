"use client";

import { useEffect, useState } from "react";
import { getTenantRoles, deleteTenantRole, Role } from "@/lib/api/roles";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface RoleListProps {
	tenantSlug: string;
	onEdit: (role: Role) => void;
	refreshTrigger: number;
}

export function RoleList({
	tenantSlug,
	onEdit,
	refreshTrigger,
}: RoleListProps) {
	const [roles, setRoles] = useState<Role[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchRoles = async () => {
		try {
			setIsLoading(true);
			const data = await getTenantRoles(tenantSlug);
			setRoles(data);
		} catch (err) {
			console.error("Failed to fetch roles", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchRoles();
	}, [tenantSlug, refreshTrigger]);

	const handleDelete = async (roleId: string) => {
		if (!confirm("Are you sure you want to delete this role?")) return;
		try {
			await deleteTenantRole(tenantSlug, roleId);
			toast.success("Role deleted successfully");
			fetchRoles();
		} catch (err) {
			toast.error(
				"Failed to delete role. System roles cannot be deleted.",
			);
		}
	};

	if (isLoading) {
		return (
			<div className="p-8 text-center animate-pulse font-bold tracking-widest text-xs capitalize text-muted">
				Loading roles...
			</div>
		);
	}

	return (
		<Card className="overflow-hidden border-[0.5px] border-border rounded-default bg-card/50 backdrop-blur-sm shadow-sm p-0">
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="border-b-[0.5px] border-border">
						<th className="p-4 text-xs font-bold capitalize tracking-widest text-muted">
							Role Name
						</th>
						<th className="p-4 text-xs font-bold capitalize tracking-widest text-muted">
							Permissions
						</th>
						<th className="p-4 text-xs font-bold capitalize tracking-widest text-muted text-right">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{roles.map((role) => (
						<tr
							key={role.id}
							className="border-b-[0.5px] border-border/50 hover:bg-foreground/[0.02] transition-colors group"
						>
							<td className="p-4">
								<span className="text-sm font-medium text-foreground">
									{role.name}
								</span>
								{role.tenantId === null && (
									<span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold capitalize tracking-tighter">
										System
									</span>
								)}
							</td>
							<td className="p-4">
								<span className="text-xs text-muted font-medium">
									{role.permissions.length} permissions
									assigned
								</span>
							</td>
							<td className="p-4 text-right">
								<div className="flex justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										className="h-8 px-3 text-[10px] font-bold capitalize tracking-widest border-primary/20 hover:border-primary/50"
										onClick={() => onEdit(role)}
									>
										Edit
									</Button>
									{role.name !== "ADMIN" &&
										role.name !== "TENANT_ADMIN" && (
											<Button
												variant="outline"
												size="sm"
												className="h-8 px-3 text-[10px] font-bold capitalize tracking-widest border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
												onClick={() =>
													handleDelete(role.id)
												}
											>
												Delete
											</Button>
										)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Card>
	);
}
