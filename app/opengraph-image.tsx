import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = `${siteConfig.name} — All-in-One Employee Management System`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
	const green = siteConfig.themeColor; // #10B981

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					background:
						"linear-gradient(135deg, #0B1220 0%, #0F172A 55%, #10281F 100%)",
					padding: "72px",
					fontFamily: "sans-serif",
					position: "relative",
				}}
			>
				{/* Ambient accent glow */}
				<div
					style={{
						position: "absolute",
						top: "-160px",
						right: "-120px",
						width: "460px",
						height: "460px",
						borderRadius: "9999px",
						background: green,
						opacity: 0.18,
						filter: "blur(40px)",
						display: "flex",
					}}
				/>

				{/* Brand row */}
				<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
					<div
						style={{
							width: "64px",
							height: "64px",
							borderRadius: "16px",
							background: green,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "#04150E",
							fontSize: "38px",
							fontWeight: 800,
						}}
					>
						O
					</div>
					<div
						style={{
							color: "#FFFFFF",
							fontSize: "40px",
							fontWeight: 700,
							letterSpacing: "-0.5px",
						}}
					>
						{siteConfig.name}
					</div>
				</div>

				{/* Headline */}
				<div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "12px",
						}}
					>
						<div
							style={{
								width: "10px",
								height: "10px",
								borderRadius: "9999px",
								background: green,
								display: "flex",
							}}
						/>
						<div
							style={{
								color: green,
								fontSize: "24px",
								fontWeight: 600,
								letterSpacing: "3px",
							}}
						>
							EMPLOYEE MANAGEMENT SYSTEM
						</div>
					</div>
					<div
						style={{
							color: "#FFFFFF",
							fontSize: "68px",
							fontWeight: 800,
							lineHeight: 1.1,
							maxWidth: "980px",
							letterSpacing: "-1.5px",
						}}
					>
						One system, every team, all in one place.
					</div>
					<div
						style={{
							color: "#CBD5E1",
							fontSize: "30px",
							fontWeight: 400,
							maxWidth: "900px",
							lineHeight: 1.35,
						}}
					>
						HR, payroll, attendance, recruitment & performance — one platform.
					</div>
				</div>

				{/* Footer row */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<div style={{ color: "#94A3B8", fontSize: "26px", fontWeight: 500 }}>
						ogaflow.com
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							background: green,
							color: "#04150E",
							fontSize: "26px",
							fontWeight: 700,
							padding: "14px 32px",
							borderRadius: "9999px",
						}}
					>
						Start Free Trial
					</div>
				</div>
			</div>
		),
		{ ...size },
	);
}
