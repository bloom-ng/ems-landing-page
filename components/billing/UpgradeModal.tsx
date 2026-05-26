"use client";

import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  tenantSlug: string;
}

export default function UpgradeModal({
  isOpen,
  onClose,
  message,
  tenantSlug,
}: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-icons-outlined text-amber-500 text-3xl">
            workspace_premium
          </span>
          <h2 className="text-lg font-semibold text-gray-900">
            Upgrade Required
          </h2>
        </div>

        <p className="text-gray-600 text-sm mb-6">{message}</p>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Dismiss
          </button>
          <Link
            href={`/${tenantSlug}/settings/billing`}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Manage Billing
          </Link>
        </div>
      </div>
    </div>
  );
}
