import { Link } from "react-router-dom";
import { Terminal, Activity, Trophy, Zap } from "lucide-react";
import { WalletProfileButton } from "./WalletProfileButton";

export function Header() {
    return (
        <header className="border-b border-carrot-orange/30 sticky top-0 bg-background/90 backdrop-blur-md z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold tracking-tight font-pixel text-carrot-orange flex items-center gap-2 hover:text-carrot-orange/80 transition-colors">
                    <Terminal className="w-6 h-6" />
                    CRABBIT
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider uppercase">
                    <Link to="/battle" className="flex items-center gap-2 hover:text-carrot-orange hover:text-glow transition-all">
                        <Trophy className="w-4 h-4" /> Battle
                    </Link>
                    <Link to="/rank" className="flex items-center gap-2 hover:text-carrot-orange hover:text-glow transition-all">
                        <Activity className="w-4 h-4" /> Rank
                    </Link>
                    <Link to="/ai-architect" className="flex items-center gap-2 hover:text-carrot-orange hover:text-glow transition-all">
                        <Zap className="w-4 h-4" /> AI-Architect
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <WalletProfileButton />
                </div>
            </div>
        </header>
    );
}
