import { useState } from "react";
import { BattleCard } from "../components/battle/BattleCard";
import { MOCK_BATTLES } from "../lib/mockData";
import { Plus, Filter } from "lucide-react";
import { useBattleGame } from "../hooks/useBattleGame";
import { VaultSelectionModal } from "../components/battle/VaultSelectionModal";
import { OpponentSelectionModal } from "../components/battle/OpponentSelectionModal";
import { BattleArena } from "../components/battle/BattleArena";
import { BattleCountdown } from "../components/battle/BattleCountdown";
import { BattleResultModal } from "../components/battle/BattleResultModal";
import { RewardPopup } from "../components/battle/RewardPopup";

export function BattleLobby() {
    const [filter, setFilter] = useState<'all' | 'active' | 'waiting'>('all');
    const [showRewardPopup, setShowRewardPopup] = useState(false);

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
        goBackToOpponentSelection
    } = useBattleGame();

    const filteredBattles = MOCK_BATTLES.filter(battle => {
        if (filter === 'all') return true;
        return battle.status === filter;
    });

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
            />
        );
    }

    // Main lobby view
    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Battle Arena</h1>
                        <p className="text-muted-foreground">Compete in 1:1 trading battles and win prizes.</p>
                    </div>

                    <button
                        onClick={startVaultSelection}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Battle
                    </button>
                </div>

                <div className="flex items-center gap-2 border-b border-border pb-4">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'active' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('waiting')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === 'waiting' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Waiting
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBattles.map(battle => (
                        <BattleCard key={battle.id} battle={battle} />
                    ))}
                </div>
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

