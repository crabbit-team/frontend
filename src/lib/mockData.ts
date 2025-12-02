import type {
    VaultCreator,
    VaultPerformance,
    VaultPortfolioItem,
} from "../api/vault";
import type { BattleRoom } from "../api/battle";

export const MOCK_BATTLES: BattleRoom[] = [
    {
        id: 1,
        creator_address: "0xCreatorAlpha000000000000000000000000000001",
        creator_vault: "0x0000000000000000000000000000000000000001",
        opponent_address: null,
        opponent_vault: null,
        status: "WAITING",
        duration_seconds: 60,
        start_time: null,
        end_time: null,
        creator_return_pct: null,
        opponent_return_pct: null,
        winner_address: null,
        created_at: "2025-01-01T00:00:00Z",
        creator_cleared_count: null,
        opponent_cleared_count: null,
        minigame_winner: null,
        creator_combined_score: null,
        opponent_combined_score: null,
    },
    {
        id: 2,
        creator_address: "0xCreatorBravo000000000000000000000000000002",
        creator_vault: "0x0000000000000000000000000000000000000002",
        opponent_address: "0xOpponentBravo0000000000000000000000000002",
        opponent_vault: "0x0000000000000000000000000000000000000003",
        status: "IN_PROGRESS",
        duration_seconds: 60,
        start_time: "2025-01-01T00:00:00Z",
        end_time: null,
        creator_return_pct: 12.5,
        opponent_return_pct: -2.3,
        winner_address: null,
        created_at: "2025-01-01T00:00:00Z",
        creator_cleared_count: 10,
        opponent_cleared_count: 7,
        minigame_winner: "CREATOR",
        creator_combined_score: 0.82,
        opponent_combined_score: 0.61,
    },
    {
        id: 3,
        creator_address: "0xCreatorCharlie000000000000000000000000003",
        creator_vault: "0x0000000000000000000000000000000000000002",
        opponent_address: "0xOpponentCharlie0000000000000000000000003",
        opponent_vault: "0x0000000000000000000000000000000000000001",
        status: "IN_PROGRESS",
        duration_seconds: 3600,
        start_time: "2025-01-01T01:00:00Z",
        end_time: null,
        creator_return_pct: 5.2,
        opponent_return_pct: 8.1,
        winner_address: null,
        created_at: "2025-01-01T00:30:00Z",
        creator_cleared_count: 20,
        opponent_cleared_count: 22,
        minigame_winner: "OPPONENT",
        creator_combined_score: 0.64,
        opponent_combined_score: 0.71,
    },
    {
        id: 4,
        creator_address: "0xCreatorDelta00000000000000000000000000004",
        creator_vault: "0x0000000000000000000000000000000000000003",
        opponent_address: "0xOpponentDelta0000000000000000000000000004",
        opponent_vault: "0x0000000000000000000000000000000000000002",
        status: "ENDED",
        duration_seconds: 300,
        start_time: "2025-01-01T02:00:00Z",
        end_time: "2025-01-01T02:05:00Z",
        creator_return_pct: 15.0,
        opponent_return_pct: -5.0,
        winner_address: "0xCreatorDelta00000000000000000000000000004",
        created_at: "2025-01-01T01:50:00Z",
        creator_cleared_count: 18,
        opponent_cleared_count: 9,
        minigame_winner: "CREATOR",
        creator_combined_score: 0.9,
        opponent_combined_score: 0.3,
    },
];

export interface Vault {
    // Existing demo fields (battle UI, old pages)
    id: string;
    name: string;
    manager: string;
    tvl: number;
    apy: number;
    description: string;
    holdings: { token: string; allocation: number }[];

    // Fields aligned with backend VaultDetail schema
    address: string;
    creator: VaultCreator;
    performance: VaultPerformance;
    portfolio: VaultPortfolioItem[];
    strategy_description: string;
}

