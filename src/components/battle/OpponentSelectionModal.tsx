import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { MOCK_AI_OPPONENTS, type AIOpponent } from "../../lib/mockData";
import { AIOpponentCard } from "./AIOpponentCard";

interface OpponentSelectionModalProps {
    isOpen: boolean;
    onSelect: (opponent: AIOpponent) => void;
    onBack: () => void;
    onClose: () => void;
}

export function OpponentSelectionModal({ isOpen, onSelect, onBack, onClose }: OpponentSelectionModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-6xl bg-background border border-carrot-orange/30 rounded-2xl shadow-[0_0_50px_rgba(208,129,65,0.3)] pointer-events-auto overflow-hidden">
                            {/* Header */}
                            <div className="relative border-b border-white/10 bg-gradient-to-r from-carrot-orange/20 to-carrot-orange/20 p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={onBack}
                                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                                        >
                                            <ArrowLeft className="w-5 h-5 text-gray" />
                                        </button>
                                        <div>
                                            <h2 className="text-3xl font-bold font-pixel text-transparent bg-clip-text bg-gradient-to-r from-carrot-orange to-pink">
                                                CHOOSE YOUR OPPONENT
                                            </h2>
                                            <p className="text-sm text-gray font-mono mt-2">
                                                Select an AI fund manager to battle against
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {MOCK_AI_OPPONENTS.map((opponent, index) => (
                                        <motion.div
                                            key={opponent.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <AIOpponentCard
                                                opponent={opponent}
                                                onSelect={onSelect}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
