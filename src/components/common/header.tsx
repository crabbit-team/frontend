import { Link } from "react-router-dom";
import { Terminal, Activity, Trophy, Zap } from "lucide-react";

export function Header() {
    return (
        <header className="border-b border-primary/30 sticky top-0 bg-background/90 backdrop-blur-md z-50 border-glow">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold tracking-tight font-pixel text-primary flex items-center gap-2 hover:text-primary/80 transition-colors">
                    <Terminal className="w-6 h-6" />
                    MEMERADER
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wider uppercase">
                    <Link to="/battle" className="flex items-center gap-2 hover:text-primary hover:text-glow transition-all">
                        <Trophy className="w-4 h-4" /> Battle
                    </Link>
                    <Link to="/rank" className="flex items-center gap-2 hover:text-primary hover:text-glow transition-all">
                        <Activity className="w-4 h-4" /> Rank
                    </Link>
                    <Link to="/ai-assist" className="flex items-center gap-2 hover:text-primary hover:text-glow transition-all">
                        <Zap className="w-4 h-4" /> AI-Strategy
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="bg-primary/10 border border-primary text-primary px-6 py-2 rounded-none font-pixel text-xs hover:bg-primary hover:text-primary-foreground transition-all clip-path-polygon">
                        [ CONNECT WALLET ]
                    </button>
                </div>
            </div>
        </header>
    );
}
