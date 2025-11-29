export interface Battle {
    id: string;
    status: 'waiting' | 'active' | 'ended';
    playerA: string;
    playerB?: string;
    entryFee: number;
    prizePool: number;
    duration: string;
    timeLeft?: string;
    pnlA?: number;
    pnlB?: number;
}

export const MOCK_BATTLES: Battle[] = [
    {
        id: "battle_1",
        status: "waiting",
        playerA: "TraderAlpha",
        entryFee: 100,
        prizePool: 190,
        duration: "10m",
    },
    {
        id: "battle_2",
        status: "active",
        playerA: "DogeMaster",
        playerB: "PepeKing",
        entryFee: 500,
        prizePool: 950,
        duration: "1h",
        timeLeft: "45:20",
        pnlA: 12.5,
        pnlB: -2.3,
    },
    {
        id: "battle_3",
        status: "active",
        playerA: "WhaleWatcher",
        playerB: "CryptoNinja",
        entryFee: 1000,
        prizePool: 1900,
        duration: "24h",
        timeLeft: "12:05:00",
        pnlA: 5.2,
        pnlB: 8.1,
    },
    {
        id: "battle_4",
        status: "ended",
        playerA: "WinnerOne",
        playerB: "LoserTwo",
        entryFee: 50,
        prizePool: 95,
        duration: "5m",
        pnlA: 15.0,
        pnlB: -5.0,
    }
];

export interface Vault {
    id: string;
    name: string;
    manager: string;
    tvl: number;
    apy: number;
    description: string;
    holdings: { token: string; allocation: number }[];
}

export const MOCK_VAULTS: Vault[] = [
    {
        id: "vault_1",
        name: "Alpha Doge Momentum",
        manager: "ElonTrader",
        tvl: 50000,
        apy: 124.5,
        description: "High-risk momentum trading strategy focused on dog-themed meme coins. Rebalances daily based on social sentiment.",
        holdings: [
            { token: "DOGE", allocation: 40 },
            { token: "SHIB", allocation: 30 },
            { token: "USDT", allocation: 30 }
        ]
    },
    {
        id: "vault_2",
        name: "Safe Stable Yield",
        manager: "DeFi_Wizard",
        tvl: 1200000,
        apy: 12.0,
        description: "Low-risk stablecoin farming strategy. Yields are compounded automatically.",
        holdings: [
            { token: "USDT", allocation: 50 },
            { token: "USDC", allocation: 50 }
        ]
    },
    {
        id: "vault_3",
        name: "Pepe Max",
        manager: "FrogNation",
        tvl: 15000,
        apy: 340.0,
        description: "Degen strategy for PEPE maxis. Uses leverage when trend is bullish.",
        holdings: [
            { token: "PEPE", allocation: 90 },
            { token: "ETH", allocation: 10 }
        ]
    }
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
        description: "Conservative strategy focused on fundamentals and long-term holds."
    },
    {
        id: "ai_2",
        name: "Crypto Hawk",
        avatar: "from-purple-600 to-pink-600",
        difficulty: "Medium",
        winRate: 58,
        specialty: "Momentum Trading",
        description: "Rides trends and cuts losses quickly. Aggressive position sizing."
    },
    {
        id: "ai_3",
        name: "Quantum Trader",
        avatar: "from-green-600 to-teal-600",
        difficulty: "Medium",
        winRate: 62,
        specialty: "Arbitrage Master",
        description: "Exploits price differences across exchanges with lightning speed."
    },
    {
        id: "ai_4",
        name: "Degen King",
        avatar: "from-orange-600 to-red-600",
        difficulty: "Hard",
        winRate: 70,
        specialty: "Meme Coin Expert",
        description: "All-in on meme coins with perfect timing. High risk, high reward."
    },
    {
        id: "ai_5",
        name: "Alpha Bot",
        avatar: "from-indigo-600 to-purple-600",
        difficulty: "Hard",
        winRate: 75,
        specialty: "Multi-Strategy",
        description: "Combines multiple strategies with adaptive algorithms."
    },
    {
        id: "ai_6",
        name: "Satoshi's Ghost",
        avatar: "from-yellow-600 to-amber-600",
        difficulty: "Expert",
        winRate: 85,
        specialty: "Legendary",
        description: "The ultimate challenge. Perfect market prediction and execution."
    }
];

