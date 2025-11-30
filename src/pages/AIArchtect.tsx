import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Zap, Bot, TrendingUp, Shield } from "lucide-react";
import { generateStrategy, type StrategyGenerateResponse } from "../api/Strategy";

const SAMPLE_PROMPTS = [
    "Generate a trend-following leveraged strategy.",
    "Build a beginner-friendly strategy with only 3 coins.",
    "Create an on-chain inflow screening strategy.",
];

export function AIArchitect () {
    const [prompt, setPrompt] = useState("");
    const [showPrompts, setShowPrompts] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [strategy, setStrategy] = useState<StrategyGenerateResponse | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setShowPrompts(false);
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateStrategy(prompt.trim());
            setStrategy(result);
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
                        Describe what you want. AI architect will build the strategy for you.
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

                {/* Example Output Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-16"
                >
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 font-mono">
                        {strategy ? "AI-Generated Strategy" : "How AI Generates a Strategy"}
                    </h2>
                    <div className="bg-[#13121a] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                        {/* Mock AI Response Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">AI Strategy Architect</div>
                                <div className="text-xs text-gray-400 font-mono">Generated in 2.3s</div>
                            </div>
                        </div>

                        {/* Mock Strategy Output */}
                        <div className="p-6 space-y-6">
                            <div>
                                <p className="text-gray-300 font-mono text-sm leading-relaxed mb-4">
                                    {strategy
                                        ? strategy.description
                                        : "I've analyzed your requirements and market conditions. Here's your custom strategy:"}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-900/10 to-indigo-900/10 border border-purple-500/20 rounded-xl p-5">
                                {strategy ? (
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-white font-pixel">
                                                AI Meme Strategy
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-400 font-mono leading-relaxed mb-4">
                                            {strategy.reasoning}
                                        </p>

                                        {/* Tokens & Weights */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">
                                                    Tokens
                                                </div>
                                                <div className="space-y-1">
                                                    {strategy.tokens.map((token, idx) => (
                                                        <div
                                                            key={token + idx}
                                                            className="text-xs font-mono text-white/90 break-all"
                                                        >
                                                            {token}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">
                                                    Weights (%)
                                                </div>
                                                <div className="space-y-1">
                                                    {strategy.weights.map((w, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-2 text-xs font-mono text-white/90"
                                                        >
                                                            <TrendingUp className="w-3 h-3 text-blue-400" />
                                                            <span>{w}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-bold text-white font-pixel">
                                                Momentum Alpha Strategy
                                            </h3>
                                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                                                Est. APY: 127%
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 font-mono leading-relaxed mb-4">
                                            High-frequency momentum strategy targeting top gainers with automatic profit-taking and stop-loss protection.
                                        </p>

                                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">
                                                    Risk Level
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-sm font-bold text-yellow-400">
                                                        Medium
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">
                                                    Assets
                                                </div>
                                                <div className="text-sm font-mono text-white">
                                                    BTC, ETH, SOL
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">
                                                    Timeframe
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-blue-400" />
                                                    <span className="text-sm font-mono text-white">
                                                        4H - 1D
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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
