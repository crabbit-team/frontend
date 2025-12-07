/**
 * AIArchitect 페이지 컴포넌트
 * 
 * AI를 사용하여 거래 전략을 생성하는 페이지입니다.
 * 사용자가 프롬프트를 입력하면 AI가 전략을 생성하고 결과를 표시합니다.
 * 
 * 색상 시스템:
 * - 메인 브랜드 색상: carrot-orange (HSL: 26 65% 54%, RGB: rgb(208, 129, 65))
 * - 배경: background (다크 테마)
 * - 텍스트: foreground (밝은 텍스트)
 * - 카드: card (반투명 다크 배경)
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateStrategy, type StrategyToken } from "../api/Strategy";
import { StrategyResultCard } from "../components/strategy/StrategyResultCard";

/**
 * 샘플 프롬프트 목록
 * 사용자가 클릭하여 빠르게 입력할 수 있는 예시 프롬프트들
 */
const SAMPLE_PROMPTS = [
    "Generate a trend-following leveraged strategy.",
    "Build a beginner-friendly strategy with only 3 coins.",
    "Create an on-chain inflow screening strategy.",
];

/**
 * 샘플 전략 데이터
 * 실제 API 호출 전 미리 보여주는 예시 전략 정보
 * 이 페이지 안에서만 하드코딩으로 사용됩니다.
 */
const SAMPLE_TOKENS: StrategyToken[] = [
    {
        address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
        decimals: 18,
        name: "Pepe",
        price_usd: 0.00001234,
        symbol: "PEPE",
        weight: 30,
    },
    {
        address: "0xba2ae424d960c26247dd6c32edc70b295c744c43",
        decimals: 18,
        name: "Dogwifhat",
        price_usd: 0.08,
        symbol: "WIF",
        weight: 20,
    },
    {
        address: "0x0000000000000000000000000000000000000001",
        decimals: 18,
        name: "Popcat",
        price_usd: 0.05,
        symbol: "POPCAT",
        weight: 15,
    },
    {
        address: "0x0000000000000000000000000000000000000002",
        decimals: 18,
        name: "Mog Coin",
        price_usd: 0.0001,
        symbol: "MOG",
        weight: 15,
    },
    {
        address: "0x0000000000000000000000000000000000000003",
        decimals: 18,
        name: "Book of Meme",
        price_usd: 0.00005,
        symbol: "BOME",
        weight: 10,
    },
    {
        address: "0x0000000000000000000000000000000000000004",
        decimals: 18,
        name: "Brett",
        price_usd: 0.00008,
        symbol: "BRETT",
        weight: 10,
    },
];
const SAMPLE_DESCRIPTION =
    "Heavier allocation to PEPE and WIF, with diversified exposure to POPCAT, MOG, BOME, and BRETT.";
const SAMPLE_REASONING =
    "This strategy is constructed by analyzing recent on-chain momentum, liquidity flows, and volatility clusters. The AI allocates capital toward assets with strong social traction and sustained trading depth while balancing exposure with secondary performers to optimize risk-adjusted returns.";

/**
 * AIArchitect 메인 컴포넌트
 * 
 * @returns AI 전략 생성 페이지 JSX
 */
