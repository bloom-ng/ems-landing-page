"use client";

import { useState, useMemo, memo, useCallback, useRef } from "react";
import { Permission } from "@/lib/api/roles";
import { Checkbox } from "@/components/ui/Checkbox";

interface PermissionSelectorProps {
	allPermissions: Permission[];
	selectedPermissionIds: string[];
	onChange: (ids: string[]) => void;
}

const PermissionItem = memo(function PermissionItem({
	perm,
	isChecked,
	onToggle,
}: {
	perm: Permission;
	isChecked: boolean;
	onToggle: (id: string) => void;
}) {
	return (
		<label
			className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
				isChecked
					? "bg-primary/5 border-primary/30"
					: "bg-card/30 border-border/50 hover:border-primary/20"
			}`}
		>
			<div className="pt-0.5">
				<Checkbox checked={isChecked} onChange={() => onToggle(perm.id)} />
			</div>
			<div className="flex flex-col">
				<span className={`text-[11px] font-bold capitalize tracking-wider ${isChecked ? "text-primary" : "text-foreground"}`}>
					{perm.key.split(":").slice(1).join(":").replace(/_/g, " ")}
				</span>
				{perm.description && (
					<span className="text-[10px] text-muted leading-tight mt-0.5">{perm.description}</span>
				)}
				<span className="text-[9px] font-mono text-muted/50 mt-1">{perm.key}</span>
			</div>
		</label>
	);
});

export function PermissionSelector({ allPermissions, selectedPermissionIds, onChange }: PermissionSelectorProps) {
	// Keep a stable ref so togglePermission never changes and memo on PermissionItem holds
	const selectedIdsRef = useRef(selectedPermissionIds);
	selectedIdsRef.current = selectedPermissionIds;

	const selectedSet = useMemo(() => new Set(selectedPermissionIds), [selectedPermissionIds]);

	const grouped = useMemo(() => {
		return allPermissions.reduce((acc, perm) => {
			const [resource] = perm.key.split(":");
			if (!acc[resource]) acc[resource] = [];
			acc[resource].push(perm);
			return acc;
		}, {} as Record<string, Permission[]>);
	}, [allPermissions]);

	// Stable callback — never recreated, reads current ids via ref
	const togglePermission = useCallback((id: string) => {
		const ids = selectedIdsRef.current;
		if (ids.includes(id)) {
			onChange(ids.filter((pid) => pid !== id));
		} else {
			onChange([...ids, id]);
		}
	}, [onChange]);

	return (
		<div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
			{Object.entries(grouped).map(([resource, perms]) => (
				<div key={resource} className="space-y-3">
					<h4 className="text-[10px] font-black capitalize tracking-[0.2em] text-primary/60 border-b border-primary/10 pb-1">
						{resource} Management
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						{perms.map((perm) => (
							<PermissionItem
								key={perm.id}
								perm={perm}
								isChecked={selectedSet.has(perm.id)}
								onToggle={togglePermission}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
