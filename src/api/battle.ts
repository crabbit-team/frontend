import { BASE_URL } from ".";

/**
 * AI 배틀 전략 정보
 * 배틀에서 사용 가능한 AI 상대의 전략 데이터
 * 
 * API 응답 형식:
 * {
 *   "id": 0,
 *   "name": "string",
 *   "description": "string",
 *   "address": "string",
 *   "vault": "string",
 *   "tokens": ["string"],
 *   "weights": [0]
 * }
 */
export interface AIBattleStrategy {
  /** 전략 고유 ID */
  id: number;
  /** 전략 이름 */
  name: string;
  /** 전략 설명 */
  description: string;
  /** 전략 컨트랙트 주소 */
  address: string;
  /**
   * Backend uses "vault" terminology in the payload.
   * On the frontend, treat this as a strategy identifier and
   * never surface the word "vault" directly in the UI.
   */
  vault: string;
  /** 전략에 포함된 토큰 목록 */
  tokens: string[];
  /** 각 토큰의 가중치 (tokens와 동일한 순서) */
  weights: number[];
}

/**
 * AI 배틀 전략 목록 응답
 * 
 * API 응답 형식:
 * {
 *   "strategies": [...],
 *   "total": 0
 * }
 */
export interface AIBattleStrategyListResponse {
  /** AI 전략 목록 */
  strategies: AIBattleStrategy[];
  /** 전체 전략 개수 */
  total: number;
}

/**
 * 배틀 상태
 * NOTE: Backend may return statuses like "WAITING", "IN_PROGRESS", "ENDED".
 * Keep union broad enough to cover backend enum while UI can map/translate as needed.
 */
export type BattleStatus = "WAITING" | "IN_PROGRESS" | "RUNNING" | "ENDED";

/**
 * 미니게임 승자
 * 미니게임에서 누가 이겼는지, 또는 무승부인지 표시
 */
export type MinigameWinner = "CREATOR" | "OPPONENT" | "DRAW" | null;

/**
 * 배틀 룸 생성 요청
 */
export interface CreateBattleRequest {
  /** 생성자 지갑 주소 */
  wallet_address: string;
  /** 사용할 볼트(전략) 주소 */
  vault_address: string;
  /** 서명 데이터 */
  signature: string;
  /** 배틀 지속 시간 (초) */
  duration_seconds: number;
}

/**
 * 배틀 룸 정보
 * 배틀의 전체 상태와 진행 정보를 담는 객체
 */
export interface BattleRoom {
  /** 배틀 룸 고유 ID */
  id: number;
  /** 생성자 지갑 주소 */
  creator_address: string;
  /** 생성자가 사용하는 볼트(전략) 주소 */
  creator_vault: string;
  /** 상대방 지갑 주소 (AI인 경우 null) */
  opponent_address: string | null;
  /** 상대방이 사용하는 볼트(전략) 주소 (AI인 경우 null) */
  opponent_vault: string | null;
  /** 현재 배틀 상태 */
  status: BattleStatus;
  /** 배틀 지속 시간 (초) */
  duration_seconds: number;
  /** 배틀 시작 시간 (ISO 문자열, 아직 시작 안했으면 null) */
  start_time: string | null;
  /** 배틀 종료 시간 (ISO 문자열, 아직 종료 안했으면 null) */
  end_time: string | null;
  /** 생성자의 수익률 (%) */
  creator_return_pct: number | null;
  /** 상대방의 수익률 (%) */
  opponent_return_pct: number | null;
  /** 승자 지갑 주소 (아직 결정 안됐으면 null) */
  winner_address: string | null;
  /** 배틀 룸 생성 시간 (ISO 문자열) */
  created_at: string;
  /** 생성자의 미니게임 클리어 횟수 */
  creator_cleared_count: number | null;
  /** 상대방의 미니게임 클리어 횟수 */
  opponent_cleared_count: number | null;
  /** 미니게임 승자 */
  minigame_winner: MinigameWinner;
  /** 생성자의 종합 점수 (전략 점수 + 미니게임 점수) */
  creator_combined_score: number | null;
  /** 상대방의 종합 점수 (전략 점수 + 미니게임 점수) */
  opponent_combined_score: number | null;
}

/**
 * 배틀 스트림 데이터
 * SSE(Server-Sent Events)를 통해 실시간으로 전달되는 배틀 진행 데이터
 * Minimal typing for SSE payload; backend may add more fields over time.
 */
export interface BattleStreamData {
  /** 생성자의 현재 수익률 (%) */
  creator_return_pct: number;
  /** 상대방의 현재 수익률 (%) */
  opponent_return_pct: number;
  /** 추가 필드를 위한 인덱스 시그니처 (백엔드가 필드를 추가해도 타입 체크가 깨지지 않도록) */
  [key: string]: unknown;
}

/**
 * 배틀 종료 요청
 * 미니게임 결과를 포함하여 배틀을 최종 종료하고 점수를 계산
 */
export interface FinalizeBattleRequest {
  /** 생성자의 미니게임 클리어 횟수 */
  creator_cleared_count: number;
  /** 상대방의 미니게임 클리어 횟수 */
  opponent_cleared_count: number;
}

/**
 * AI 상대 선택 요청
 */
export interface SelectAIOpponentRequest {
  /** 선택할 AI 전략 ID */
  ai_strategy_id: number;
}

/**
 * 배틀 결과 응답
 * 종료된 배틀의 최종 결과 정보
 * Structured result for finished battles. Inner objects are left flexible so
 * the backend can evolve fields without breaking the frontend.
 */