export function AIArchitect () {
    // 상태 관리
    const [prompt, setPrompt] = useState(""); // 사용자 입력 프롬프트
    const [showPrompts, setShowPrompts] = useState(true); // 샘플 프롬프트 카드 표시 여부
    const [isLoading, setIsLoading] = useState(false); // 전략 생성 중 여부
    const [error, setError] = useState<string | null>(null); // 에러 메시지
    const navigate = useNavigate(); // 페이지 네비게이션 훅

    /**
     * 전략 생성 핸들러
     * 사용자 프롬프트를 기반으로 AI 전략을 생성하고 결과 페이지로 이동합니다.
     */
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
        // 메인 컨테이너: 전체 화면 높이, 배경색, 텍스트 색상 설정
        // bg-background: index.css의 --background 변수 사용 (HSL: 240 10% 3.9%, 다크 배경)
        // text-foreground: index.css의 --foreground 변수 사용 (HSL: 0 0% 98%, 밝은 텍스트)
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
            {/* 배경 파티클 효과: 시각적 깊이감을 위한 블러 처리된 원형 그라디언트 */}
            <div className="absolute inset-0 pointer-events-none">
                {/* 왼쪽 상단 당근 오렌지 그라디언트 효과 */}
                {/* bg-carrot-orange/20: carrot-orange 색상의 20% 투명도 (HSL: 26 65% 54% / 0.2) */}
                {/* blur-[120px]: 120px 블러 효과로 부드러운 그라디언트 생성 */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-carrot-orange/20 rounded-full blur-[120px]" />
                {/* 오른쪽 하단 파란색(정보) 그라디언트 효과 */}
                {/* bg-info/20: info 색상의 20% 투명도 (HSL: 210 100% 50% / 0.2) */}
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/20 rounded-full blur-[120px]" />
            </div>

            {/* 메인 콘텐츠 영역: 컨테이너 중앙 정렬, 패딩, z-index 설정 */}
            <div className="container mx-auto px-4 py-16 relative z-10 max-w-4xl">
                {/* Hero Section: 페이지 상단 주요 섹션 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 space-y-4"
                >
                    {/* 메인 제목: 그라디언트 텍스트 효과 */}
                    {/* text-transparent bg-clip-text: 텍스트를 투명하게 하고 배경을 클리핑하여 그라디언트 적용 */}
                    {/* bg-carrot-orange/80: 중간 색상 (당근 오렌지 80% 투명도) */}
                    
                    <h1 className="text-4xl md:text-5xl font-bold font-pixel tracking-tight text-transparent bg-clip-text bg-carrot-orange/80">
                        Create your own AI-powered trading strategy.
                    </h1>
                    {/* 설명 텍스트: 당근 오렌지 색상의 80% 투명도 */}
                    {/* text-carrot-orange/80: carrot-orange 색상의 80% 투명도 (HSL: 26 65% 54% / 0.8) */}
                    <p className="text-base md:text-lg text-carrot-orange/80 font-mono max-w-2xl mx-auto leading-relaxed">
                        Describe what you want. <br /> AI architect will build the strategy for you.
                    </p>
                </motion.div>

                {/* Main Prompt Input Box: 사용자 프롬프트 입력 영역 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-12"
                >
                    {/* 카드 컨테이너: 반투명 다크 배경 */}
                    {/* bg-card: index.css의 --card 변수 사용 (HSL: 240 10% 3.9%, 다크 배경) */}
                    {/* border border-border: 기본 테두리 색상 (HSL: 240 3.7% 15.9%, 어두운 테두리) */}
                    {/* focus-within:border-carrot-orange/50: 포커스 시 당근 오렌지 테두리 (50% 투명도) */}
                    {/* backdrop-blur-sm: 배경 블러 효과 */}
                    <div className="relative bg-card border border-border rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl focus-within:border-carrot-orange/50 transition-colors">
                        <div className="relative p-6">
                            {/* 텍스트 입력 영역 */}
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={`I want a short-term momentum strategy.\nCreate an on-chain inflow screening strategy.`}
                                // bg-background: 배경색 (HSL: 240 10% 3.9%, 다크 배경)
                                // text-foreground: 기본 텍스트 색상 (HSL: 0 0% 98%, 밝은 텍스트)
                                // placeholder:text-carrot-orange/50: placeholder 텍스트 색상 (당근 오렌지 50% 투명도)
                                // focus:outline-none: 기본 포커스 아웃라인 제거 (컨테이너의 테두리 색상으로 표시)
                                className="w-full bg-background text-foreground placeholder:text-carrot-orange/50 text-lg font-mono resize-none focus:outline-none min-h-[120px]"
                                rows={4}
                            />

                            {/* 하단 컨트롤 영역: 키보드 단축키 안내 및 생성 버튼 */}
                            {/* border-t border-white/5: 상단 테두리 (흰색 5% 투명도) */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                {/* 키보드 단축키 안내 */}
                                {/* text-carrot-orange/70: 당근 오렌지 색상의 70% 투명도 */}
                                {/* bg-white/5: 흰색 배경의 5% 투명도 (어두운 배경 위에 밝은 배경) */}
                                <div className="flex items-center gap-2 text-xs text-carrot-orange/70 font-mono">
                                    <kbd className="px-2 py-1 bg-white/5 rounded text-carrot-orange/70">⌘</kbd>
                                    <span>+</span>
                                    <kbd className="px-2 py-1 bg-white/5 rounded text-carrot-orange/70">Enter</kbd>
                                    <span>to generate</span>
                                </div>

                                {/* 생성 버튼: 그라디언트 배경 */}
                                {/* bg-carrot-orange: 시작 색상 (HSL: 26 65% 54%) */}
                                {/* text-carrot-orange-foreground: 버튼 텍스트 색상 (HSL: 0 0% 10%, 어두운 텍스트) */}
                                {/* hover:shadow-[0_0_25px_rgba(208,129,65,0.6)]: 호버 시 당근 오렌지 글로우 효과 (60% 투명도) */}
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading || !prompt.trim()}
                                    className="px-8 py-3 rounded-full bg-carrot-orange text-carrot-orange-foreground font-bold text-sm hover:shadow-[0_0_25px_rgba(208,129,65,0.6)] transition-all flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>{isLoading ? "Generating..." : "Generate Strategy"}</span>
                                    <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recommended Prompt Cards: 샘플 프롬프트 카드 섹션 */}
                {showPrompts && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mb-16"
                    >
                        {/* 섹션 제목: 당근 오렌지 색상 */}
                        {/* text-carrot-orange: carrot-orange 색상 (HSL: 26 65% 54%, RGB: rgb(208, 129, 65)) */}
                        <h2 className="text-sm font-bold text-carrot-orange uppercase tracking-widest mb-4 font-mono">
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
                                    // 카드 기본 스타일
                                    // bg-card: 카드 배경색 (HSL: 240 10% 3.9%, 다크 배경)
                                    // border-border: 기본 테두리 색상 (HSL: 240 3.7% 15.9%)
                                    // hover:border-carrot-orange/30: 호버 시 당근 오렌지 테두리 (30% 투명도)
                                    // hover:bg-card/80: 호버 시 카드 배경 80% 투명도
                                    // hover:shadow-[0_0_20px_rgba(208,129,65,0.15)]: 호버 시 당근 오렌지 글로우 효과 (15% 투명도)
                                    className="group relative p-5 bg-card border border-border rounded-xl hover:border-carrot-orange/30 hover:bg-card/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(208,129,65,0.15)] cursor-pointer"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* 아이콘 배경: 당근 오렌지 색상의 배경 */}
                                        {/* bg-carrot-orange/10: 당근 오렌지 배경 10% 투명도 */}
                                        {/* group-hover:bg-carrot-orange/20: 호버 시 20% 투명도로 증가 */}
                                        <div className="w-8 h-8 rounded-lg bg-carrot-orange/10 flex items-center justify-center shrink-0 group-hover:bg-carrot-orange/20 transition-colors">
                                            {/* text-carrot-orange: 아이콘 색상 (HSL: 26 65% 54%) */}
                                            <Zap className="w-4 h-4 text-carrot-orange" />
                                        </div>
                                        {/* 프롬프트 텍스트 */}
                                        {/* text-gray-foreground: 기본 텍스트 색상 (HSL: 0 0% 98%, 밝은 텍스트) */}
                                        {/* group-hover:text-white: 호버 시 흰색으로 변경 */}
                                        <p className="text-sm text-gray-foreground font-mono leading-relaxed group-hover:text-white transition-colors">
                                            {samplePrompt}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Error message: 에러 발생 시 표시되는 메시지 */}
                {error && (
                    // text-error: index.css의 --error 변수 사용 (HSL: 0 84% 60%, 빨간색)
                    <div className="mb-6 text-center text-xs text-error font-mono">
                        {error}
                    </div>
                )}

                {/* Example Output Format: 샘플 전략 결과 카드 섹션 */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-16"
                >
                    {/* 섹션 제목: 당근 오렌지 색상 */}
                    {/* text-carrot-orange: carrot-orange 색상 (HSL: 26 65% 54%) */}
                    <h2 className="text-sm font-bold text-carrot-orange uppercase tracking-widest mb-4 font-mono">
                        How AI Generates a Strategy
                    </h2>
                    {/* StrategyResultCard 컴포넌트: 샘플 전략 결과를 카드 형태로 표시 */}
                    {/* 이 컴포넌트 내부에서도 carrot-orange 색상을 사용합니다 */}
                    <StrategyResultCard
                        variant="sample"
                        description={SAMPLE_DESCRIPTION}
                        reasoning={SAMPLE_REASONING}
                        tokens={SAMPLE_TOKENS}
                    />
                </motion.div>

                {/* Disclaimer: 면책 조항 섹션 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-center"
                >
                    {/* text-gray: index.css의 --gray 변수 사용 (HSL: 240 3.7% 15.9%, 어두운 회색) */}
                    <p className="text-xs text-white font-mono">
                        AI strategies are generated for educational use only. Past performance does not guarantee future results.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
