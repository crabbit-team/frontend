import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export interface CardWithFrameProps {
    /** 프레임 이미지 경로 (public/card/frame/) */
    frameImage: string;
    /** 배경 이미지 경로 (public/card/background/) */
    backgroundImage: string;
    /** 카드에 표시할 텍스트 */
    text: string;
    /** 카드 크기: 'large' (중앙, w-72 h-[410px]) 또는 'small' (좌우, w-64 h-[365px]) */
    size?: "large" | "small";
    /** 카드 클릭 핸들러 */
    onClick?: () => void;
    /** 애니메이션 지연 시간 (초) */
    animationDelay?: number;
    /** 중앙 카드 여부 (상하 애니메이션 적용) */
    isCenter?: boolean;
    /** 텍스트 스타일 클래스 */
    textClassName?: string;
    /** 컨테이너 스타일 클래스 */
    containerClassName?: string;
}

/**
 * CardWithFrame 컴포넌트
 * 
 * 프레임, 배경, 텍스트를 레이어로 구성한 재사용 가능한 카드 컴포넌트입니다.
 * 
 * 레이어 구조 (하단 → 상단):
 * 1. 프레임 이미지 (z-0)
 * 2. 배경 이미지 (z-10)
 * 3. 텍스트 (z-20)
 * 
 * @param frameImage - 프레임 이미지 경로
 * @param backgroundImage - 배경 이미지 경로
 * @param text - 표시할 텍스트
 * @param size - 카드 크기 ('large' | 'small')
 * @param onClick - 클릭 핸들러
 * @param animationDelay - 애니메이션 지연 시간
 * @param isCenter - 중앙 카드 여부
 * @param textClassName - 텍스트 추가 스타일 클래스
 * @param containerClassName - 컨테이너 추가 스타일 클래스
 */
export function CardWithFrame({
    frameImage,
    backgroundImage,
    text,
    size = "small",
    onClick,
    animationDelay = 0,
    isCenter = false,
    textClassName,
    containerClassName,
}: CardWithFrameProps) {
    const isLarge = size === "large";

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: animationDelay, ease: "easeOut" }}
            className={cn(
                "relative group cursor-pointer",
                isCenter ? "z-20 -mb-8" : "z-10",
                containerClassName
            )}
            onClick={onClick}
        >
            <motion.div
                animate={isCenter ? { y: [-4, 4, -4] } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                    "relative transition-all duration-300 flex items-center justify-center",
                    isLarge ? "w-72 h-[410px]" : "w-64 h-[365px]"
                )}
            >
                {/* 1. 프레임 이미지: 가장 아래 레이어 (z-0) */}
                <img
                    src={frameImage}
                    alt="Card Frame"
                    className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
                />

                {/* 2. 배경 이미지: 중간 레이어 (z-10), 프레임 중앙 영역에 맞춰 배치 (양쪽 패딩 적용, 위로 조정) */}
                <div
                    className="absolute inset-y-5 inset-x-7 z-10"
                    style={{
                        backgroundImage: `url('${backgroundImage}')`,
                        backgroundSize: "contain",
                        backgroundPosition: "center 30%",
                        backgroundRepeat: "no-repeat",
                    }}
                />

                {/* 3. 텍스트: 맨 위 레이어 (z-20) */}
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <h3
                        className={cn(
                            "font-pixel font-bold text-center px-4",
                            isLarge ? "text-2xl text-foreground" : "text-xl text-foreground",
                            textClassName
                        )}
                    >
                        {text}
                    </h3>
                </div>
            </motion.div>
        </motion.div>
    );
}

