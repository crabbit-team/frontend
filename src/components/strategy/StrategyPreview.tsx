import { ArrowRight, Shield, TrendingUp } from "lucide-react";

interface StrategyPreviewProps {
    strategy: {
        name: string;
        description: string;
        assets: string[];
        risk: 'Low' | 'Medium' | 'High';
        estApy: number;
    };
}

export function StrategyPreview({ strategy }: StrategyPreviewProps) {
    return (
        <div className="bg-card border border-border rounded-lg p-4 mt-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">{strategy.name}</h4>
                <div className="bg-carrot-orange/10 text-carrot-orange px-2 py-1 rounded text-xs font-bold">
                    AI GENERATED
                </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
                {strategy.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-secondary/50 p-2 rounded">
                    <span className="text-xs text-muted-foreground block">Risk Level</span>
                    <div className="flex items-center gap-1 font-medium text-sm">
                        <Shield className="w-3 h-3" />
                        {strategy.risk}
                    </div>
                </div>
                <div className="bg-secondary/50 p-2 rounded">
                    <span className="text-xs text-muted-foreground block">Est. APY</span>
                    <div className="flex items-center gap-1 font-medium text-sm text-success">
                        <TrendingUp className="w-3 h-3" />
                        {strategy.estApy}%
                    </div>
                </div>
            </div>

            <div className="flex gap-1 mb-4">
                {strategy.assets.map(asset => (
                    <span key={asset} className="bg-secondary px-2 py-1 rounded text-xs font-medium">
                        {asset}
                    </span>
                ))}
            </div>

            <button className="w-full bg-carrot-orange text-carrot-orange-foreground py-2 rounded-md font-medium text-sm hover:bg-carrot-orange/90 transition-colors flex items-center justify-center gap-2">
                Deploy Strategy
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}
