
import { motion } from "framer-motion";
import {
  Wallet,
  Info,
  ArrowLeft,
  TrendingUp,
  Shield,
  DollarSign,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useState } from "react";
import { useMockVault } from "../hooks/useMockVault";

export function VaultDetail() {
  const { id } = useParams();
  const { vault, loading, error } = useMockVault(id);
  const [amount, setAmount] = useState("");

  // 차트에 사용할 포트폴리오 데이터 (mockData의 portfolio 필드를 사용)
  const assets =
    vault?.portfolio?.map((item, index) => ({
      name: item.token,
      value: item.allocation,
      color: ["#A855F7", "#22C55E", "#3B82F6", "#F97316", "#EC4899"][index % 5],
    })) ?? [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0b10] flex items-center justify-center text-white font-tech">
        <div className="animate-pulse text-purple-400">
          Loading Strategy Data...
        </div>
      </div>
    );
  }

  if (error || !vault) {
    return (
      <div className="min-h-screen bg-[#0c0b10] flex items-center justify-center text-white font-tech">
        <div className="text-red-400">Error: {error || "Vault not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0b10] text-white font-tech overflow-hidden relative pb-20">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <Link
          to="/rank"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm">Back to Rank</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN (Strategy Information) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#13121a] border border-white/5 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield className="w-32 h-32" />
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                  {vault.name.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-2 flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold font-pixel tracking-tight text-white">
                    {vault.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
                    <span className="flex items-center gap-1 text-white/80">
                      {vault.manager}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      ROI: {vault.performance.apy}%
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-blue-400">
                      TVL: ${vault.tvl.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-2xl mt-4 leading-relaxed">
                    {vault.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 2. Portfolio Composition Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#13121a] border border-white/5 rounded-2xl p-8 backdrop-blur-sm min-h-[400px]"
            >
              <h2 className="text-xl font-bold font-pixel mb-6 flex items-center gap-2">
                Portfolio Composition
                <Info className="w-4 h-4 text-muted-foreground" />
              </h2>

              <div className="h-[300px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assets}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {assets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1924",
                        borderColor: "#333",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span className="text-white font-mono ml-2">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN (Deposit Panel) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#13121a] border border-white/5 rounded-2xl p-6 backdrop-blur-sm sticky top-8 shadow-2xl"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold font-pixel mb-1">Deposit</h2>
                <p className="text-xs text-muted-foreground font-mono">
                  Add liquidity to this strategy
                </p>
              </div>

              <div className="space-y-6">
                {/* Token Selector (Locked) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Asset
                  </label>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 cursor-not-allowed opacity-80">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <span className="font-bold">USDC</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      Locked
                    </span>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-2xl font-mono font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                      USDC
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-muted-foreground px-1">
                    <span>Balance: 0.00 USDC</span>
                    <span>≈ ${amount || "0.00"}</span>
                  </div>
                </div>

                {/* Fee Notice */}
                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-200/80 text-center font-mono leading-relaxed">
                  Your first 3 deposits are free.
                  <br />
                  Gas fees will apply after the 4th deposit.
                </div>

                {/* Action Button */}
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2 group">
                  <Wallet className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  DEPOSIT USDC
                </button>

                {/* Empty State / Info */}
                <div className="pt-4 border-t border-white/5 text-center">
                  <p className="text-xs text-muted-foreground">
                    No active deposits in this strategy.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

