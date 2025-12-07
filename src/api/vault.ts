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
  /** 토큰 이름 */
  name: string;
  /** 토큰 심볼 */
  symbol: string;
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
  /** 성과 정보 */
  performance: VaultPerformance;
  /** 티어 */
  tier: string;
  /** 포트폴리오 구성 (토큰 주소, 이름, 심볼, 가중치, 수량) */
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
    performance: VaultPerformance;
    tier: string;
    portfolio: Array<{
      address: string;
      name: string;
      symbol: string;
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
    performance: raw.performance,
    tier: raw.tier,
    portfolio: raw.portfolio.map((item) => ({
      address: item.address,
      name: item.name,
      symbol: item.symbol,
      weight: item.weight,
      amount: item.amount,
    })),
    strategy_description: raw.strategy_description,
    explorer_url: raw.explorer_url,
  };

  return data;
}

/**
 * GET /api/vaults
 *
 * 볼트(전략) 목록을 조회합니다. 페이지네이션, 필터링, 정렬을 지원합니다.
 * 
 * @param params - 조회 파라미터
 * @param params.creator - 생성자 지갑 주소로 필터링 (선택적)
 * @param params.depositor - 예치자 지갑 주소로 필터링 (선택적)
 * @param params.page - 페이지 번호 (1부터 시작, 기본값: 1)
 * @param params.limit - 페이지당 볼트 개수 (기본값: 20)
 * @param params.sort_by - 정렬 필드: 'tvl', 'name', 'apy' (기본값: 'tvl')
 * @param params.order - 정렬 순서: 'asc' 또는 'desc' (기본값: 'desc')
 * @returns 볼트 목록과 전체 개수
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export interface GetVaultsParams {
  creator?: string | null;
  depositor?: string | null;
  page?: number;
  limit?: number;
  sort_by?: 'tvl' | 'name' | 'apy';
  order?: 'asc' | 'desc';
}

export async function getVaults(
  params?: GetVaultsParams,
): Promise<VaultListResponse> {
  const url = new URL(`${BASE_URL}/api/vaults`);
  
  if (params?.creator) {
    url.searchParams.set("creator", params.creator);
  }
  if (params?.depositor) {
    url.searchParams.set("depositor", params.depositor);
  }
  if (params?.page !== undefined) {
    url.searchParams.set("page", params.page.toString());
  }
  if (params?.limit !== undefined) {
    url.searchParams.set("limit", params.limit.toString());
  }
  if (params?.sort_by) {
    url.searchParams.set("sort_by", params.sort_by);
  }
  if (params?.order) {
    url.searchParams.set("order", params.order);
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
    performance: v.performance,
    tier: v.tier,
    explorer_url: v.explorer_url,
  }));

  return {
    vaults,
    total: raw.total,
  };
}

