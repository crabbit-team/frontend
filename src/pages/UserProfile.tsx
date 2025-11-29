import { useParams } from "react-router-dom";
import { MOCK_LEADERBOARD, MOCK_BATTLES } from "../lib/mockData";
import { BattleCard } from "../components/battle/BattleCard";
import { Users, Trophy, Target, Calendar } from "lucide-react";

export function UserProfile() {
    const { id } = useParams();
    const user = MOCK_LEADERBOARD.find(u => u.id === id) || MOCK_LEADERBOARD[0];

    // Mock recent battles for this user
    const recentBattles = MOCK_BATTLES.slice(0, 2);

    return (
        <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold">
                        {user.username.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold">{user.username}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {user.followers.toLocaleString()} Followers
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Joined May 2024
                            </span>
                        </div>
                    </div>

                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
                        Follow
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Total PNL</div>
                        <div className="text-2xl font-bold text-green-600">+{user.pnl}%</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                        <div className="text-2xl font-bold flex items-center justify-center gap-1">
                            <Target className="w-5 h-5 text-muted-foreground" />
                            {user.winRate}%
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Rank</div>
                        <div className="text-2xl font-bold flex items-center justify-center gap-1">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            #{user.rank}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Battles</div>
                        <div className="text-2xl font-bold">{user.totalBattles}</div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Recent Battles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentBattles.map(battle => (
                        <BattleCard key={battle.id} battle={battle} />
                    ))}
                </div>
            </div>
        </div>
    );
}