export const MOCK_VAULTS: Vault[] = [
    {
        id: "vault_1",
        name: "Alpha Doge Momentum",
        manager: "ElonTrader",
        tvl: 50_000,
        apy: 124.5,
        description:
            "High-risk momentum trading strategy focused on dog-themed meme coins. Rebalances daily based on social sentiment.",
        holdings: [
            { token: "DOGE", allocation: 40 },
            { token: "SHIB", allocation: 30 },
            { token: "USDT", allocation: 30 },
        ],

        // API-aligned fields
        address: "0x0000000000000000000000000000000000000001",
        creator: {
            address: "0x1111111111111111111111111111111111111111",
            image_url: null,
        },
        performance: {
            apy: 124.5,
            change_24h: 8.2,
        },
        portfolio: [
            { token: "DOGE", allocation: 40 },
            { token: "SHIB", allocation: 30 },
            { token: "USDT", allocation: 30 },
        ],
        strategy_description:
            "Momentum-based meme coin strategy focusing on dog-themed assets with daily rebalancing driven by social sentiment.",
    },
    {
        id: "vault_2",
        name: "Safe Stable Yield",
        manager: "DeFi_Wizard",
        tvl: 1_200_000,
        apy: 12.0,
        description:
            "Low-risk stablecoin farming strategy. Yields are compounded automatically.",
        holdings: [
            { token: "USDT", allocation: 50 },
            { token: "USDC", allocation: 50 },
        ],

        // API-aligned fields
        address: "0x0000000000000000000000000000000000000002",
        creator: {
            address: "0x2222222222222222222222222222222222222222",
            image_url: null,
        },
        performance: {
            apy: 12.0,
            change_24h: 0.5,
        },
        portfolio: [
            { token: "USDT", allocation: 50 },
            { token: "USDC", allocation: 50 },
        ],
        strategy_description:
            "Capital preservation focused vault allocating across major stablecoins to generate consistent yield.",
    },
    {
        id: "vault_3",
        name: "Pepe Max",
        manager: "FrogNation",
        tvl: 15_000,
        apy: 340.0,
        description:
            "Degen strategy for PEPE maxis. Uses leverage when trend is bullish.",
        holdings: [
            { token: "PEPE", allocation: 90 },
            { token: "ETH", allocation: 10 },
        ],

        // API-aligned fields
        address: "0x0000000000000000000000000000000000000003",
        creator: {
            address: "0x3333333333333333333333333333333333333333",
            image_url: null,
        },
        performance: {
            apy: 340.0,
            change_24h: -5.4,
        },
        portfolio: [
            { token: "PEPE", allocation: 90 },
            { token: "ETH", allocation: 10 },
        ],
        strategy_description:
            "High-volatility leveraged PEPE strategy aiming for outsized returns in strong uptrends.",
    },
    {
        id: "vault_4",
        name: "Solana DeFi Rush",
        manager: "SolanaWhale",
        tvl: 220_000,
        apy: 85.3,
        description:
            "Cross-protocol Solana DeFi strategy rotating between lending, perps, and meme coins.",
        holdings: [
            { token: "SOL", allocation: 50 },
            { token: "BONK", allocation: 30 },
            { token: "USDC", allocation: 20 },
        ],

        address: "0x0000000000000000000000000000000000000004",
        creator: {
            address: "0x4444444444444444444444444444444444444444",
            image_url: null,
        },
        performance: {
            apy: 85.3,
            change_24h: 3.1,
        },
        portfolio: [
            { token: "SOL", allocation: 50 },
            { token: "BONK", allocation: 30 },
            { token: "USDC", allocation: 20 },
        ],
        strategy_description:
            "Aggressive Solana ecosystem strategy balancing DeFi blue chips with BONK exposure.",
    },
    {
        id: "vault_5",
        name: "Base Meme Index",
        manager: "OnchainChad",
        tvl: 95_000,
        apy: 54.7,
        description:
            "Diversified meme coin index on Base chain with periodic rebalancing.",
        holdings: [
            { token: "BRETT", allocation: 40 },
            { token: "MOG", allocation: 35 },
            { token: "USDC", allocation: 25 },
        ],

        address: "0x0000000000000000000000000000000000000005",
        creator: {
            address: "0x5555555555555555555555555555555555555555",
            image_url: null,
        },
        performance: {
            apy: 54.7,
            change_24h: 1.2,
        },
        portfolio: [
            { token: "BRETT", allocation: 40 },
            { token: "MOG", allocation: 35 },
            { token: "USDC", allocation: 25 },
        ],
        strategy_description:
            "Index-style exposure to Base’s top meme coins with dynamic USDC buffer.",
    },
    {
        id: "vault_6",
        name: "Ai Meme Basket",
        manager: "Crabbit Labs",
        tvl: 310_000,
        apy: 72.4,
        description:
            "AI-selected meme coin basket optimized for risk-adjusted returns.",
        holdings: [
            { token: "PEPE", allocation: 25 },
            { token: "WIF", allocation: 25 },
            { token: "POPCAT", allocation: 25 },
            { token: "MOG", allocation: 25 },
        ],

        address: "0x0000000000000000000000000000000000000006",
        creator: {
            address: "0x6666666666666666666666666666666666666666",
            image_url: null,
        },
        performance: {
            apy: 72.4,
            change_24h: 4.5,
        },
        portfolio: [
            { token: "PEPE", allocation: 25 },
            { token: "WIF", allocation: 25 },
            { token: "POPCAT", allocation: 25 },
            { token: "MOG", allocation: 25 },
        ],
        strategy_description:
            "AI-driven allocation across high-liquidity meme assets with daily re-training.",
    },
    {
        id: "vault_7",
        name: "Stable Meme Hedge",
        manager: "RiskOffDeFi",
        tvl: 480_000,
        apy: 18.9,
        description:
            "Delta-hedged meme exposure backed by stablecoin collateral.",
        holdings: [
            { token: "USDT", allocation: 60 },
            { token: "USDC", allocation: 30 },
            { token: "PEPE", allocation: 10 },
        ],

        address: "0x0000000000000000000000000000000000000007",
        creator: {
            address: "0x7777777777777777777777777777777777777777",
            image_url: null,
        },
        performance: {
            apy: 18.9,
            change_24h: 0.9,
        },
        portfolio: [
            { token: "USDT", allocation: 60 },
            { token: "USDC", allocation: 30 },
            { token: "PEPE", allocation: 10 },
        ],
        strategy_description:
            "Conservative meme exposure using perps and stable collateral to limit downside.",
    },
    {
        id: "vault_8",
        name: "Degenerate Roulette",
        manager: "CasinoWhale",
        tvl: 42_000,
        apy: 520.0,
        description:
            "Ultra high-risk rotating concentration into the week’s hottest meme.",
        holdings: [
            { token: "RANDOM", allocation: 80 },
            { token: "USDT", allocation: 20 },
        ],

        address: "0x0000000000000000000000000000000000000008",
        creator: {
            address: "0x8888888888888888888888888888888888888888",
            image_url: null,
        },
        performance: {
            apy: 520.0,
            change_24h: 15.3,
        },
        portfolio: [
            { token: "RANDOM", allocation: 80 },
            { token: "USDT", allocation: 20 },
        ],
        strategy_description:
            "Single-asset YOLO strategy that periodically rotates into the most viral meme.",
    },
    {
        id: "vault_9",
        name: "ETH Gamma Crab",
        manager: "VolWizard",
        tvl: 860_000,
        apy: 28.3,
        description:
            "Options-based ETH strategy harvesting volatility with crab spreads.",
        holdings: [
            { token: "ETH", allocation: 70 },
            { token: "USDC", allocation: 30 },
        ],

        address: "0x0000000000000000000000000000000000000009",
        creator: {
            address: "0x9999999999999999999999999999999999999999",
            image_url: null,
        },
        performance: {
            apy: 28.3,
            change_24h: -1.1,
        },
        portfolio: [
            { token: "ETH", allocation: 70 },
            { token: "USDC", allocation: 30 },
        ],
        strategy_description:
            "Market-neutral ETH options strategy seeking to monetize implied volatility.",
    },
    {
        id: "vault_10",
        name: "Layer2 Meme Rotation",
        manager: "RollupMaxi",
        tvl: 130_000,
        apy: 61.5,
        description:
            "Rotates between meme ecosystems on major L2s (Base, Arbitrum, Optimism).",
        holdings: [
            { token: "BRETT", allocation: 30 },
            { token: "MOG", allocation: 30 },
            { token: "OP", allocation: 20 },
            { token: "ARB", allocation: 20 },
        ],

        address: "0x0000000000000000000000000000000000000010",
        creator: {
            address: "0x1010101010101010101010101010101010101010",
            image_url: null,
        },
        performance: {
            apy: 61.5,
            change_24h: 2.7,
        },
        portfolio: [
            { token: "BRETT", allocation: 30 },
            { token: "MOG", allocation: 30 },
            { token: "OP", allocation: 20 },
            { token: "ARB", allocation: 20 },
        ],
        strategy_description:
            "Cross-rollup meme rotation strategy capturing flows into L2 ecosystems.",
    },
];

