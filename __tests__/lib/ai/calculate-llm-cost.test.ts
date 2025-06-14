import { getLLMById, calculateLLMCost } from '../../lib/ai/calculate-llm-cost';

describe('LLM helpers', () => {
  it('retrieves model by id', () => {
    const llm = getLLMById('gpt-4o-mini');
    expect(llm?.name).toBe('GPT-4 Omni Mini');
  });

  it('returns zero cost for unknown model', () => {
    expect(calculateLLMCost({ llmId: 'unknown', inputTokens: 1000, outputTokens: 1000 })).toBe(0);
  });

  it('calculates cost using model pricing', () => {
    const llm = getLLMById('gpt-4o-mini')!;
    const inputTokens = 500000;
    const outputTokens = 250000;
    const expected = (inputTokens / 1_000_000) * llm.inputCost + (outputTokens / 1_000_000) * llm.outputCost;
    expect(calculateLLMCost({ llmId: llm.id, inputTokens, outputTokens })).toBeCloseTo(expected, 6);
  });
});
