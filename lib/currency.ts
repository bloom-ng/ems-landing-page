/** Nigerian Naira — all EMS plan prices are stored and displayed in NGN. */
export const CURRENCY_CODE = "NGN";
export const MIN_NAIRA = 100;

export function formatNaira(amount: number, options?: { decimals?: number }): string {
	const decimals = options?.decimals ?? amount % 1 === 0 ? 0 : 2;
	return `₦${amount.toLocaleString("en-NG", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	})}`;
}
