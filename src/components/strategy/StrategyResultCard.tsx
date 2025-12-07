import { Bot } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CHART_COLOR_PALETTE } from "../../lib/utils";
import type { StrategyToken } from "../../api/Strategy";

interface StrategyResultCardProps {
  variant: "real" | "sample";
  description: string;
  reasoning: string;
  tokens: StrategyToken[];
}

export function StrategyResultCard({
  variant,
  description,
  reasoning,
  tokens,
}: StrategyResultCardProps) {
  const pieData = tokens.map((token) => ({
    name: token.symbol,
    value: token.weight,
  }));

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-gradient-to-r from-carrot-orange/20 to-carrot-orange/20">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-carrot-orange to-carrot-orange flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">AI Strategy Architect</div>
          <div className="text-xs text-white font-mono">
            {variant === "real" ? "Generated from your prompt" : "Sample output format"}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-br from-carrot-orange/10 to-carrot-orange/10 border border-carrot-orange/20 rounded-xl p-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-white font-pixel">
                {variant === "real" ? "AI Meme Strategy" : "Sample Meme Strategy"}
              </h3>
            </div>
            <p className="text-white font-mono text-sm leading-relaxed mb-4">
              {description}
            </p>
            <p className="text-sm text-white font-mono leading-relaxed mb-4">
              {reasoning}
            </p>

            {/* Allocation – title + left: pie chart, right: detailed token list */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="text-xs text-white uppercase tracking-wider font-mono">
                Allocation
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Left: pie chart */}
                <div className="h-32 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        innerRadius={24}
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.name}-${index}`}
                            fill={
                              CHART_COLOR_PALETTE[
                                index % CHART_COLOR_PALETTE.length
                              ]
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Right: detailed token list */}
                <div className="space-y-2">
                  {tokens.map((token, idx) => (
                    <div
                      key={token.address}
                      className="flex items-center gap-2 text-[11px] font-mono text-white/80"
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            CHART_COLOR_PALETTE[
                              idx % CHART_COLOR_PALETTE.length
                            ],
                        }}
                      />
                      <span className="truncate">
                        {token.symbol}: {token.weight}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


