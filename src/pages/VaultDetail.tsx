
import { motion } from "framer-motion";
import {
  Wallet,
  Info,
  ArrowLeft,
  Shield,
  DollarSign,
  Copy,
  ExternalLink,
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
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { getVaultByAddress, type VaultDetail } from "../api/vault";
import { CHART_COLOR_PALETTE } from "../lib/utils";
import { issueWithBase } from "../contracts/vault/issueWithBase";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { CONTRACT_ADDRESSES } from "../contracts/config";

export function VaultDetail() {
  const { id } = useParams();
  const { address, isConnected } = useAccount();

  const [vault, setVault] = useState<VaultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageLinkCopyFeedback, setImageLinkCopyFeedback] = useState<string | null>(null);
  const [copiedTokenIndex, setCopiedTokenIndex] = useState<number | null>(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null);

  // USDC 잔액 조회
  const { balance: usdcBalance, isLoading: isLoadingBalance } = useTokenBalance({
    tokenAddress: CONTRACT_ADDRESSES.USDC,
    userAddress: address,
    enabled: isConnected && !!address,
  });

  useEffect(() => {
    async function fetchVault() {
      if (!id) {
        setError("Vault address is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const vaultData = await getVaultByAddress(id);
        setVault(vaultData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch vault"
        );
        setVault(null);
      } finally {
        setLoading(false);
      }
    }

    void fetchVault();
  }, [id]);

  // Address 복사 핸들러
  const handleCopyAddress = async () => {
    if (!vault?.address) return;
    try {
      await navigator.clipboard.writeText(vault.address);
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error("Failed to copy address", err);
    }
  };

  // Image URL 복사 핸들러
  const handleCopyImageUrl = async () => {
    if (!vault?.image_url) return;
    try {
      await navigator.clipboard.writeText(vault.image_url);
      setImageLinkCopyFeedback("Copied!");
      setTimeout(() => setImageLinkCopyFeedback(null), 2000);
    } catch (err) {
      console.error("Failed to copy image URL", err);
    }
  };

  // 토큰 주소 복사 핸들러
  const handleCopyTokenAddress = async (address: string, index: number) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedTokenIndex(index);
      setTimeout(() => setCopiedTokenIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy token address", err);
    }
  };

  const handleDeposit = async () => {
    if (!id) {
      setDepositError("Vault address is required");
      return;
    }

    if (!isConnected || !address) {
      setDepositError("Please connect your wallet first");
      return;
    }

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setDepositError("Enter a valid deposit amount");
      return;
    }

    // USDC 잔액 확인
    if (usdcBalance) {
      const balanceFormatted = parseFloat(formatUnits(usdcBalance as bigint, 6));
      if (balanceFormatted < amountNum) {
        setDepositError(
          `Insufficient USDC balance. You have ${balanceFormatted.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} USDC but tried to deposit ${amountNum} USDC`
        );
        return;
      }
    }

    try {
      setIsDepositing(true);
      setDepositError(null);
      setDepositSuccess(null);

      const result = await issueWithBase({
        vaultAddress: id,
        usdcAmount: amountNum,
        slippageBps: 2000, // 20% slippage tolerance (더 관대한 설정)
      });

      console.log("Deposit result:", result);

      // Format shares for display
      const sharesFormatted = result.sharesReceived
        ? (parseFloat(formatUnits(result.sharesReceived.toBigInt(), 18))).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })
        : "N/A";

      setDepositSuccess(
        `Deposit successful! ${amountNum} USDC deposited. Shares received: ${sharesFormatted}`
      );
      setAmount(""); // Clear input
    } catch (err) {
      console.error("Deposit failed:", err);
      setDepositError(
        err instanceof Error ? err.message : "Deposit failed. Please try again."
      );
    } finally {
      setIsDepositing(false);
    }
  };

  // Strategy description 파싱 함수
  const parseStrategyDescription = (description: string) => {
    if (!description) return [{ label: "Description", value: "No description" }];

    const sections: { label: string; value: string }[] = [];
    const lines = description.split('\n').map(line => line.trim()).filter(line => line);

    for (const line of lines) {
      // "Label: Value" 형식 파싱
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const label = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        if (label && value) {
          sections.push({ label, value });
        }
      } else {
        // 콜론이 없는 경우 (Summary 등) - 이전 섹션의 값으로 추가하거나 새로운 Summary로 처리
        if (sections.length > 0 && !sections[sections.length - 1].value.includes(line)) {
          // 마지막 섹션이 비어있거나, 새로운 내용인 경우
          if (sections.length > 0 && sections[sections.length - 1].value === '') {
            sections[sections.length - 1].value = line;
          } else {
            sections.push({ label: 'Summary', value: line });
          }
        } else if (sections.length === 0) {
          sections.push({ label: 'Summary', value: line });
        }
      }
    }

    return sections.length > 0 ? sections : null;
  };

  // 차트에 사용할 포트폴리오 데이터
  const assets =
    vault?.portfolio?.map((item, index) => ({
      name: item.name || item.symbol || item.address.slice(0, 6) + "..." + item.address.slice(-4), // 토큰 이름 또는 심볼, 없으면 주소
      value: item.weight,
      color: CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length],
    })) ?? [];

  const strategySections = vault?.description ? parseStrategyDescription(vault.description) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-tech">
        <div className="animate-pulse text-carrot-orange">
          Loading Strategy Data...
        </div>
      </div>
    );
  }

  if (error || !vault) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-tech">
        <div className="text-error">Error: {error || "Vault not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-tech overflow-hidden relative pb-20">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-carrot-orange/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/20 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Back Button */}
        <Link
          to="/rank"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
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
              className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield className="w-32 h-32" />
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                {vault.image_url && vault.image_url.trim() ? (
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-carrot-orange/20 to-info/20 border border-border flex items-center justify-center shadow-[0_0_30px_rgba(208,129,65,0.2)] overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                  >
                    <img
                      src={vault.image_url}
                      alt={vault.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-carrot-orange/20 to-info/20 border border-border flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(208,129,65,0.2)]">
                    <span>{vault.name.charAt(0).toUpperCase()}</span>
                </div>
                )}
                <div className="space-y-2 flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold font-pixel tracking-tight text-foreground">
                    {vault.name}
                  </h1>
                  {/* Vault Address with Copy */}
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
                    <span className="text-white/60">{vault.address}</span>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1 rounded hover:bg-secondary/50 transition-colors flex items-center gap-1 group"
                      aria-label="Copy address"
                    >
                      <Copy className="w-3 h-3 text-muted-foreground group-hover:text-carrot-orange transition-colors" />
                    </button>
                    {copyFeedback && (
                      <span className="text-xs text-carrot-orange font-mono">
                        {copyFeedback}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
                    <span className="text-success flex items-center gap-1">
                      APY: {vault.performance?.apy?.toFixed(2) ?? 0}%
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className={`flex items-center gap-1 ${(vault.performance?.change_24h ?? 0) >= 0 ? "text-success" : "text-error"}`}>
                      24h: {(vault.performance?.change_24h ?? 0) >= 0 ? "+" : ""}{vault.performance?.change_24h?.toFixed(2) ?? 0}%
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-info">
                      TVL: ${parseFloat(vault.tvl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Strategy Description */}
                  {strategySections ? (
                    <div className="mt-6 space-y-4 max-w-2xl">
                      {strategySections.map((section, index) => (
                        <div key={index} className="space-y-1">
                          <div className="text-sm text-foreground font-mono whitespace-pre-line">
                            {section.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : vault.description ? (
                    <p className="text-sm text-muted-foreground max-w-2xl mt-4 leading-relaxed whitespace-pre-line">
                      {vault.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </motion.div>

            {/* 2. Creator Information Section */}
            {vault.creator && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold font-pixel mb-6 flex items-center gap-2">
                  Creator
                </h2>
                <div className="flex items-center gap-4">
                  {vault.creator.image_url && vault.creator.image_url.trim() ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-carrot-orange/10 flex items-center justify-center ring-2 ring-carrot-orange/20">
                      <img
                        src={vault.creator.image_url}
                        alt={vault.creator.nickname || "Creator"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-carrot-orange/10 flex items-center justify-center ring-2 ring-carrot-orange/20 text-carrot-orange text-xl font-mono">
                      ?
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="mb-2">
                      <p className="text-base font-bold font-pixel">
                        {vault.creator.nickname?.trim() || vault.name.slice(0, 3)}
                      </p>
                    </div>
                    {vault.creator.memex_link && vault.creator.memex_link.trim() ? (
                      <a
                        href={vault.creator.memex_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs text-carrot-orange hover:text-carrot-orange/80 transition-colors font-mono"
                      >
                        <span>View on Memex</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground font-mono">
                        memex: Not yet
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. Portfolio Composition Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm min-h-[400px]"
            >
              <h2 className="text-xl font-bold font-pixel mb-6 flex items-center gap-2">
                Portfolio Composition
                <Info className="w-4 h-4 text-muted-foreground" />
              </h2>

              {assets.length > 0 ? (
                <>
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
                            <span className="text-foreground font-mono ml-2">
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Portfolio List */}
                  <div className="mt-6 space-y-2">
                    {vault.portfolio.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50"
                      >
                        <div className="flex flex-col">
                          <span className="font-mono text-sm text-foreground font-bold">
                            {item.name || item.symbol || item.address.slice(0, 8) + "..." + item.address.slice(-6)}
                          </span>
                          {item.symbol && item.name && item.symbol !== item.name && (
                            <span className="font-mono text-xs text-muted-foreground">
                              {item.symbol}
                            </span>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">
                              {item.address.slice(0, 8)}...{item.address.slice(-6)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyTokenAddress(item.address, index);
                              }}
                              className="p-1 rounded hover:bg-secondary/50 transition-colors flex items-center gap-1 group"
                              aria-label="Copy token address"
                            >
                              <Copy className="w-3 h-3 text-muted-foreground group-hover:text-carrot-orange transition-colors" />
                            </button>
                            {copiedTokenIndex === index && (
                              <span className="text-xs text-carrot-orange font-mono">
                                Copied!
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-muted-foreground">
                            Amount: {item.amount}
                          </span>
                        </div>
                        <span className="font-mono text-sm font-bold text-carrot-orange">
                          {item.weight}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                  <p className="text-sm font-mono">No portfolio data available</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN (Deposit Panel) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-2xl p-6 backdrop-blur-sm sticky top-8 shadow-2xl"
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
                  <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border cursor-not-allowed opacity-80">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center text-info">
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
                      className="w-full bg-background border border-border rounded-xl p-4 text-2xl font-mono font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-carrot-orange/50 transition-colors"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                      USDC
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-mono text-muted-foreground px-1">
                    <span>
                      Balance:{" "}
                      {isLoadingBalance
                        ? "Loading..."
                        : usdcBalance
                          ? parseFloat(formatUnits(usdcBalance as bigint, 6)).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          : "0.00"}{" "}
                      USDC
                    </span>
                    <span>≈ ${amount || "0.00"}</span>
                  </div>
                </div>

                {/* Fee Notice */}
                <div className="p-3 bg-carrot-orange/10 border border-carrot-orange/20 rounded-lg text-xs text-carrot-orange-foreground/80 text-center font-mono leading-relaxed">
                  Your first 3 deposits are free.
                  <br />
                  Gas fees will apply after the 4th deposit.
                </div>

                {/* Action Button */}
                <button
                  onClick={handleDeposit}
                  disabled={isDepositing || !amount}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-carrot-orange to-carrot-orange text-carrot-orange-foreground font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(208,129,65,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wallet className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {isDepositing ? "DEPOSITING..." : "DEPOSIT USDC"}
                </button>

                {/* Error/Success Messages */}
                {depositError && (
                  <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-xs text-error text-center font-mono">
                    {depositError}
                  </div>
                )}
                {depositSuccess && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-xs text-success text-center font-mono">
                    {depositSuccess}
                  </div>
                )}

                {/* Empty State / Info */}
                <div className="pt-4 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground">
                    No active deposits in this strategy.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && vault.image_url && vault.image_url.trim() && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4 flex flex-col items-center gap-4">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 hover:bg-card border border-border flex items-center justify-center text-foreground hover:text-carrot-orange transition-colors z-10"
              aria-label="Close"
            >
              <span className="text-xl">×</span>
            </button>
            <img
              src={vault.image_url}
              alt={vault.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Image URL Link */}
            <div
              className="w-full bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 flex items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground font-mono mb-1">Image URL</div>
                <a
                  href={vault.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-carrot-orange hover:text-carrot-orange/80 font-mono break-all hover:underline flex items-center gap-2"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{vault.image_url}</span>
                </a>
              </div>
              <button
                onClick={handleCopyImageUrl}
                className="p-2 rounded hover:bg-secondary/50 transition-colors flex items-center gap-2 text-muted-foreground hover:text-carrot-orange"
                aria-label="Copy image URL"
              >
                <Copy className="w-4 h-4" />
                {imageLinkCopyFeedback && (
                  <span className="text-xs text-carrot-orange font-mono">
                    {imageLinkCopyFeedback}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

