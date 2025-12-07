import { Link } from "react-router-dom";
import { ArrowRight, Trophy, TrendingUp, Zap, Shield, Coins } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-tech">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-carrot-orange/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-carrot-green/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full max-w-4xl mx-auto text-center"
                >
                    {/* Tokki Mascot */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto mb-8">
                        <motion.div
                            animate={{ 
                                y: [0, -15, -8, -15, 0],
                                x: [0, 3, -3, 3, 0],
                                rotate: [0, 2, -1, 2, 0],
                                scale: [1, 1.05, 1, 1.05, 1]
                            }}
                            transition={{ 
                                duration: 4, 
                                repeat: Infinity,
                                ease: "easeInOut",
                                times: [0, 0.25, 0.5, 0.75, 1]
                            }}
                            className="relative z-20 w-full h-full"
                        >
                            <motion.img 
                                src="/logos/Tokki.png" 
                                alt="Tokki Mascot" 
                                className="w-full h-full object-contain"
                                animate={{
                                    filter: [
                                        "drop-shadow(0 0 30px rgba(255,107,0,0.4))",
                                        "drop-shadow(0 0 40px rgba(255,107,0,0.6))",
                                        "drop-shadow(0 0 35px rgba(0,255,157,0.4))",
                                        "drop-shadow(0 0 40px rgba(255,107,0,0.6))",
                                        "drop-shadow(0 0 30px rgba(255,107,0,0.4))"
                                    ]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                        
                        {/* Animated Glow Behind Tokki */}
                        <motion.div 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-carrot-orange/20 blur-[60px] rounded-full z-10"
                            animate={{
                                scale: [1, 1.2, 1.1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.4, 0.5, 0.3]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>

                    {/* Headlines */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold font-pixel mb-6 leading-tight"
                    >
                        STRATEGY BATTLES <br />
                        <span className="text-carrot-orange text-glow">MEET DEFI YIELD</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
                    >
                        Deploy your strategies, battle for dominance, and earn <span className="text-carrot-green font-bold">CRT</span> rewards in the ultimate on-chain arena.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link 
                            to="/battle"
                            className="px-6 py-3 md:px-8 md:py-4 bg-carrot-orange text-carrot-orange-foreground font-pixel font-bold text-base md:text-lg rounded hover:bg-carrot-orange/90 transition-all shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] flex items-center gap-2"
                        >
                            ENTER BATTLE <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                        <Link 
                            to="/rank"
                            className="px-6 py-3 md:px-8 md:py-4 border-2 border-carrot-orange/50 text-carrot-orange font-pixel font-bold text-base md:text-lg rounded hover:bg-carrot-orange/10 transition-all"
                        >
                            VIEW RANKS
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Game + DeFi Highlights */}
            <section className="relative z-10 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: Battles */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-lg hover:border-carrot-orange/50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-carrot-orange/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-carrot-orange/20 transition-colors">
                                <Trophy className="w-6 h-6 text-carrot-orange" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-pixel mb-4 text-foreground">STRATEGY BATTLES</h3>
                            <p className="text-muted-foreground">
                                Compete against AI strategies in high-stakes yield battles. Winner takes the spoils.
                            </p>
                        </motion.div>

                        {/* Card 2: Strategies */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-lg hover:border-carrot-green/50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-carrot-green/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-carrot-green/20 transition-colors">
                                <TrendingUp className="w-6 h-6 text-carrot-green" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-pixel mb-4 text-foreground">YIELD STRATEGIES</h3>
                            <p className="text-muted-foreground">
                                Deposit into automated strategies. Let the best algorithms work for your APY.
                            </p>
                        </motion.div>

                        {/* Card 3: Rewards */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-lg hover:border-carrot-orange/50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-carrot-orange/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-carrot-orange/20 transition-colors">
                                <Coins className="w-6 h-6 text-carrot-orange" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-pixel mb-4 text-foreground">EARN CRT</h3>
                            <p className="text-muted-foreground">
                                Accumulate CRT tokens through battles and yield farming. The core of our economy.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CRT Token Section */}
            <section className="relative z-10 py-20 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-pixel mb-6">
                            POWERED BY <span className="text-carrot-green">CRT</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8">
                            The fuel for the Crabbit ecosystem. Stake, battle, and govern with the Carrot Token.
                            Real yield meets degen fun.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded">
                                <Zap className="w-4 h-4 text-carrot-green" />
                                <span>High APY</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded">
                                <Shield className="w-4 h-4 text-carrot-green" />
                                <span>Audited Contracts</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative flex justify-center">
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80"
                        >
                            <img 
                                src="/logos/CRT.png" 
                                alt="CRT Token" 
                                className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(0,255,157,0.3)]"
                            />
                        </motion.div>
                        {/* Background Elements for Token */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-carrot-green/20 blur-[80px] rounded-full" />
                    </div>
                </div>
            </section>
        </div>
    );
}
