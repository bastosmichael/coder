import { generateOllamaResponse } from '../../../actions/ai/generate-ollama-response'
import { calculateLLMCost } from '../../../lib/ai/calculate-llm-cost'

jest.mock('../../../lib/ai/calculate-llm-cost')
const mockFetch = jest.fn()
;(global as any).fetch = mockFetch
;(calculateLLMCost as jest.Mock).mockReturnValue(0)

describe('generateOllamaResponse', () => {
  beforeEach(() => mockFetch.mockReset())

  it('returns content and calculates cost on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: { content: 'ok' } })
    })
    const result = await generateOllamaResponse([])
    expect(result).toBe('ok')
    expect(calculateLLMCost).toHaveBeenCalledWith({
      llmId: 'ollama',
      inputTokens: 0,
      outputTokens: 0
    })
  })

  it('throws error when request fails', async () => {
    mockFetch.mockResolvedValue({ ok: false, text: async () => 'fail', status: 500 })
    await expect(generateOllamaResponse([])).rejects.toThrow('Ollama API request failed with status 500: fail')
  })
})
