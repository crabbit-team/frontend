/**
 * Tier 색상만 반환하는 함수
 * @param tier - Tier 이름 (iron, bronze, silver, gold, diamond)
 * @returns Tier에 해당하는 색상 코드
 */
export function getTierColor(tier: string): string {
    const tierLower = tier.toLowerCase();
    
    switch (tierLower) {
        case "iron":
            return "#e0e0e0"; // Light gray
        case "bronze":
            return "#cd7f32"; // Bronze
        case "silver":
            return "#c0c0c0"; // Silver
        case "gold":
            return "#ffd700"; // Gold
        case "diamond":
            return "#7fffd4"; // Aquamarine/Diamond
        default:
            return "#e0e0e0"; // Default to iron color
    }
}

/**
 * Tier 배지 스타일 반환
 * Pixel-style, clean-edged 배지 디자인
 */
function getTierBadgeStyles(tier: string, size: "small" | "normal" | "large"): {
    backgroundColor: string;
    color: string;
    borderColor: string;
    shadow: string;
    glow?: string;
} {
    const tierLower = tier.toLowerCase();
    
    // 크기에 따른 shadow scale
    const shadowMultiplier = size === "small" ? 0.5 : size === "large" ? 1.2 : 1;
    const glowMultiplier = size === "small" ? 0.5 : size === "large" ? 1.2 : 1;
    
    switch (tierLower) {
        case "iron":
            // Metallic dark-gray, low-shine steel badge
            return {
                backgroundColor: "linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%)",
                color: "#e0e0e0",
                borderColor: "#4a4a4a",
                shadow: `0 ${2 * shadowMultiplier}px ${4 * shadowMultiplier}px rgba(0, 0, 0, 0.3), inset 0 ${1 * shadowMultiplier}px 0 rgba(255, 255, 255, 0.1)`,
            };
        case "bronze":
            // Warm bronze metal badge with subtle gloss
            return {
                backgroundColor: "linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)",
                color: "#fff4e6",
                borderColor: "#a0522d",
                shadow: `0 ${2 * shadowMultiplier}px ${6 * shadowMultiplier}px rgba(205, 127, 50, 0.4), inset 0 ${1 * shadowMultiplier}px 0 rgba(255, 255, 255, 0.2)`,
            };
        case "silver":
            // Cool silver chrome badge, balanced shine
            return {
                backgroundColor: "linear-gradient(135deg, #c0c0c0 0%, #808080 100%)",
                color: "#1a1a1a",
                borderColor: "#a0a0a0",
                shadow: `0 ${2 * shadowMultiplier}px ${8 * shadowMultiplier}px rgba(192, 192, 192, 0.5), inset 0 ${1 * shadowMultiplier}px 0 rgba(255, 255, 255, 0.3)`,
            };
        case "gold":
            // Light gold metal badge with premium reflection
            return {
                backgroundColor: "linear-gradient(135deg, #ffd700 0%, #ffa500 100%)",
                color: "#1a1a1a",
                borderColor: "#ffb347",
                shadow: `0 ${2 * shadowMultiplier}px ${10 * shadowMultiplier}px rgba(255, 215, 0, 0.6), inset 0 ${1 * shadowMultiplier}px 0 rgba(255, 255, 255, 0.4)`,
            };
        case "diamond":
            // Mint-blue diamond crystalline badge, faceted sparkle highlights
            return {
                backgroundColor: "linear-gradient(135deg, #7fffd4 0%, #40e0d0 50%, #00ced1 100%)",
                color: "#0a0a0f",
                borderColor: "#48d1cc",
                shadow: `0 ${2 * shadowMultiplier}px ${12 * shadowMultiplier}px rgba(127, 255, 212, 0.6), inset 0 ${1 * shadowMultiplier}px 0 rgba(255, 255, 255, 0.5)`,
                glow: `0 0 ${20 * glowMultiplier}px rgba(127, 255, 212, 0.5)`,
            };
        default:
            return {
                backgroundColor: "linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%)",
                color: "#e0e0e0",
                borderColor: "#4a4a4a",
                shadow: `0 ${2 * shadowMultiplier}px ${4 * shadowMultiplier}px rgba(0, 0, 0, 0.3)`,
            };
    }
}

export interface TierBadgeProps {
    /** Tier 이름 (iron, bronze, silver, gold, diamond) */
    tier: string;
    /** 배지 크기: 'small', 'normal', 'large' (기본값: 'normal') */
    size?: "small" | "normal" | "large";
    /** 클릭 이벤트 전파 방지 여부 (기본값: false) */
    stopPropagation?: boolean;
}

/**
 * Tier 배지 컴포넌트
 * Pixel-style, clean-edged 배지
 * 
 * @param tier - Tier 이름 (iron, bronze, silver, gold, diamond)
 * @param size - 배지 크기 ('small' | 'normal' | 'large')
 * @param stopPropagation - 클릭 이벤트 전파 방지 여부
 */
export function TierBadge({ tier, size = "normal", stopPropagation = false }: TierBadgeProps) {
    const styles = getTierBadgeStyles(tier, size);
    const tierUpper = tier.toUpperCase();
    const isDiamond = tier.toLowerCase() === "diamond";
    
    // 크기에 따른 스타일 설정
    const sizeStyles = {
        small: {
            textSize: "text-[8px]",
            paddingX: "px-1",
            paddingY: "py-0.5",
            letterSpacing: "0.02em",
            textShadowGlow: "0 0 4px rgba(127, 255, 212, 0.6)",
        },
        normal: {
            textSize: "text-[10px]",
            paddingX: "px-1.5",
            paddingY: "py-0.5",
            letterSpacing: "0.03em",
            textShadowGlow: "0 0 6px rgba(127, 255, 212, 0.6)",
        },
        large: {
            textSize: "text-xs",
            paddingX: "px-2",
            paddingY: "py-1",
            letterSpacing: "0.04em",
            textShadowGlow: "0 0 8px rgba(127, 255, 212, 0.6)",
        },
    };
    
    const currentSize = sizeStyles[size];
    
    return (
        <span
            className={`inline-flex items-center justify-center font-bold ${currentSize.textSize} font-pixel ${currentSize.paddingX} ${currentSize.paddingY} border flex-shrink-0`}
            style={{
                background: styles.backgroundColor,
                color: styles.color,
                borderColor: styles.borderColor,
                boxShadow: styles.shadow,
                borderRadius: "3px",
                textShadow: isDiamond ? currentSize.textShadowGlow : "none",
                filter: isDiamond && styles.glow ? `drop-shadow(${styles.glow})` : "none",
                textTransform: "uppercase",
                letterSpacing: currentSize.letterSpacing,
            }}
            onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
        >
            {tierUpper}
        </span>
    );
}
