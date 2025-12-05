/**
 * Rank 페이지 컴포넌트
 * 
 * 전략 랭킹을 표시하는 페이지입니다.
 * - 상위 3개 전략을 카드 형태로 강조 표시
 * - 전체 전략 목록을 테이블 형태로 표시
 * - 각 전략 클릭 시 상세 페이지로 이동
 */

import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { MOCK_VAULTS } from "../lib/mockData";

/**
 * Rank 메인 컴포넌트
 * @returns 전략 랭킹 페이지 JSX
 */
export function Rank() {
    // 페이지 네비게이션을 위한 훅
    const navigate = useNavigate();

    return (
        // 메인 컨테이너: 전체 화면 높이, 배경색, 텍스트 색상 설정
        <div className="min-h-screen bg-background text-foreground font-tech overflow-hidden relative">
            {/* 배경 파티클 효과: 시각적 깊이감을 위한 블러 처리된 원형 그라디언트 */}
            <div className="absolute inset-0 pointer-events-none">
                {/* 왼쪽 상단 당근 오렌지 그라디언트 효과 */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-carrot-orange/20 rounded-full blur-[120px] border-glow" />
                {/* 오른쪽 하단 파란색(정보) 그라디언트 효과 */}
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/20 rounded-full blur-[120px]" />
            </div>

            {/* 메인 콘텐츠 영역: 컨테이너 중앙 정렬, 패딩, z-index 설정 */}
            <div className="container mx-auto px-4 py-12 relative z-10">
                {/* 1. 페이지 제목 섹션 */}
                <div className="mb-16 space-y-2">
                    {/* 메인 제목: 그라디언트 텍스트 효과 (흰색 → 당근 오렌지) */}
                    <h1 className="text-4xl md:text-5xl font-bold font-pixel tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-carrot-orange">
                        Strategy Rank
                    </h1>
                    {/* 설명 텍스트: 랭킹 생성 기준 및 업데이트 주기 안내 */}
                    <p className="text-muted-foreground font-mono text-sm tracking-wider">
                        Rank is generated from the strategy owner's historical average ROI. <br />
                        Updated every 24 hours.
                    </p>
                </div>

                {/* 2. 상위 3개 전략 쇼케이스 (중앙 하이라이트) */}
                <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-20 min-h-[200px]">
                    {/* 즉시 실행 함수: 상위 3개 전략을 추출하고 순서 재배치 */}
                    {(() => {
                        // MOCK_VAULTS에서 상위 3개만 추출
                        const top3 = MOCK_VAULTS.slice(0, 3);
                        // 3개 미만이면 렌더링하지 않음
                        if (top3.length < 3) return null;

                        // 포디움 형태로 배치하기 위한 순서 재배치
                        // 1위는 중앙, 2위는 왼쪽, 3위는 오른쪽
                        const spotlight = [
                            { vault: top3[1], rank: 2, position: "left" as const, delay: 0.3 },   // 2위: 왼쪽, 애니메이션 지연 0.3초
                            { vault: top3[0], rank: 1, position: "center" as const, delay: 0.2 }, // 1위: 중앙, 애니메이션 지연 0.2초
                            { vault: top3[2], rank: 3, position: "right" as const, delay: 0.4 },  // 3위: 오른쪽, 애니메이션 지연 0.4초
                        ];

                        // 각 전략을 RankingCard 컴포넌트로 렌더링
                        return spotlight.map(({ vault, rank, position, delay }) => (
                            <RankingCard
                                key={vault.id}
                                user={{
                                    id: vault.id,
                                    rank,
                                    vaultName: vault.name,
                                    owner: vault.manager,
                                    // APY를 기반으로 ROI 계산 (APY * 1000 = 대략적인 ROI USD)
                                    roiUsd: `+$${(vault.apy * 1000).toFixed(0)}`,
                                    // TVL을 천 단위로 포맷팅
                                    tvl: `$${vault.tvl.toLocaleString()}`,
                                    // 전략 이름의 첫 글자를 아바타로 사용
                                    avatar: vault.name.charAt(0).toUpperCase(),
                                }}
                                position={position}
                                delay={delay}
                            />
                        ));
                    })()}
                </div>

                {/* 3. 전체 랭킹 테이블 */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
                    {/* 테이블 헤더: 12열 그리드 시스템 사용 */}
                    <div className="grid grid-cols-12 gap-4 p-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                        <div className="col-span-1">Rank</div>              {/* 1열: 순위 */}
                        <div className="col-span-5">Strategy</div>           {/* 5열: 전략 이름 */}
                        <div className="col-span-2 text-right">ROI (USD)</div> {/* 2열: ROI (우측 정렬) */}
                        <div className="col-span-2 text-right">TVL</div>     {/* 2열: TVL (우측 정렬) */}
                        <div className="col-span-2 text-right">Deposit</div> {/* 2열: 예금 (우측 정렬) */}
                    </div>

                    {/* 테이블 바디: 모든 전략을 행으로 표시 */}
                    <div className="divide-y divide-border">
                        {MOCK_VAULTS.map((vault, index) => {
                            // 인덱스 기반 순위 계산 (0부터 시작하므로 +1)
                            const rank = index + 1;
                            // APY를 기반으로 ROI USD 계산 및 포맷팅
                            const roiUsd = (vault.apy * 1000).toFixed(0);
                            // TVL을 천 단위 구분자로 포맷팅
                            const tvlLabel = `$${vault.tvl.toLocaleString()}`;

                            return (
                                // 각 전략 행: 클릭 시 상세 페이지로 이동
                                <div
                                    key={vault.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center hover:bg-secondary/50 cursor-pointer transition-colors"
                                    onClick={() => navigate(`/vaults/${vault.id}`)}
                                >
                                    {/* 순위 표시 */}
                                    <div className="col-span-1 font-mono text-muted-foreground">
                                        #{rank}
                                    </div>
                                    {/* 전략 정보: 이름과 소유자 */}
                                    <div className="col-span-5">
                                        <div className="font-mono text-foreground">{vault.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            by {vault.manager}
                                        </div>
                                    </div>
                                    {/* ROI: 성공 색상(녹색)으로 표시 */}
                                    <div className="col-span-2 text-right font-mono text-success">
                                        +${roiUsd}
                                    </div>
                                    {/* TVL: 기본 텍스트 색상으로 표시 */}
                                    <div className="col-span-2 text-right font-mono text-foreground/80">
                                        {tvlLabel}
                                    </div>
                                    {/* 예금: 아직 구현되지 않음 (대시 표시) */}
                                    <div className="col-span-2 text-right font-mono text-muted-foreground">
                                        —
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * RankingCard 컴포넌트
 * 
 * 상위 3개 전략을 카드 형태로 표시하는 컴포넌트입니다.
 * - 1위는 중앙에 크게 표시되고 부드러운 상하 애니메이션 효과
 * - 2위, 3위는 좌우에 작게 표시
 * - 카드 클릭 시 해당 전략의 상세 페이지로 이동
 * 
 * @param user - 전략 정보 객체 (id, rank, vaultName, owner, roiUsd, tvl, avatar)
 * @param position - 카드 위치 ('left' | 'center' | 'right')
 * @param delay - 애니메이션 시작 지연 시간 (초)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RankingCard({ user, position, delay }: { user: any, position: 'left' | 'center' | 'right', delay: number }) {
    // 중앙 카드(1위) 여부 확인
    const isCenter = position === 'center';
    // 페이지 네비게이션 훅
    const navigate = useNavigate();

    return (
        // 외부 컨테이너: Framer Motion 애니메이션 적용
        <motion.div
            // 초기 상태: 투명, 아래쪽 50px, 90% 크기
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            // 애니메이션 후 상태: 완전 불투명, 원래 위치, 100% 크기
            animate={{ opacity: 1, y: 0, scale: 1 }}
            // 애니메이션 설정: 0.6초 지속, 지연 시간 적용, easeOut 이징
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={cn(
                "relative group cursor-pointer",
                // 중앙 카드는 더 높은 z-index와 음수 마진으로 강조
                isCenter ? "z-20 -mb-8" : "z-10"
            )}
            // 카드 클릭 시 전략 상세 페이지로 이동
            onClick={() => navigate(`/vaults/${user.id}`)}
        >
            {/* 카드 본체: 내부 애니메이션 및 스타일 적용 */}
            <motion.div
                // 중앙 카드만 상하 부드러운 움직임 애니메이션 (무한 반복)
                animate={isCenter ? { y: [-4, 4, -4] } : {}}
                // 애니메이션 설정: 4초 주기, 무한 반복, easeInOut 이징
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                    "relative overflow-hidden rounded-2xl border transition-all duration-300",
                    // 카드 배경: 카드 색상에서 배경 색상으로 그라디언트
                    "bg-gradient-to-b from-card to-background",
                    // 중앙 카드 스타일: 더 큰 크기, 경고 색상 테두리, 글로우 효과
                    isCenter
                        ? "w-72 h-96 border-warning/50 shadow-[0_0_50px_rgba(234,179,8,0.2)]"
                        // 좌우 카드 스타일: 작은 크기, 기본 테두리, 호버 시 carrot-orange 색상 테두리
                        : "w-64 h-80 border-border shadow-xl hover:border-carrot-orange/30"
                )}
            >
                {/* 카드 글로우 효과: 호버 시 carrot-orange 색상의 그라디언트 오버레이 */}
                <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                    // 투명 → carrot-orange/5 → carrot-orange/10 그라디언트
                    "bg-gradient-to-b from-transparent via-carrot-orange/5 to-carrot-orange/10"
                )} />

                {/* 순위 배지: 카드 왼쪽 상단에 표시 */}
                <div className="absolute top-4 left-4">
                    <div className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-lg font-pixel text-lg shadow-lg",
                        // 중앙 카드: 경고 색상 배경
                        isCenter ? "bg-warning text-warning-foreground" 
                        // 좌우 카드: 보조 색상 배경, 테두리 적용
                        : "bg-secondary text-foreground border border-border"
                    )}>
                        #{user.rank}
                    </div>
                </div>

                {/* 아바타 및 전략 정보: 카드 중앙에 표시 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
                    {/* 아바타 원형: 전략 이름의 첫 글자 표시 */}
                    <div className={cn(
                        "rounded-full flex items-center justify-center border-4 shadow-2xl",
                        // 중앙 카드: 큰 크기, 경고 색상 테두리 및 배경
                        isCenter ? "w-32 h-32 border-warning/30 bg-warning/10 text-6xl" 
                        // 좌우 카드: 작은 크기, 기본 테두리 및 배경
                        : "w-24 h-24 border-border bg-secondary text-4xl"
                    )}>
                        {user.avatar}
                    </div>
                    {/* 전략 이름 및 소유자 정보 */}
                    <div className="text-center space-y-1">
                        {/* 전략 이름: 중앙 카드는 더 큰 텍스트 */}
                        <h3 className={cn("font-bold tracking-tight", isCenter ? "text-2xl text-foreground" : "text-xl text-foreground/80")}>
                            {user.vaultName}
                        </h3>
                        {/* 소유자 이름: 작은 텍스트, muted 색상 */}
                        <p className="text-xs text-muted-foreground font-mono">{user.owner}</p>
                    </div>
                </div>

                {/* 통계 푸터: 카드 하단에 ROI와 TVL 표시 */}
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-between items-end">
                        {/* ROI (수익률) 섹션 */}
                        <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ROI (USD)</div>
                            {/* 중앙 카드는 더 큰 텍스트, 좌우 카드는 작은 텍스트 */}
                            <div className={cn("font-mono font-bold", isCenter ? "text-xl text-success" : "text-lg text-success/80")}>
                                {user.roiUsd}
                            </div>
                        </div>
                        {/* TVL (총 예치 가치) 섹션 */}
                        <div className="text-right">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">TVL</div>
                            <div className="font-mono font-bold text-foreground">{user.tvl}</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