export interface User {
    id: string;
    rank: number;
    username: string;
    pnl: number;
    winRate: number;
    totalBattles: number;
    followers: number;
}

export const MOCK_LEADERBOARD: User[] = [
    { id: "u1", rank: 1, username: "ElonTrader", pnl: 450.2, winRate: 78, totalBattles: 142, followers: 5200 },
    { id: "u2", rank: 2, username: "DogeMaster", pnl: 320.5, winRate: 65, totalBattles: 98, followers: 3100 },
    { id: "u3", rank: 3, username: "PepeKing", pnl: 280.1, winRate: 55, totalBattles: 210, followers: 8900 },
    { id: "u4", rank: 4, username: "CryptoNinja", pnl: 150.8, winRate: 60, totalBattles: 45, followers: 1200 },
    { id: "u5", rank: 5, username: "WhaleWatcher", pnl: 98.4, winRate: 52, totalBattles: 112, followers: 2400 },
];

// Battle Game Types
export type BattleGameState =
    | 'idle'
    | 'selectingVault'
    | 'selectingOpponent'
    | 'readyToStart'
    | 'countdown'
    | 'result';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface AIOpponent {
    id: string;
    name: string;
    avatar: string; // gradient color for now
    difficulty: DifficultyLevel;
    winRate: number;
    specialty: string;
    description: string;
    // Treat AI opponents as platform-created strategies with simple APY/TVL stats.
    apy: number;
    tvl: number;
    // Simple holdings view: derived from AIBattleStrategy tokens/weights.
    holdings: { token: string; allocation: number }[];
}

