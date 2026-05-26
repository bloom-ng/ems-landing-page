"use client";

import React from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	className?: string; // Add className
}

export function Modal({ isOpen, onClose, title, children, footer, className = '' }: ModalProps) {
	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
			onClick={onClose}
			role="presentation"
		>
			<div
				className={`bg-card w-full ${className ? className : "max-w-2xl"} rounded-default border border-border shadow-border overflow-hidden scale-in duration-300`}
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
			>
				<div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
					<h3
						id="modal-title"
						className="text-xl font-black tracking-tight text-foreground capitalize"
					>
						{title}
					</h3>
					<button 
						onClick={onClose}
						className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors text-muted hover:text-foreground"
					>
						<span className="material-icons-outlined text-xl">close</span>
					</button>
				</div>
				<div className="p-6 overflow-y-auto max-h-[70vh]">
					{children}
				</div>
				{footer && (
					<div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-3">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
}
