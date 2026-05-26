"use client";

import React, { useEffect, useState } from "react";

export function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		// Check initial state
		const isDarkMode =
			document.documentElement.classList.contains("dark") ||
			localStorage.getItem("theme") === "dark";
		setIsDark(isDarkMode);
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		}
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		if (newIsDark) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	return (
		<button
			onClick={toggleTheme}
			className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:text-primary hover:bg-foreground/5 transition-all font-bold text-xs capitalize tracking-widest w-full"
		>
			<span className="material-icons-outlined text-[20px]">
				{isDark ? "light_mode" : "dark_mode"}
			</span>
			{isDark ? "Light Mode" : "Dark Mode"}
		</button>
	);
}