export interface BattleResult {
    playerROI: number;
    opponentROI: number;
    playerWon: boolean;
    rewardAmount: number;
}

export const MOCK_AI_OPPONENTS: AIOpponent[] = [
    {
        id: "ai_1",
        name: "Warren AI",
        avatar: "from-blue-600 to-cyan-600",
        difficulty: "Easy",
        winRate: 45,
        specialty: "Value Investing",
        description: "Conservative strategy focused on fundamentals and long-term holds.",
        apy: 18.5,
        tvl: 150_000,
        holdings: [
            { token: "BTC", allocation: 40 },
            { token: "ETH", allocation: 30 },
            { token: "USDC", allocation: 30 },
        ],
    },
    {
        id: "ai_2",
        name: "Crypto Hawk",
        avatar: "from-purple-600 to-pink-600",
        difficulty: "Medium",
        winRate: 58,
        specialty: "Momentum Trading",
        description: "Rides trends and cuts losses quickly. Aggressive position sizing.",
        apy: 42.1,
        tvl: 95_000,
        holdings: [
            { token: "PEPE", allocation: 35 },
            { token: "WIF", allocation: 35 },
            { token: "BONK", allocation: 30 },
        ],
    },
    {
        id: "ai_3",
        name: "Quantum Trader",
        avatar: "from-green-600 to-teal-600",
        difficulty: "Medium",
        winRate: 62,
        specialty: "Arbitrage Master",
        description: "Exploits price differences across exchanges with lightning speed.",
        apy: 35.4,
        tvl: 210_000,
        holdings: [
            { token: "USDT", allocation: 50 },
            { token: "USDC", allocation: 50 },
        ],
    },
    {
        id: "ai_4",
        name: "Degen King",
        avatar: "from-orange-600 to-red-600",
        difficulty: "Hard",
        winRate: 70,
        specialty: "Meme Coin Expert",
        description: "All-in on meme coins with perfect timing. High risk, high reward.",
        apy: 120.7,
        tvl: 32_000,
        holdings: [
            { token: "PEPE", allocation: 60 },
            { token: "MOG", allocation: 25 },
            { token: "BOME", allocation: 15 },
        ],
    },
    {
        id: "ai_5",
        name: "Alpha Bot",
        avatar: "from-indigo-600 to-purple-600",
        difficulty: "Hard",
        winRate: 75,
        specialty: "Multi-Strategy",
        description: "Combines multiple strategies with adaptive algorithms.",
        apy: 65.3,
        tvl: 175_000,
        holdings: [
            { token: "PEPE", allocation: 20 },
            { token: "WIF", allocation: 20 },
            { token: "POPCAT", allocation: 20 },
            { token: "MOG", allocation: 20 },
            { token: "BOME", allocation: 20 },
        ],
    },
    {
        id: "ai_6",
        name: "Satoshi's Ghost",
        avatar: "from-yellow-600 to-amber-600",
        difficulty: "Expert",
        winRate: 85,
        specialty: "Legendary",
        description: "The ultimate challenge. Perfect market prediction and execution.",
        apy: 250.0,
        tvl: 500_000,
        holdings: [
            { token: "PEPE", allocation: 25 },
            { token: "WIF", allocation: 25 },
            { token: "POPCAT", allocation: 25 },
            { token: "MOG", allocation: 25 },
        ],
    }
];

