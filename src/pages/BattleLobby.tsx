import { useState } from "react";
import { Plus } from "lucide-react";
import { useAccount, useConnectModal } from "wagmi";
import { useBattleGame } from "../hooks/useBattleGame";
import { VaultSelectionModal } from "../components/battle/VaultSelectionModal";
import { OpponentSelectionModal } from "../components/battle/OpponentSelectionModal";
import { BattleArena } from "../components/battle/BattleArena";
import { BattleCountdown } from "../components/battle/BattleCountdown";
import { BattleResultModal } from "../components/battle/BattleResultModal";
import { RewardPopup } from "../components/battle/RewardPopup";

export function BattleLobby() {
    const [showRewardPopup, setShowRewardPopup] = useState(false);
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();

    const {
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
    } = useBattleGame();

    const handleClaimReward = () => {
        setShowRewardPopup(true);
    };

    const handleRewardPopupClose = () => {
        setShowRewardPopup(false);
        resetGame();
    };

    // Render different views based on game state
    if (gameState === 'readyToStart' && selectedVault && selectedOpponent) {
        return (
            <BattleArena
                vault={selectedVault}
                opponent={selectedOpponent}
                onStartBattle={startBattle}
                onBack={goBackToOpponentSelection}
            />
        );
    }

    if (gameState === 'countdown' && selectedVault && selectedOpponent) {
        return (
            <BattleCountdown
                countdown={countdown}
                vault={selectedVault}
                opponent={selectedOpponent}
                onMiniGameComplete={setMiniGameResult}
            />
        );
    }

    // Main lobby view
    return (
        <>
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-pixel text-glow">
                            1-MIN AI STRATEGY BATTLE
                        </h1>
                        <p className="text-muted-foreground font-tech max-w-2xl">
                            Face off against Crabbit&apos;s AI strategies in a 1-minute battle.<br />
                            Free to play – just your strategy, skill, and a bit of luck.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <button
                            onClick={isConnected ? startVaultSelection : () => openConnectModal?.()}
                            disabled={!isConnected}
                            className={`px-5 py-3 rounded-none font-pixel text-xs flex items-center gap-2 transition-all clip-path-polygon ${
                                isConnected
                                    ? "bg-carrot-orange text-carrot-orange-foreground hover:bg-carrot-orange/90 cursor-pointer"
                                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                            }`}
                        >
                            <Plus className="w-4 h-4" />
                            START_BATTLE
                        </button>
                        {!isConnected && (
                            <p className="text-xs text-muted-foreground font-mono text-right">
                                Please connect your wallet to start a battle
                            </p>
                        )}
                    </div>
                </div>

                {/* Battle Tutorial */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-card/60 border border-carrot-orange/30 p-6 rounded-lg relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-carrot-orange/10 rounded-full blur-3xl" />
                        <p className="text-[11px] font-pixel text-carrot-orange mb-2">
                            HOW_IT_WORKS
                        </p>
                        <h2 className="text-xl font-bold mb-3 font-pixel">
                            01. Choose your strategy
                        </h2>
                        <p className="text-sm text-muted-foreground font-tech">
                            Click <span className="font-mono text-carrot-orange">START_BATTLE</span> and
                            select a strategy you&apos;ve created or joined via a strategy. This becomes
                            your fighter for the next 1 minute.
                        </p>
                    </div>

                    <div className="bg-card/60 border border-carrot-orange/30 p-6 rounded-lg relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-success/10 rounded-full blur-3xl" />
                        <p className="text-[11px] font-pixel text-carrot-orange mb-2">
                            BATTLE_FLOW
                        </p>
                        <h2 className="text-xl font-bold mb-3 font-pixel">
                            02. Fight the AI for 1 minute
                        </h2>
                        <p className="text-sm text-muted-foreground font-tech">
                            Your strategy is matched against an AI strategy while you play the
                            mini-game. Dodge obstacles, rack up clears, and survive the full
                            minute to maximize your score.
                        </p>
                    </div>

                    <div className="bg-card/60 border border-carrot-orange/30 p-6 rounded-lg relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-warning/10 rounded-full blur-3xl" />
                        <p className="text-[11px] font-pixel text-carrot-orange mb-2">
                            REWARDS
                        </p>
                        <h2 className="text-xl font-bold mb-3 font-pixel">
                            03. Win $CRT rewards
                        </h2>
                        <p className="text-sm text-muted-foreground font-tech">
                            When the timer hits zero, we combine strategy performance and
                            mini-game clears. If you beat the AI, you earn CRT rewards – all
                            without locking any capital.
                        </p>
                    </div>
                </div>

                {/* Coming soon row for PVP battles */}
                <div className="bg-card/40 border border-dashed border-carrot-orange/30 p-5 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-pixel text-carrot-orange/70 mb-1">
                            PVP_MODE
                        </p>
                        <h3 className="text-lg font-pixel mb-1">
                            Player vs Player strategy battles are coming soon.
                        </h3>
                        <p className="text-xs text-muted-foreground font-tech max-w-xl">
                            The current MVP focuses on battles against platform AI strategies.
                            In a future update, you&apos;ll be able to challenge other traders
                            and climb a dedicated PvP leaderboard.
                        </p>
                    </div>
                    <div className="text-[10px] font-pixel uppercase px-3 py-1 border border-carrot-orange/40 text-carrot-orange rounded-none opacity-70">
                        PVP_COMING_SOON
                    </div>
                </div>
                {/* 
                // next feature: pvp mode 
                // filter for battles
                <div className="flex items-center gap-2 border-b border-border pb-4">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('running')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'running' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Running
                    </button>
                    <button
                        onClick={() => setFilter('waiting')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'waiting' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Waiting
                    </button>
                    <button
                        onClick={() => setFilter('ended')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'waiting' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        ended
                    </button>
                </div>
                
                // battle room list
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBattles.map(battle => (
                        <BattleCard key={battle.id} battle={battle} />
                    ))}
                </div>
                */}
            </div>

            {/* Modals */}
            <VaultSelectionModal
                isOpen={gameState === 'selectingVault'}
                onSelect={selectVault}
                onClose={resetGame}
            />

            <OpponentSelectionModal
                isOpen={gameState === 'selectingOpponent'}
                onSelect={selectOpponent}
                onBack={goBackToVaultSelection}
                onClose={resetGame}
            />

            {battleResult && selectedVault && selectedOpponent && (
                <BattleResultModal
                    isOpen={gameState === 'result'}
                    result={battleResult}
                    vault={selectedVault}
                    opponent={selectedOpponent}
                    onClaimReward={handleClaimReward}
                    onTryAgain={resetGame}
                    onReturnHome={resetGame}
                />
            )}

            <RewardPopup
                isOpen={showRewardPopup}
                amount={battleResult?.rewardAmount || 0}
                onClose={handleRewardPopupClose}
            />
        </>
    );
}

