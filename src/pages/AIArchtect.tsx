import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateStrategy } from "../api/Strategy";
import { StrategyResultCard } from "../components/strategy/StrategyResultCard";

const SAMPLE_PROMPTS = [
    "Generate a trend-following leveraged strategy.",
    "Build a beginner-friendly strategy with only 3 coins.",
    "Create an on-chain inflow screening strategy.",
];

// 샘플 전략(실제 호출 전 미리 보여주는 예시)은 이 페이지 안에서만 하드코딩으로 사용.
const SAMPLE_TOKENS = ["PEPE", "WIF", "POPCAT", "MOG", "BOME", "BRETT"];
const SAMPLE_WEIGHTS = [30, 20, 15, 15, 10, 10]; // 총 100%
const SAMPLE_DESCRIPTION =
    "Heavier allocation to PEPE and WIF, with diversified exposure to POPCAT, MOG, BOME, and BRETT.";
const SAMPLE_REASONING =
    "This strategy is constructed by analyzing recent on-chain momentum, liquidity flows, and volatility clusters. The AI allocates capital toward assets with strong social traction and sustained trading depth while balancing exposure with secondary performers to optimize risk-adjusted returns.";

export function AIArchitect () {
    const [prompt, setPrompt] = useState("");
    const [showPrompts, setShowPrompts] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setShowPrompts(false);
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateStrategy(prompt.trim());
            navigate("/strategy/result", { state: { strategy: result } });
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to generate strategy. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0c0b10] text-white overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10 max-w-4xl">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 space-y-4"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-pixel tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-200">
                        Create your own AI-powered trading strategy.
                    </h1>
                    <p className="text-base md:text-lg text-gray-400 font-mono max-w-2xl mx-auto leading-relaxed">
                        Describe what you want. <br /> AI architect will build the strategy for you.
                    </p>
                </motion.div>

                {/* Main Prompt Input Box */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="relative bg-[#13121a] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
                        <div className="relative p-6">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={`I want a short-term momentum strategy.\nCreate an on-chain inflow screening strategy.`}
                                className="w-full bg-transparent text-white placeholder:text-gray-600 text-lg font-mono resize-none focus:outline-none min-h-[120px] focus:border-purple-500/50"
                                rows={4}
                            />

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                                    <kbd className="px-2 py-1 bg-white/5 rounded text-gray-400">⌘</kbd>
                                    <span>+</span>
                                    <kbd className="px-2 py-1 bg-white/5 rounded text-gray-400">Enter</kbd>
                                    <span>to generate</span>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !prompt.trim()}
                                    className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>{isLoading ? "Generating..." : "Generate Strategy"}</span>
                                    <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recommended Prompt Cards */}
                {showPrompts && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mb-16"
                    >
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 font-mono">
                            Try These Prompts
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {SAMPLE_PROMPTS.map((samplePrompt, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                                    onClick={() => setPrompt(samplePrompt)}
                                    className="group relative p-5 bg-[#13121a] border border-white/5 rounded-xl hover:border-purple-500/30 hover:bg-white/5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] cursor-pointer"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-600/10 flex items-center justify-center shrink-0 group-hover:bg-purple-600/20 transition-colors">
                                            <Zap className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <p className="text-sm text-gray-300 font-mono leading-relaxed group-hover:text-white transition-colors">
                                            {samplePrompt}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Error message (if any) */}
                {error && (
                    <div className="mb-6 text-center text-xs text-red-400 font-mono">
                        {error}
                    </div>
                )}

                {/* Example Output Format (Sample) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-16"
                >
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 font-mono">
                        How AI Generates a Strategy
                    </h2>
                    <StrategyResultCard
                        variant="sample"
                        description={SAMPLE_DESCRIPTION}
                        reasoning={SAMPLE_REASONING}
                        tokens={SAMPLE_TOKENS}
                        weights={SAMPLE_WEIGHTS}
                    />
                </motion.div>

                {/* Disclaimer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-center"
                >
                    <p className="text-xs text-gray-600 font-mono">
                        AI strategies are generated for educational use only. Past performance does not guarantee future results.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
