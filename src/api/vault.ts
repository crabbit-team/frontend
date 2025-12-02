import { BASE_URL } from ".";

// NOTE:
// - API 레벨(백엔드, 타입, 함수명)에서는 일관되게 "vault" 용어를 사용한다.
// - 화면(UI)에서만 "Strategy" 라는 이름으로 노출한다.

export interface VaultCreator {
  address: string;
  image_url: string | null;
}

export interface VaultPerformance {
  apy: number;
  change_24h: number;
}

export interface VaultPortfolioItem {
  token: string;
  allocation: number;
}

// 상세 조회용 Vault 타입 (랭크/디테일 화면 등)
export interface VaultDetail {
  address: string;
  name: string;
  description: string;
  creator: VaultCreator;
  tvl: number;
  performance: VaultPerformance;
  portfolio: VaultPortfolioItem[];
  strategy_description: string;
}

// 리스트 조회용 Vault 요약 타입 (랭킹 등에서 사용 예정)
export interface VaultSummary {
  address: string;
  name: string;
  creator: VaultCreator;
  tvl: number;
  performance: VaultPerformance;
}

export interface VaultListResponse {
  vaults: VaultSummary[];
  total: number;
}

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

  const data = (await res.json()) as VaultDetail;
  return data;
}

// GET /api/vaults
// 모든 vault 리스트를 가져오거나, 선택적으로 creator 로 필터링한다.
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
      creator: VaultCreator;
      tvl: string | number;
      performance: VaultPerformance;
    }>;
    total: number;
  };

  const vaults: VaultSummary[] = raw.vaults.map((v) => ({
    address: v.address,
    name: v.name,
    creator: v.creator,
    tvl: typeof v.tvl === "string" ? parseFloat(v.tvl) : v.tvl,
    performance: v.performance,
  }));

  return {
    vaults,
    total: raw.total,
  };
}

