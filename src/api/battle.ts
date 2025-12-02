import { BASE_URL } from ".";

export interface AIBattleStrategy {
  id: number;
  name: string;
  description: string;
  address: string;
  /**
   * Backend uses "vault" terminology in the payload.
   * On the frontend, treat this as a strategy identifier and
   * never surface the word "vault" directly in the UI.
   */
  vault: string;
  tokens: string[];
  weights: number[];
}

export interface AIBattleStrategyListResponse {
  strategies: AIBattleStrategy[];
  total: number;
}

// NOTE:
// Backend may return statuses like "WAITING", "IN_PROGRESS", "ENDED".
// Keep union broad enough to cover backend enum while UI can map/translate as needed.
export type BattleStatus = "WAITING" | "IN_PROGRESS" | "RUNNING" | "ENDED";

export type MinigameWinner = "CREATOR" | "OPPONENT" | "DRAW" | null;

export interface CreateBattleRequest {
  wallet_address: string;
  vault_address: string;
  signature: string;
  duration_seconds: number;
}

export interface BattleRoom {
  id: number;
  creator_address: string;
  creator_vault: string;
  opponent_address: string | null;
  opponent_vault: string | null;
  status: BattleStatus;
  duration_seconds: number;
  start_time: string | null;
  end_time: string | null;
  creator_return_pct: number | null;
  opponent_return_pct: number | null;
  winner_address: string | null;
  created_at: string;
  creator_cleared_count: number | null;
  opponent_cleared_count: number | null;
  minigame_winner: MinigameWinner;
  creator_combined_score: number | null;
  opponent_combined_score: number | null;
}

// Minimal typing for SSE payload; backend may add more fields over time.
export interface BattleStreamData {
  creator_return_pct: number;
  opponent_return_pct: number;
  // Allow additional fields without breaking type checking.
  [key: string]: unknown;
}

export interface FinalizeBattleRequest {
  creator_cleared_count: number;
  opponent_cleared_count: number;
}
export interface SelectAIOpponentRequest {
  ai_strategy_id: number;
}

// Structured result for finished battles. Inner objects are left flexible so
// the backend can evolve fields without breaking the frontend.
export interface BattleResultResponse {
  battle_id: number;
  status: string;
  winner: string | null;
  strategy_result: Record<string, unknown>;
  minigame_result: Record<string, unknown>;
  combined_score: Record<string, unknown>;
  strategy_reward: Record<string, unknown>;
  minigame_reward: Record<string, unknown>;
  finished_at: string;
}

/**
 * GET /api/battles/ai-strategies
 *
 * Returns the list of predefined AI strategies available for battles.
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
 * Create a new battle room in WAITING status.
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
 * Opens a Server-Sent Events (SSE) connection that streams real-time
 * battle progress. Caller is responsible for closing the EventSource.
 *
 * Example:
 * const es = openBattleStream(1);
 * es.onmessage = (event) => {
 *   const data = JSON.parse(event.data) as BattleStreamData;
 *   console.log(data.creator_return_pct, data.opponent_return_pct);
 * };
 */
export function openBattleStream(battleId: number): EventSource {
  return new EventSource(
    `${BASE_URL}/api/battles/${encodeURIComponent(battleId)}/stream`,
  );
}

/**
 * GET /api/battles/{battle_id}
 *
 * Fetch a single battle room by its ID.
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
 * Finalize a battle room with minigame results and compute final scores.
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
 * Fetch structured final result for a finished battle.
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
 * Select AI opponent for an existing battle and start it.
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


