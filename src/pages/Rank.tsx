/**
 * Rank 페이지 컴포넌트
 * 
 * 전략 랭킹을 표시하는 페이지입니다.
 * - 상위 3개 전략을 카드 형태로 강조 표시
 * - 전체 전략 목록을 테이블 형태로 표시
 * - 각 전략 클릭 시 상세 페이지로 이동
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getVaults, type VaultSummary, type VaultCreator } from "../api/vault";
import { CardWithFrame } from "../components/common/CardWithFrame";
import { CreatorModal } from "../components/common/CreatorModal";
import { TierBadge } from "../components/common/TierBadge";


/**
 * Rank 메인 컴포넌트
 * @returns 전략 랭킹 페이지 JSX
 */
export function Rank() {
    // 페이지 네비게이션을 위한 훅
    const navigate = useNavigate();
    const [vaults, setVaults] = useState<VaultSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [creatorModalOpen, setCreatorModalOpen] = useState(false);
    const [selectedCreator, setSelectedCreator] = useState<VaultCreator | null>(null);
    const [selectedVaultName, setSelectedVaultName] = useState<string | null>(null);

    // API에서 볼트 목록 가져오기
    useEffect(() => {
        async function fetchVaults() {
            try {
                setIsLoading(true);
                const response = await getVaults();
                
                // APY 기준으로 정렬 (내림차순)
                const sortedVaults = [...response.vaults].sort((a, b) => {
                    const apyA = a.performance?.apy ?? 0;
                    const apyB = b.performance?.apy ?? 0;
                    return apyB - apyA;
                });
                
                setVaults(sortedVaults);
            } catch (error) {
                console.error("Failed to fetch vaults:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchVaults();
    }, []);

    // Deposit 버튼 클릭 핸들러 - VaultDetail로 이동
    const handleDepositClick = (e: React.MouseEvent, vault: VaultSummary) => {
        e.stopPropagation(); // 행 클릭 이벤트 방지
        navigate(`/vaults/${vault.address}`);
    };

    // Creator 클릭 핸들러
    const handleCreatorClick = (e: React.MouseEvent, creator: VaultCreator, vaultName: string) => {
        e.stopPropagation(); // 행 클릭 이벤트 방지
        setSelectedCreator(creator);
        setSelectedVaultName(vaultName);
        setCreatorModalOpen(true);
    };

    return (
        // 메인 컨테이너: 전체 화면 높이, 배경색, 텍스트 색상 설정
        <div className="min-h-screen bg-background text-foreground font-tech overflow-hidden relative">
            {/* 배경 파티클 효과: 시각적 깊이감을 위한 블러 처리된 원형 그라디언트 */}
            <div className="absolute inset-0 pointer-events-none">
                {/* 왼쪽 상단 당근 오렌지 그라디언트 효과 */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-carrot-orange/20 rounded-full blur-[120px] border-glow" />
                {/* 오른쪽 하단 파란색(정보) 그라디언트 효과 */}
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-carrot-green/20 rounded-full blur-[120px]" />
            </div>

            {/* 메인 콘텐츠 영역: 컨테이너 중앙 정렬, 패딩, z-index 설정 */}
            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* 1. 페이지 제목 섹션 */}
                <div className="mb-16 space-y-2">
                    {/* 메인 제목: 그라디언트 텍스트 효과 (흰색 → 당근 오렌지) */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl md:text-5xl font-bold font-pixel tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-carrot-orange">
                            Strategy Rank
                        </h1>
                    </div>
                    {/* 설명 텍스트: 랭킹 생성 기준 및 업데이트 주기 안내 */}
                    <p className="text-muted-foreground font-mono text-sm tracking-wider">
                        Rank is generated from the strategy owner's historical average ROI. <br />
                        Updated every 24 hours.
                    </p>
                </div>

                {/* 2. 상위 3개 전략 쇼케이스 (중앙 하이라이트) */}
                {!isLoading && vaults.length > 0 && (
                    <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-20 min-h-[200px]">
                        {/* 2위 (left), 1위 (center), 3위 (right) 순서로 배치 */}
                        {vaults.length >= 2 && (
                            <RankingCard
                                key={vaults[1].address}
                                vault={vaults[1]}
                                rank={2}
                                position="left"
                                delay={0}
                            />
                        )}
                        {vaults.length >= 1 && (
                            <RankingCard
                                key={vaults[0].address}
                                vault={vaults[0]}
                                rank={1}
                                position="center"
                                delay={0.1}
                            />
                        )}
                        {vaults.length >= 3 && (
                            <RankingCard
                                key={vaults[2].address}
                                vault={vaults[2]}
                                rank={3}
                                position="right"
                                delay={0.2}
                            />
                        )}
                    </div>
                )}

                {/* 3. 전체 랭킹 테이블 */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
                    {/* 테이블 헤더 */}
                    <div className="grid grid-cols-[60px_1fr_80px_100px_100px_100px_80px_120px_100px] gap-4 p-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                        <div>Rank</div>
                        <div>Strategy</div>
                        <div className="text-center">Creator</div>
                        <div className="text-right">APY</div>
                        <div className="text-right">24h</div>
                        <div className="text-right">TVL</div>
                        <div className="text-center">Tier</div>
                        <div className="text-center">Deposit</div>
                        <div className="text-center">History</div>
                    </div>

                    {/* 테이블 바디 */}
                    {isLoading ? (
                        <div className="p-6 text-center text-muted-foreground">Loading...</div>
                    ) : vaults.length === 0 ? (
                        <div className="p-6 text-center text-muted-foreground font-mono">No strategy available</div>
                    ) : (
                        <div className="divide-y divide-border">
                            {vaults.map((vault, index) => {
                                const rank = index + 1;
                                const apy = vault.performance?.apy ?? 0;
                                const change24h = vault.performance?.change_24h ?? 0;
                                // TVL: "00000.00" 형식의 문자열로 오므로 파싱해서 표시
                                const tvlValue = parseFloat(vault.tvl);
                                const tvlLabel = `$${tvlValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                const tier = vault.tier;
                                const creatorImage = vault.creator?.image_url;
                                const creator = vault.creator;

                                return (
                                    <div
                                        key={vault.address}
                                        className="grid grid-cols-[60px_1fr_80px_100px_100px_100px_80px_120px_100px] gap-4 px-6 py-4 text-sm items-center hover:bg-secondary/50 transition-colors"
                                        onClick={() => navigate(`/vaults/${vault.address}`)}
                                    >
                                        {/* Rank */}
                                        <div className="font-mono text-muted-foreground">
                                            #{rank}
                                        </div>

                                        {/* Strategy: image(좌) & name/symbol(우) */}
                                        <div className="flex items-center gap-2">
                                            {/* Vault Profile Image */}
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-carrot-orange/10 flex items-center justify-center flex-shrink-0">
                                                {vault.image_url && vault.image_url.trim() ? (
                                                    <img
                                                        src={vault.image_url}
                                                        alt={vault.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-carrot-orange text-[10px] font-mono">
                                                        ?
                                                    </span>
                                                )}
                                            </div>
                                            {/* Name & Symbol */}
                                            <div>
                                                <div className="font-mono text-foreground">{vault.name}</div>
                                                <div className="text-xs text-muted-foreground">{vault.symbol}</div>
                                            </div>
                                        </div>

                                        {/* Creator image & nickname (클릭하면 모달 열기) */}
                                        <div className="flex items-center justify-center gap-2">
                                            {creator && (
                                                <button
                                                    onClick={(e) => handleCreatorClick(e, creator, vault.name)}
                                                    className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                                                >
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-carrot-orange/10 flex items-center justify-center hover:ring-2 hover:ring-carrot-orange/50 transition-all flex-shrink-0">
                                                        {creatorImage && creatorImage.trim() ? (
                                                            <img
                                                                src={creatorImage}
                                                                alt={creator.nickname || "Creator"}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-carrot-orange text-[10px] font-mono">
                                                                ?
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-mono text-foreground truncate max-w-[60px]">
                                                        {creator.nickname?.trim() || vault.name.slice(0, 3)}
                                                    </span>
                                                </button>
                                            )}
                                        </div>

                                        {/* APY */}
                                        <div className="text-right font-mono text-success">
                                            {apy.toFixed(2)}%
                                        </div>

                                        {/* 24h Change */}
                                        <div className={`text-right font-mono ${change24h >= 0 ? "text-success" : "text-error"}`}>
                                            {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}%
                                        </div>

                                        {/* TVL */}
                                        <div className="text-right font-mono text-foreground/80">
                                            {tvlLabel}
                                        </div>

                                        {/* Tier */}
                                        <div className="text-center">
                                            <TierBadge tier={tier} />
                                        </div>

                                        {/* Deposit Button */}
                                        <div className="text-center">
                                            <button
                                                onClick={(e) => handleDepositClick(e, vault)}
                                                className="px-3 py-1.5 bg-carrot-orange text-carrot-orange-foreground hover:bg-carrot-orange/90 rounded-md text-xs font-mono font-medium transition-colors"
                                            >
                                                Deposit
                                            </button>
                                        </div>

                                        {/* History Button */}
                                        <div className="text-center">
                                            {vault.explorer_url && vault.explorer_url.trim() ? (
                                                <a
                                                    href={vault.explorer_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary text-foreground hover:bg-secondary/80 rounded-md text-xs font-mono font-medium transition-colors"
                                                >
                                                    <span>View</span>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <span className="text-xs text-muted-foreground font-mono">-</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Creator Modal */}
                {selectedCreator && (
                    <CreatorModal
                        isOpen={creatorModalOpen}
                        onClose={() => {
                            setCreatorModalOpen(false);
                            setSelectedCreator(null);
                            setSelectedVaultName(null);
                        }}
                        creator={selectedCreator}
                        vaultName={selectedVaultName || undefined}
                    />
                )}
            </div>
        </div>
    );
}

/**
 * TVL 값을 축약된 형식으로 포맷팅
 */
function formatTVL(tvl: string): string {
    const tvlValue = parseFloat(tvl);
    if (tvlValue >= 1_000_000_000) {
        return `$${(tvlValue / 1_000_000_000).toFixed(1)}B`;
    }
    if (tvlValue >= 1_000_000) {
        return `$${(tvlValue / 1_000_000).toFixed(1)}M`;
    }
    if (tvlValue >= 1_000) {
        return `$${(tvlValue / 1_000).toFixed(1)}K`;
    }
    return `$${tvlValue.toLocaleString()}`;
}

/**
 * RankingCard 컴포넌트
 * 
 * 상위 3개 전략을 카드 형태로 표시하는 컴포넌트입니다.
 * 
 * @param vault - 전략 정보 객체 (VaultSummary)
 * @param rank - 순위 (1, 2, 3)
 * @param position - 카드 위치 ('left' | 'center' | 'right')
 * @param delay - 애니메이션 시작 지연 시간 (초)
 */
function RankingCard({ 
    vault, 
    rank,
    position, 
    delay 
}: { 
    vault: VaultSummary; 
    rank: number; 
    position: 'left' | 'center' | 'right'; 
    delay: number;
}) {
    const isCenter = position === 'center';
    const navigate = useNavigate();
    
    // Rank에 따른 프레임 이미지 선택
    const frameImage = 
        rank === 1 ? "/card/frame/cardFrameGold.png"
        : rank === 2 ? "/card/frame/cardFrameSilver.png"
        : "/card/frame/cardFrameBronze.png";
    
    // 배경 이미지: vault.image_url 사용
    const backgroundImage = vault.image_url || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800";
    
    // ROI (APY)
    const roi = vault.performance?.apy ?? 0;
    
    // TVL
    const tvlFormatted = formatTVL(vault.tvl);

    return (
        <CardWithFrame
            frameImage={frameImage}
            backgroundImage={backgroundImage}
            size={isCenter ? "large" : "small"}
            onClick={() => navigate(`/vaults/${vault.address}`)}
            animationDelay={delay}
            isCenter={isCenter}
            backgroundSize="cover"
        >
            {/* 텍스트 레이어: 하단에 정보 표시 */}
            <div className="absolute bottom-8 left-0 right-0 z-20 px-6">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 space-y-2 border border-white/10">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-mono uppercase">Ticker</span>
                        <span className="text-sm font-bold font-pixel text-white">{vault.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-mono uppercase">Rank</span>
                        <span className="text-sm font-bold font-pixel text-white">#{rank}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-mono uppercase">ROI</span>
                        <span className="text-sm font-bold font-pixel text-success">
                            {roi >= 0 ? "+" : ""}{roi.toFixed(2)}%
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-mono uppercase">TVL</span>
                        <span className="text-sm font-bold font-pixel text-white">{tvlFormatted} USDC</span>
                    </div>
                </div>
            </div>
        </CardWithFrame>
    );
}
