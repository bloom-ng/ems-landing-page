import { useEffect, useState, memo } from "react";
import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
	getTenantRoles,
	getAllPermissions,
	updateRolePermissions,
	Role,
	Permission,
} from "@/lib/api/roles";
import { toast } from "sonner";

interface PluginConfigModalProps {
	tenantSlug: string;
	plugin: { id: string; name: string } | null;
	isOpen: boolean;
	onClose: () => void;
}

// Single toggle cell — memoized so it only re-renders when hasPerm changes
const PermissionToggle = memo(function PermissionToggle({
	hasPerm,
	isSystemAdmin,
	roleId,
	permId,
	onToggle,
}: {
	hasPerm: boolean;
	isSystemAdmin: boolean;
	roleId: string;
	permId: string;
	onToggle: (roleId: string, permissionId: string) => void;
}) {
	return (
		<td className="p-4 text-center">
			<label className={`relative inline-flex items-center cursor-pointer ${isSystemAdmin ? "opacity-50" : ""}`}>
				<input
					type="checkbox"
					className="sr-only peer"
					checked={hasPerm}
					disabled={isSystemAdmin}
					onChange={() => onToggle(roleId, permId)}
				/>
				<div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary shadow-sm" />
			</label>
		</td>
	);
});

// Full row memoized — only re-renders when THIS role's permSet changes
const RoleRow = memo(function RoleRow({
	role,
	permSet,
	permissions,
	onToggle,
}: {
	role: Role;
	permSet: Set<string>;
	permissions: Permission[];
	onToggle: (roleId: string, permId: string) => void;
}) {
	const isSystemAdmin = role.name === "ADMIN" || role.name === "TENANT_ADMIN";
	return (
		<tr className="hover:bg-muted/5 transition-colors group">
			<td className="p-4 text-sm font-bold flex items-center gap-2 sticky left-0 bg-card group-hover:bg-muted/5 z-10 w-48 border-r border-border">
				{["ADMIN", "MANAGER", "EMPLOYEE", "TENANT_ADMIN"].includes(role.name) && (
					<span className="w-2 h-2 rounded-full bg-primary/80 shrink-0" title="System Role" />
				)}
				<span className="font-bold text-sm tracking-tight">{role.name}</span>
			</td>
			{permissions.map((perm) => (
				<PermissionToggle
					key={perm.id}
					hasPerm={permSet?.has(perm.id) || false}
					isSystemAdmin={isSystemAdmin}
					roleId={role.id}
					permId={perm.id}
					onToggle={onToggle}
				/>
			))}
		</tr>
	);
});

export function PluginConfigModal({ tenantSlug, plugin, isOpen, onClose }: PluginConfigModalProps) {
	const [roles, setRoles] = useState<Role[]>([]);
	const [pluginPermissions, setPluginPermissions] = useState<Permission[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// roleId -> Set of permissionIds
	const [rolePermissionsMap, setRolePermissionsMap] = useState<Record<string, Set<string>>>({});
	const [modifiedRoles, setModifiedRoles] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (isOpen && plugin) {
			fetchData();
		} else {
			setRoles([]);
			setPluginPermissions([]);
			setRolePermissionsMap({});
			setModifiedRoles(new Set());
		}
	}, [isOpen, plugin, tenantSlug]);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [allRoles, allPerms] = await Promise.all([
				getTenantRoles(tenantSlug),
				getAllPermissions(tenantSlug),
			]);

			const filteredPerms = allPerms.filter((p) => p.key.startsWith(`${plugin!.name}:`));
			const configurableRoles = allRoles.filter((r) => !["SUPER_ADMIN"].includes(r.name));

			setPluginPermissions(filteredPerms);
			setRoles(configurableRoles);

			const initialMap: Record<string, Set<string>> = {};
			configurableRoles.forEach((role) => {
				initialMap[role.id] = new Set(role.permissions.map((p) => p.permission.id));
			});
			setRolePermissionsMap(initialMap);
		} catch (err: any) {
			toast.error(`Failed to load configuration: ${err.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	// Stable callback — no deps that change
	const handleTogglePermission = React.useCallback((roleId: string, permissionId: string) => {
		setRolePermissionsMap((prev) => {
			const currentSet = new Set(prev[roleId] || []);
			if (currentSet.has(permissionId)) {
				currentSet.delete(permissionId);
			} else {
				currentSet.add(permissionId);
			}
			return { ...prev, [roleId]: currentSet };
		});
		setModifiedRoles((prev) => new Set(prev).add(roleId));
	}, []);

	const handleSave = async () => {
		if (modifiedRoles.size === 0) {
			onClose();
			return;
		}
		try {
			setIsSaving(true);
			await Promise.all(
				Array.from(modifiedRoles).map((roleId) =>
					updateRolePermissions(tenantSlug, roleId, Array.from(rolePermissionsMap[roleId])),
				),
			);
			toast.success("Plugin permissions updated successfully");
			onClose();
		} catch (err: any) {
			toast.error(`Failed to save changes: ${err.message}`);
		} finally {
			setIsSaving(false);
		}
	};

	if (!plugin) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`${plugin.name.toUpperCase()} Configuration`}
			className="max-w-5xl"
			footer={
				<div className="flex justify-end gap-3 w-full">
					<Button variant="outline" onClick={onClose}>Cancel</Button>
					<Button onClick={handleSave} disabled={isSaving || isLoading}>
						{isSaving ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			}
		>
			<div className="space-y-4">
				<div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl mb-6">
					<p className="text-xs text-muted font-medium italic">
						Configure permissions for the <strong>{plugin.name}</strong> plugin across your organization's roles.
					</p>
				</div>

				{isLoading ? (
					<div className="flex justify-center items-center py-12">
						<div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
					</div>
				) : pluginPermissions.length === 0 ? (
					<div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
						<span className="material-icons-outlined text-4xl text-muted mb-4 opacity-50">build_circle</span>
						<p className="text-muted text-sm font-bold">No configurable permissions found for this plugin.</p>
					</div>
				) : (
					<div className="overflow-x-auto border border-border rounded-xl">
						<table className="w-full text-left border-collapse min-w-max">
							<thead>
								<tr className="bg-muted/5 border-b border-border">
									<th className="p-4 font-black text-[11px] capitalize tracking-widest text-muted sticky left-0 bg-card z-10 w-48 border-r border-border">
										Role
									</th>
									{pluginPermissions.map((perm) => (
										<th
											key={perm.id}
											className="p-4 font-bold text-[11px] capitalize tracking-widest text-muted text-center min-w-[120px]"
											title={perm.description || perm.name}
										>
											{perm.name}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-border bg-card">
								{roles.map((role) => (
									<RoleRow
										key={role.id}
										role={role}
										permSet={rolePermissionsMap[role.id] || new Set()}
										permissions={pluginPermissions}
										onToggle={handleTogglePermission}
									/>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</Modal>
	);
}
