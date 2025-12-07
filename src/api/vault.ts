import { BASE_URL } from ".";

// NOTE:
// - API 레벨(백엔드, 타입, 함수명)에서는 일관되게 "vault" 용어를 사용한다.
// - 화면(UI)에서만 "Strategy" 라는 이름으로 노출한다.

/**
 * 볼트(전략) 생성자 정보
 */
export interface VaultCreator {
  /** 생성자 지갑 주소 */
  address: string;
  /** 생성자 닉네임 */
  nickname: string;
  /** 생성자 프로필 이미지 URL */
  image_url: string;
  /** Memex 링크 */
  memex_link: string;
}

/**
 * 볼트(전략) 성과 정보
 */
export interface VaultPerformance {
  /** 연간 수익률 (APY, %) */
  apy: number;
  /** 24시간 수익률 변화 (%) */
  change_24h: number;
}

/**
 * 볼트(전략) 포트폴리오 항목
 */
export interface VaultPortfolioItem {
  /** 토큰 주소 */
  address: string;
  /** 가중치 (%) */
  weight: number;
  /** 수량 */
  amount: string;
}

/**
 * 볼트(전략) 상세 정보
 * 상세 조회용 타입 (랭크/디테일 화면 등에서 사용)
 */
export interface VaultDetail {
  /** 볼트 컨트랙트 주소 */
  address: string;
  /** 볼트 이름 */
  name: string;
  /** 볼트 심볼 */
  symbol: string;
  /** 볼트 설명 */
  description: string;
  /** 볼트 이미지 URL */
  image_url: string;
  /** 생성자 정보 */
  creator: VaultCreator;
  /** 총 예치 가치 (TVL, USD) - "00000.00" 형식의 문자열 */
  tvl: string;
  /** 주식 가격 */
  share_price: string;
  /** 주식 가격 소수점 자릿수 */
  share_price_decimals: number;
  /** 성과 정보 */
  performance: VaultPerformance;
  /** 티어 */
  tier: string;
  /** 포트폴리오 구성 (토큰 주소, 가중치, 수량) */
  portfolio: VaultPortfolioItem[];
  /** 전략 상세 설명 */
  strategy_description: string;
  /** 블록 익스플로러 URL */
  explorer_url: string;
}

/**
 * 볼트(전략) 요약 정보
 * 리스트 조회용 타입 (랭킹 등에서 사용)
 */
export interface VaultSummary {
  /** 볼트 컨트랙트 주소 */
  address: string;
  /** 볼트 이름 */
  name: string;
  /** 볼트 심볼 */
  symbol: string;
  /** 볼트 이미지 URL */
  image_url: string;
  /** 생성자 정보 */
  creator: VaultCreator;
  /** 총 예치 가치 (TVL, USD) - "00000.00" 형식의 문자열 */
  tvl: string;
  /** 주식 가격 */
  share_price: string;
  /** 주식 가격 소수점 자릿수 */
  share_price_decimals: number;
  /** 성과 정보 */
  performance: VaultPerformance;
  /** 티어 */
  tier: string;
  /** 블록 익스플로러 URL */
  explorer_url: string;
}

/**
 * 볼트(전략) 목록 응답
 */
export interface VaultListResponse {
  /** 볼트 요약 정보 목록 */
  vaults: VaultSummary[];
  /** 전체 볼트 개수 */
  total: number;
}

/**
 * GET /api/vaults/{address}
 *
 * 볼트(전략) 주소로 상세 정보를 조회합니다.
 * 
 * @param address - 조회할 볼트 컨트랙트 주소
 * @returns 볼트 상세 정보
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function getVaultByAddress(address: string): Promise<VaultDetail> {
  const res = await fetch(
    `${BASE_URL}/api/vaults/${encodeURIComponent(address)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    let message = `Failed to fetch vault (status ${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  const raw = (await res.json()) as {
    address: string;
    name: string;
    symbol: string;
    description: string;
    image_url: string;
    creator: VaultCreator;
    tvl: string;
    share_price: string;
    share_price_decimals: number;
    performance: VaultPerformance;
    tier: string;
    portfolio: Array<{
      address: string;
      weight: number;
      amount: string;
    }>;
    strategy_description: string;
    explorer_url: string;
  };

  const data: VaultDetail = {
    address: raw.address,
    name: raw.name,
    symbol: raw.symbol,
    description: raw.description,
    image_url: raw.image_url,
    creator: raw.creator,
    tvl: raw.tvl,
    share_price: raw.share_price,
    share_price_decimals: raw.share_price_decimals,
    performance: raw.performance,
    tier: raw.tier,
    portfolio: raw.portfolio,
    strategy_description: raw.strategy_description,
    explorer_url: raw.explorer_url,
  };

  return data;
}

/**
 * GET /api/vaults
 *
 * 모든 볼트(전략) 목록을 조회하거나, 선택적으로 생성자로 필터링합니다.
 * 
 * @param creator - 필터링할 생성자 지갑 주소 (선택적, 없으면 전체 조회)
 * @returns 볼트 목록과 전체 개수
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function getVaults(
  creator?: string | null,
): Promise<VaultListResponse> {
  const url = new URL(`${BASE_URL}/api/vaults`);
  if (creator) {
    url.searchParams.set("creator", creator);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let message = `Failed to fetch vaults (status ${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  const raw = (await res.json()) as {
    vaults: Array<{
      address: string;
      name: string;
      symbol: string;
      image_url: string;
      creator: VaultCreator;
      tvl: string;
      share_price: string;
      share_price_decimals: number;
      performance: VaultPerformance;
      tier: string;
      explorer_url: string;
    }>;
    total: number;
  };

  const vaults: VaultSummary[] = raw.vaults.map((v) => ({
    address: v.address,
    name: v.name,
    symbol: v.symbol,
    image_url: v.image_url,
    creator: v.creator,
    tvl: v.tvl, // TVL은 "00000.00" 형식의 문자열로 유지
    share_price: v.share_price,
    share_price_decimals: v.share_price_decimals,
    performance: v.performance,
    tier: v.tier,
    explorer_url: v.explorer_url,
  }));

  return {
    vaults,
    total: raw.total,
  };
}

