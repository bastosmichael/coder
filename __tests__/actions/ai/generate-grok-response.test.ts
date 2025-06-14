import { generateGrokResponse } from '../../../actions/ai/generate-grok-response'
import { calculateLLMCost } from '../../../lib/ai/calculate-llm-cost'

jest.mock('../../../lib/ai/calculate-llm-cost')

const mockFetch = jest.fn()
;(global as any).fetch = mockFetch
;(calculateLLMCost as jest.Mock).mockReturnValue(0)

describe('generateGrokResponse', () => {
  beforeEach(() => mockFetch.mockReset())

  it('returns content and calculates cost on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'ok' } }], usage: { prompt_tokens: 1, completion_tokens: 2 } })
    })
    const result = await generateGrokResponse([])
    expect(result).toBe('ok')
    expect(calculateLLMCost).toHaveBeenCalledWith({
      llmId: 'grok-2-1212',
      inputTokens: 1,
      outputTokens: 2
    })
  })

  it('throws formatted error on context limit exceed', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      text: async () => "This model's maximum prompt length is 10 but the request contains 20 tokens.",
      status: 400
    })
    await expect(generateGrokResponse([])).rejects.toThrow(/EXCEED_CONTEXT/)
  })
})
