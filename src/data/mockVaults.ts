export interface VaultAsset {
    name: string;
    value: number;
    color: string;
}

export interface Vault {
    id: string;
    rank: number;
    vaultName: string;
    owner: string;
    avatar: string;
    roi: string; // e.g. "+145.2%"
    roiUsd: string; // e.g. "+$145,230"
    tvl: string; // e.g. "$2.5M"
    description: string;
    assets: VaultAsset[];
}

export const MOCK_VAULTS: Vault[] = [
    {
        id: "1",
        rank: 1,
        vaultName: "CryptoKing Vault",
        owner: "@king_eth",
        avatar: "👑",
        roi: "+145.2%",
        roiUsd: "+$145,230",
        tvl: "$2.5M",
        description: "High-frequency ETH trading strategy focusing on volatility capture and market neutral positioning.",
        assets: [
            { name: "ETH", value: 45, color: "#6366f1" },
            { name: "USDC", value: 30, color: "#3b82f6" },
            { name: "WBTC", value: 15, color: "#a855f7" },
            { name: "LINK", value: 10, color: "#ec4899" },
        ],
    },
    {
        id: "2",
        rank: 2,
        vaultName: "DiamondHands Strategy",
        owner: "@hodl_4ever",
        avatar: "💎",
        roi: "+98.4%",
        roiUsd: "+$98,400",
        tvl: "$1.8M",
        description: "Long-term accumulation strategy focusing on blue-chip assets with minimal rotation.",
        assets: [
            { name: "BTC", value: 60, color: "#f59e0b" },
            { name: "ETH", value: 30, color: "#6366f1" },
            { name: "USDT", value: 10, color: "#10b981" },
        ],
    },
    {
        id: "3",
        rank: 3,
        vaultName: "MemeLord Alpha",
        owner: "@doge_master",
        avatar: "🐕",
        roi: "+45.1%",
        roiUsd: "+$45,100",
        tvl: "$1.2M",
        description: "Aggressive rotation into high-momentum meme coins and community-driven tokens.",
        assets: [
            { name: "DOGE", value: 40, color: "#fbbf24" },
            { name: "SHIB", value: 30, color: "#ef4444" },
            { name: "PEPE", value: 20, color: "#22c55e" },
            { name: "USDC", value: 10, color: "#3b82f6" },
        ],
    },
    {
        id: "4",
        rank: 4,
        vaultName: "AlphaSeeker Pro",
        owner: "@alpha_bet",
        avatar: "🦁",
        roi: "+32.5%",
        roiUsd: "+$32,500",
        tvl: "$900K",
        description: "DeFi yield farming aggregator optimizing for risk-adjusted returns across multiple chains.",
        assets: [
            { name: "USDC", value: 50, color: "#3b82f6" },
            { name: "DAI", value: 30, color: "#f59e0b" },
            { name: "USDT", value: 20, color: "#10b981" },
        ],
    },
    {
        id: "5",
        rank: 5,
        vaultName: "SatoshiFan Club",
        owner: "@btc_maxi",
        avatar: "₿",
        roi: "-5.2%",
        roiUsd: "-$5,200",
        tvl: "$850K",
        description: "Pure Bitcoin accumulation strategy. We stack sats and HODL regardless of market conditions.",
        assets: [
            { name: "BTC", value: 95, color: "#f59e0b" },
            { name: "USDC", value: 5, color: "#3b82f6" },
        ],
    },
    {
        id: "6",
        rank: 6,
        vaultName: "YieldFarmer Aggregator",
        owner: "@crop_rotator",
        avatar: "🌾",
        roi: "+12.8%",
        roiUsd: "+$12,800",
        tvl: "$700K",
        description: "Stablecoin liquidity provision on Curve and Uniswap V3.",
        assets: [
            { name: "USDC", value: 33, color: "#3b82f6" },
            { name: "USDT", value: 33, color: "#10b981" },
            { name: "DAI", value: 34, color: "#f59e0b" },
        ],
    },
    {
        id: "7",
        rank: 7,
        vaultName: "BearWhale Short",
        owner: "@short_seller",
        avatar: "🐻",
        roi: "-15.3%",
        roiUsd: "-$15,300",
        tvl: "$650K",
        description: "Market neutral strategy with a short bias, hedging against downside risk.",
        assets: [
            { name: "USDC", value: 80, color: "#3b82f6" },
            { name: "ETH (Short)", value: 20, color: "#ef4444" },
        ],
    },
];