export interface BattleResultResponse {
  /** 배틀 ID */
  battle_id: number;
  /** 배틀 상태 */
  status: string;
  /** 승자 지갑 주소 */
  winner: string | null;
  /** 전략 결과 상세 정보 */
  strategy_result: Record<string, unknown>;
  /** 미니게임 결과 상세 정보 */
  minigame_result: Record<string, unknown>;
  /** 종합 점수 정보 */
  combined_score: Record<string, unknown>;
  /** 전략 보상 정보 */
  strategy_reward: Record<string, unknown>;
  /** 미니게임 보상 정보 */
  minigame_reward: Record<string, unknown>;
  /** 배틀 종료 시간 (ISO 문자열) */
  finished_at: string;
}

/**
 * GET /api/battles/ai-strategies
 *
 * 배틀에서 사용 가능한 AI 전략 목록을 조회합니다.
 * 
 * @returns AI 전략 목록과 전체 개수
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function getAIBattleStrategies(): Promise<AIBattleStrategyListResponse> {
  const res = await fetch(`${BASE_URL}/api/battles/ai-strategies`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let message = `Failed to fetch AI battle strategies (status ${res.status})`;
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

  const data = (await res.json()) as AIBattleStrategyListResponse;
  return data;
}

/**
 * POST /api/battles
 *
 * 새로운 배틀 룸을 생성합니다.
 * 생성된 배틀 룸은 WAITING 상태로 시작되며, 상대방이 선택되면 시작됩니다.
 * 
 * @param payload - 배틀 생성에 필요한 정보 (지갑 주소, 볼트 주소, 서명, 지속 시간)
 * @returns 생성된 배틀 룸 정보
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function createBattleRoom(
  payload: CreateBattleRequest,
): Promise<BattleRoom> {
  const res = await fetch(`${BASE_URL}/api/battles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = `Failed to create battle room (status ${res.status})`;
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

  const data = (await res.json()) as BattleRoom;
  return data;
}

/**
 * GET /api/battles/{battle_id}/stream
 *
 * 배틀의 실시간 진행 상황을 스트리밍하는 SSE(Server-Sent Events) 연결을 엽니다.
 * 호출자는 EventSource를 닫는 책임이 있습니다.
 * 
 * @param battleId - 배틀 룸 ID
 * @returns EventSource 객체 (실시간 데이터 수신용)
 * 
 * @example
 * ```typescript
 * const es = openBattleStream(1);
 * es.onmessage = (event) => {
 *   const data = JSON.parse(event.data) as BattleStreamData;
 *   console.log(data.creator_return_pct, data.opponent_return_pct);
 * };
 * // 사용 후 반드시 닫기
 * es.close();
 * ```
 */
export function openBattleStream(battleId: number): EventSource {
  return new EventSource(
    `${BASE_URL}/api/battles/${encodeURIComponent(battleId)}/stream`,
  );
}

/**
 * GET /api/battles/{battle_id}
 *
 * 배틀 ID로 배틀 룸 정보를 조회합니다.
 * 
 * @param battleId - 조회할 배틀 룸 ID
 * @returns 배틀 룸 정보
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function getBattleRoom(battleId: number): Promise<BattleRoom> {
  const res = await fetch(
    `${BASE_URL}/api/battles/${encodeURIComponent(battleId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    let message = `Failed to fetch battle room (status ${res.status})`;
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

  const data = (await res.json()) as BattleRoom;
  return data;
}

/**
 * POST /api/battles/{battle_id}/finalize
 *
 * 미니게임 결과를 포함하여 배틀을 최종 종료하고 최종 점수를 계산합니다.
 * 이 함수 호출 후 배틀은 ENDED 상태가 되며, 최종 승자가 결정됩니다.
 * 
 * @param battleId - 종료할 배틀 룸 ID
 * @param payload - 미니게임 클리어 횟수 (생성자, 상대방)
 * @returns 최종화된 배틀 룸 정보
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function finalizeBattleRoom(
  battleId: number,
  payload: FinalizeBattleRequest,
): Promise<BattleRoom> {
  const res = await fetch(
    `${BASE_URL}/api/battles/${encodeURIComponent(battleId)}/finalize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    let message = `Failed to finalize battle room (status ${res.status})`;
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

  const data = (await res.json()) as BattleRoom;
  return data;
}

/**
 * GET /api/battles/{battle_id}/result
 *
 * 종료된 배틀의 최종 결과를 조회합니다.
 * 전략 결과, 미니게임 결과, 보상 정보 등 상세한 결과 데이터를 반환합니다.
 * 
 * @param battleId - 조회할 배틀 룸 ID
 * @returns 배틀 결과 상세 정보
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function getBattleResult(
  battleId: number,
): Promise<BattleResultResponse> {
  const res = await fetch(
    `${BASE_URL}/api/battles/${encodeURIComponent(battleId)}/result`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    let message = `Failed to fetch battle result (status ${res.status})`;
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

  const data = (await res.json()) as BattleResultResponse;
  return data;
}

/**
 * POST /api/battles/{battle_id}/select-ai
 *
 * 기존 배틀 룸에 AI 상대를 선택하고 배틀을 시작합니다.
 * 이 함수 호출 후 배틀은 IN_PROGRESS 상태가 되며, 실제 배틀이 진행됩니다.
 * 
 * @param battleId - AI 상대를 선택할 배틀 룸 ID
 * @param payload - 선택할 AI 전략 ID
 * @returns 업데이트된 배틀 룸 정보
 * @throws {Error} API 요청 실패 시 에러 발생
 */
export async function selectAIOpponentForBattle(
  battleId: number,
  payload: SelectAIOpponentRequest,
): Promise<BattleRoom> {
  const res = await fetch(
    `${BASE_URL}/api/battles/${encodeURIComponent(battleId)}/select-ai`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    let message = `Failed to select AI opponent (status ${res.status})`;
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

  const data = (await res.json()) as BattleRoom;
  return data;
}


