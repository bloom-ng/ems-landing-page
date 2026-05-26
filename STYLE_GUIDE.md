# EMS Design System & Style Guide

This document defines the strict UI/UX rules for the EMS platform. All future developments by AI agents or developers must adhere to these constraints to ensure visual consistency.

## 1. Core Dimensions
- **Corner Radius**: 
  - Outer containers (Buttons, Cards, Inputs, Selects): **8px**
  - Inner containers (nested elements): **4px** (`outer_radius / 2`)
- **Spacing (Line Height)**: All text elements should have an additional **8px** of spacing (leading) relative to their font size.
  - CSS implementation: `line-height: calc(1em + 8px);`
- **Letter Spacing**: **2%** (`0.02em`) for all body and UI text.

## 2. Borders & Outlines
- **Border Stroke Color**: `#AFB1B5`
- **Border Width**:
  - Default state: **0.5px**
  - Active/Focus state: **1px**

## 3. Shadows
- **Shadow Specification**: 
  - Color: `#AFB1B5` at **10% opacity**
  - Offset: X: 0, **Y: -4px** (Shadow casts *upwards*)
  - Blur: **4px**
  - Spread: 0
  - CSS: `box-shadow: 0 -4px 4px 0 rgba(175, 177, 181, 0.1);`

## 4. Typography
- **Primary Font**: **Nunito Sans**
- **Casing Rules**:
  - **NEVER** use full caps lock (`text-transform: uppercase`).
  - Use **Capitalize Each Word** (`text-transform: capitalize`) for Buttons, Headers, and Labels.
  - Body text remains normal casing.

## 5. Icons
- **Icon Set**: **Material Symbols Outlined**
- **Weight**: Icon stroke weight must match the weight of the surrounding text (typically `wght: 400`).

## 6. Color Palette
- **Black (Foreground)**: `#101622`
- **White (Background)**: `#F8FAFC`
- **Red (Error)**: `#FB2C36`
- **Green (Success)**: `#05df72`

## 7. Development Patterns
- **Components First**: Always use existing components from `web/components/ui`.
- **Global Constraints**: These rules are strictly enforced in `web/app/globals.css`. Do not override them with ad-hoc Tailwind classes unless absolutely necessary.
