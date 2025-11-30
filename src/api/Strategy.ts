import { BASE_URL } from ".";

export interface StrategyGenerateRequest {
    prompt: string;
}

export interface StrategyGenerateResponse {
    description: string;
    reasoning: string;
    tokens: string[];
    weights: number[];
}

/**
 * Call backend to generate an AI-powered meme coin portfolio strategy.
 * POST {BASE_URL}/api/strategy/generate
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


