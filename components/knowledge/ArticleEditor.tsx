"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

interface ArticleEditorProps {
	content: string;
	isLocked: boolean;
	onChange: (html: string) => void;
}

export default function ArticleEditor({
	content,
	isLocked,
	onChange,
}: ArticleEditorProps) {
	const params = useParams();
	const tenantSlug = params?.tenantSlug as string;
	const articleId = params?.id as string;

	const editorRef = useRef<any>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const initialized = useRef(false);

	useEffect(() => {
		if (initialized.current || typeof window === "undefined") return;
		initialized.current = true;

		const script = document.createElement("script");
		script.src = "https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js";
		script.referrerPolicy = "origin";
		script.onload = () => {
			(window as any).tinymce.init({
				target: containerRef.current,

				// ── Layout ────────────────────────────────────────────────
				min_height: 520,
				resize: false,

				// ── UI ────────────────────────────────────────────────────
				menubar: false,
				branding: false,
				promotion: false,
				skin: "oxide",
				statusbar: true,

				// ── Plugins ───────────────────────────────────────────────
				plugins: [
					"advlist",
					"autolink",
					"lists",
					"link",
					"image",
					"charmap",
					"preview",
					"searchreplace",
					"autoresize",
					"fullscreen",
					"table",
					"code",
					"wordcount",
					"emoticons",
					"codesample",
				],

				// ── Toolbar ───────────────────────────────────────────────
				toolbar:
					"undo redo | formatselect | bold italic underline | " +
					"h1 h2 h3 | bullist numlist | link image table | " +
					"emoticons codesample | fullscreen",

				// ── Editor body styles ────────────────────────────────────
				// Always white — no OS dark-mode media query.
				content_style: `
					body {
						font-family: 'Nunito Sans', sans-serif;
						font-size: 15px;
						line-height: 1.7;
						color: #101622;
						background: #ffffff;
						padding: 28px 40px;
						max-width: 860px;
						margin: 0 auto;
					}
					h1, h2, h3, h4 { font-weight: 800; color: #0d1117; }
					a { color: #5a67d8; }
					img { max-width: 100%; border-radius: 8px; }
					pre { background: #f4f6fa; border-radius: 8px; padding: 12px 16px; font-size: 13px; }
					table { border-collapse: collapse; width: 100%; }
					td, th { border: 1px solid #e2e8f0; padding: 8px 12px; }
					blockquote { border-left: 3px solid #5a67d8; margin: 0; padding-left: 16px; color: #4a5568; font-style: italic; }
				`,

				// ── Image upload — matches HR's storageService pattern ────
				// Sends the file as multipart/form-data to the backend.
				// The backend uses the shared uploadKnowledgeImage multer middleware
				// then storageService.upload() — same as uploadEmployeePhoto in HR.
				images_upload_handler: async (
					blobInfo: any,
					progress: (pct: number) => void,
				): Promise<string> => {
					return new Promise((resolve, reject) => {
						const formData = new FormData();
						formData.append("file", blobInfo.blob(), blobInfo.filename());

						const token = localStorage.getItem("accessToken") ?? "";

						const xhr = new XMLHttpRequest();
						xhr.withCredentials = false;
						xhr.open("POST", `/api/knowledge/articles/${articleId}/image`);
						xhr.setRequestHeader("Authorization", `Bearer ${token}`);
						xhr.setRequestHeader("X-Tenant-Slug", tenantSlug);

						xhr.upload.onprogress = (e) => {
							progress((e.loaded / e.total) * 100);
						};

						xhr.onload = () => {
							if (xhr.status < 200 || xhr.status >= 300) {
								reject(`HTTP error: ${xhr.status}`);
								return;
							}
							try {
								const json = JSON.parse(xhr.responseText);
								resolve(json.data?.url ?? json.url);
							} catch {
								reject("Invalid server response");
							}
						};

						xhr.onerror = () => reject("Upload failed");
						xhr.send(formData);
					});
				},

				readonly: isLocked ? 1 : 0,

				setup: (editor: any) => {
					editorRef.current = editor;
					editor.on("init", () => {
						editor.setContent(content || "");
					});
					editor.on("change input keyup", () => {
						onChange(editor.getContent());
					});
				},
			});
		};
		document.head.appendChild(script);

		return () => {
			if (editorRef.current) {
				try {
					editorRef.current.destroy();
				} catch {
					// ignore cleanup errors on unmount
				}
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Sync lock state without re-initialising
	useEffect(() => {
		if (editorRef.current) {
			editorRef.current.setMode(isLocked ? "readonly" : "design");
		}
	}, [isLocked]);

	return (
		<div className="relative">
			{isLocked && (
				<div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black capitalize tracking-widest">
					<span className="material-icons-outlined text-[16px]">lock</span>
					This Article Is Locked — Read Only
				</div>
			)}
			<div
				ref={containerRef}
				id="knowledge-tinymce-editor"
			/>
		</div>
	);
}
