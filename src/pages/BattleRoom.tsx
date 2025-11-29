import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { BattleChart } from "../components/battle/BattleChart";
import { TradePanel } from "../components/battle/TradePanel";
import { PlayerStats } from "../components/battle/PlayerStats";
import { MOCK_BATTLES } from "../lib/mockData";

export function BattleRoom() {
    const { id } = useParams();
    const battle = MOCK_BATTLES.find(b => b.id === id) || MOCK_BATTLES[1]; // Fallback to active battle for demo

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link to="/battle" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Lobby
                </Link>
                <div className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{battle.timeLeft || "00:00"}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <PlayerStats
                    name={battle.playerA}
                    pnl={battle.pnlA || 0}
                    equity={1125}
                />
                <PlayerStats
                    name={battle.playerB || "Opponent"}
                    pnl={battle.pnlB || 0}
                    equity={1082}
                    isOpponent
                />
            </div>

            <BattleChart />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-card border border-border rounded-lg p-6 h-full">
                        <h3 className="font-semibold mb-4">Your Portfolio</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>ETH</span>
                                <span className="font-medium">50%</span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-1/2"></div>
                            </div>

                            <div className="flex justify-between text-sm mt-2">
                                <span>PEPE</span>
                                <span className="font-medium">30%</span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[30%]"></div>
                            </div>

                            <div className="flex justify-between text-sm mt-2">
                                <span>USDT</span>
                                <span className="font-medium">20%</span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div className="bg-gray-500 h-full w-[20%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <TradePanel />
                </div>

                <div className="md:col-span-1">
                    <div className="bg-card border border-border rounded-lg p-6 h-full">
                        <h3 className="font-semibold mb-4">Battle Log</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex gap-2">
                                <span className="text-muted-foreground">10:05</span>
                                <span>{battle.playerB} bought PEPE</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-muted-foreground">10:03</span>
                                <span>You sold ETH</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-muted-foreground">10:00</span>
                                <span>Battle Started</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
