/**
 * Tier 배지 스타일 반환
 * Pixel-style, clean-edged 배지 디자인
 */
function getTierBadgeStyles(tier: string): {
    backgroundColor: string;
    color: string;
    borderColor: string;
    shadow: string;
    glow?: string;
} {
    const tierLower = tier.toLowerCase();
    
    switch (tierLower) {
        case "iron":
            // Metallic dark-gray, low-shine steel badge
            return {
                backgroundColor: "linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%)",
                color: "#e0e0e0",
                borderColor: "#4a4a4a",
                shadow: "0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            };
        case "bronze":
            // Warm bronze metal badge with subtle gloss
            return {
                backgroundColor: "linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)",
                color: "#fff4e6",
                borderColor: "#a0522d",
                shadow: "0 2px 6px rgba(205, 127, 50, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            };
        case "silver":
            // Cool silver chrome badge, balanced shine
            return {
                backgroundColor: "linear-gradient(135deg, #c0c0c0 0%, #808080 100%)",
                color: "#1a1a1a",
                borderColor: "#a0a0a0",
                shadow: "0 2px 8px rgba(192, 192, 192, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
            };
        case "gold":
            // Light gold metal badge with premium reflection
            return {
                backgroundColor: "linear-gradient(135deg, #ffd700 0%, #ffa500 100%)",
                color: "#1a1a1a",
                borderColor: "#ffb347",
                shadow: "0 2px 10px rgba(255, 215, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            };
        case "diamond":
            // Mint-blue diamond crystalline badge, faceted sparkle highlights
            return {
                backgroundColor: "linear-gradient(135deg, #7fffd4 0%, #40e0d0 50%, #00ced1 100%)",
                color: "#0a0a0f",
                borderColor: "#48d1cc",
                shadow: "0 2px 12px rgba(127, 255, 212, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
                glow: "0 0 20px rgba(127, 255, 212, 0.5)",
            };
        default:
            return {
                backgroundColor: "linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%)",
                color: "#e0e0e0",
                borderColor: "#4a4a4a",
                shadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            };
    }
}

/**
 * Tier 배지 컴포넌트
 * Pixel-style, clean-edged 배지
 * 
 * @param tier - Tier 이름 (iron, bronze, silver, gold, diamond)
 */
export function TierBadge({ tier }: { tier: string }) {
    const styles = getTierBadgeStyles(tier);
    const tierUpper = tier.toUpperCase();
    const isDiamond = tier.toLowerCase() === "diamond";
    
    return (
        <span
            className="inline-flex items-center justify-center font-bold text-[10px] font-pixel px-1.5 py-0.5 border"
            style={{
                background: styles.backgroundColor,
                color: styles.color,
                borderColor: styles.borderColor,
                boxShadow: styles.shadow,
                borderRadius: "3px", // Clean-edged, minimal rounding
                textShadow: isDiamond ? "0 0 6px rgba(127, 255, 212, 0.6)" : "none",
                filter: isDiamond && styles.glow ? `drop-shadow(${styles.glow})` : "none",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
            }}
        >
            {tierUpper}
        </span>
    );
}

