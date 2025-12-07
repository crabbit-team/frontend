import { useState, useEffect, useCallback } from 'react';
import type { VaultSummary } from '../api/vault';
import type { AIBattleStrategy } from '../api/battle';

export type BattleGameState = 'idle' | 'selectingVault' | 'selectingOpponent' | 'readyToStart' | 'countdown' | 'result';

export interface BattleResult {
    playerWon: boolean;
    playerROI: number;
    opponentROI: number;
    rewardAmount: number;
}

export function useBattleGame() {
    const [gameState, setGameState] = useState<BattleGameState>('idle');
    const [selectedVault, setSelectedVault] = useState<VaultSummary | null>(null);
    const [selectedOpponent, setSelectedOpponent] = useState<AIBattleStrategy | null>(null);
    const [countdown, setCountdown] = useState(60);
    const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
    const [isCountingDown, setIsCountingDown] = useState(false);

    const [miniGameWon, setMiniGameWon] = useState<boolean>(false);

    // Countdown logic
    useEffect(() => {
        if (gameState === 'countdown' && isCountingDown && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (gameState === 'countdown' && countdown === 0) {
            // Generate battle result
            generateBattleResult();
        }
    }, [gameState, countdown, isCountingDown]);

    const generateBattleResult = useCallback(() => {
        if (!selectedOpponent) return;

        // Random result generation (70% win rate for player)
        const playerWon = Math.random() < 0.7;

        // Generate realistic ROI values
        const playerROI = playerWon
            ? Math.random() * 25 + 5   // 5% to 30% if won
            : Math.random() * -15 - 2; // -2% to -17% if lost

        const opponentROI = !playerWon
            ? Math.random() * 20 + 3   // 3% to 23% if AI won
            : Math.random() * -12 - 3; // -3% to -15% if AI lost

        // Reward Policy:
        // - Investment Win + Mini Game Win -> 20
        // - Investment Win + Mini Game Lose -> 10
        // - Investment Lose -> 0
        let rewardAmount = 0;
        if (playerWon) {
            rewardAmount = miniGameWon ? 20 : 10;
        }

        const result: BattleResult = {
            playerROI: Math.round(playerROI * 10) / 10,
            opponentROI: Math.round(opponentROI * 10) / 10,
            playerWon,
            rewardAmount
        };

        setBattleResult(result);
        setGameState('result');
        setIsCountingDown(false);
    }, [selectedOpponent, miniGameWon]);

    const setMiniGameResult = useCallback((won: boolean) => {
        setMiniGameWon(won);
    }, []);

    const startVaultSelection = useCallback(() => {
        setGameState('selectingVault');
    }, []);

    const selectVault = useCallback((vault: VaultSummary) => {
        setSelectedVault(vault);
        setGameState('selectingOpponent');
    }, []);

    const selectOpponent = useCallback((opponent: AIBattleStrategy) => {
        setSelectedOpponent(opponent);
        setGameState('readyToStart');
    }, []);

    const startBattle = useCallback(() => {
        setCountdown(60);
        setIsCountingDown(true);
        setGameState('countdown');
    }, []);

    const resetGame = useCallback(() => {
        setGameState('idle');
        setSelectedVault(null);
        setSelectedOpponent(null);
        setCountdown(60);
        setBattleResult(null);
        setIsCountingDown(false);
    }, []);

    const goBackToVaultSelection = useCallback(() => {
        setSelectedOpponent(null);
        setGameState('selectingVault');
    }, []);

    const goBackToOpponentSelection = useCallback(() => {
        setGameState('selectingOpponent');
    }, []);

    return {
        gameState,
        selectedVault,
        selectedOpponent,
        countdown,
        battleResult,
        startVaultSelection,
        selectVault,
        selectOpponent,
        startBattle,
        resetGame,
        goBackToVaultSelection,
        goBackToOpponentSelection,
        setMiniGameResult
    };
}
