import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// HSL to Hex conversion utility for chart colors
function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return `#${[r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('')}`;
}

// Chart colors based on CSS custom properties
// These match the colors defined in index.css
export const CHART_COLORS = {
    success: hslToHex(142, 70, 50),    // --success: 142 70% 50%
    info: hslToHex(210, 100, 50),      // --info: 210 100% 50%
    warning: hslToHex(45, 90, 60),     // --warning: 45 90% 60%
    error: hslToHex(0, 84, 60),        // --error: 0 84% 60%
    pink: hslToHex(330, 100, 60),      // --pink: 330 100% 60%
    "carrot-orange": hslToHex(26, 65, 54),    // --carrot-orange: 26 65% 54%
};

// Default chart color palette
export const CHART_COLOR_PALETTE = [
    CHART_COLORS.success,
    CHART_COLORS.info,
    CHART_COLORS["carrot-orange"],
    CHART_COLORS.warning,
    CHART_COLORS.error,
];

// Additional colors for charts and UI
export const UI_COLORS = {
    gray: hslToHex(240, 3.7, 15.9),      // --gray: 240 3.7% 15.9%
    grayLight: hslToHex(240, 5, 64.9),    // --muted-foreground: 240 5% 64.9%
    card: hslToHex(240, 10, 3.9),        // --card: 240 10% 3.9%
};
