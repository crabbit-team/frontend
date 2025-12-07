import { BASE_URL } from ".";

/**
 * 전략 생성 요청
 */
export interface StrategyGenerateRequest {
    /** 사용자가 입력한 프롬프트 (전략 생성 지시) */
    prompt: string;
}

/**
 * 전략 생성 응답
 * AI가 생성한 밈코인 포트폴리오 전략 정보
 */
export interface StrategyGenerateResponse {
    /** 전략 이름 */
    name: string;
    /** 전략 심볼 */
    symbol: string;
    /** 전략 설명 */
    description: string;
    /** 전략 생성 근거 및 추론 과정 */
    reasoning: string;
    /** 포함된 토큰 목록 */
    tokens: StrategyToken[];
}

/**
 * 전략에 포함된 토큰 정보
 */
export interface StrategyToken {
    /** 토큰 컨트랙트 주소 */
    address: string;
    /** 토큰 소수점 자릿수 */
    decimals: number;
    /** 토큰 이름 */
    name: string;
    /** USD 가격 */
    price_usd: number;
    /** 토큰 심볼 */
    symbol: string;
    /** 포트폴리오 내 가중치 (%) */
    weight: number;
}

/**
 * POST /api/strategy/generate
 *
 * AI를 사용하여 밈코인 포트폴리오 전략을 생성합니다.
 * 사용자의 프롬프트를 기반으로 토큰 선택 및 가중치를 자동으로 계산합니다.
 * 
 * @param prompt - 전략 생성에 대한 사용자 프롬프트
 * @returns 생성된 전략 정보 (설명, 추론, 토큰 목록, 가중치)
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function generateStrategy(
    prompt: string
): Promise<StrategyGenerateResponse> {
    const body: StrategyGenerateRequest = { prompt };

    const res = await fetch(`${BASE_URL}/api/strategy/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        let message = `Failed to generate strategy (status ${res.status})`;
        try {
            const data = await res.json();
            // FastAPI-style error detail can be string or array
            if (data && typeof data.detail === "string") {
                message = data.detail;
            }
        } catch {
            // ignore JSON parse errors, keep default message
        }
        throw new Error(message);
    }

    const data = (await res.json()) as StrategyGenerateResponse;
    return data;
}





