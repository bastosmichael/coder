const mockCreate = jest.fn()
jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate }
  })),
  mockCreate
}), { virtual: true })
jest.mock('../../../lib/ai/calculate-llm-cost')
import { generateAnthropicResponse } from '../../../actions/ai/generate-anthropic-response'
import { calculateLLMCost, ANTHROPIC_LLMS } from '../../../lib/ai/calculate-llm-cost'

;(calculateLLMCost as jest.Mock).mockReturnValue(0)

// Provide a simplified model list for deterministic tests
;(ANTHROPIC_LLMS as unknown as any[]).splice(0, ANTHROPIC_LLMS.length, { id: 'model1', tokenLimits: { TPD: 100, RPD: 1 }, name: 'm1', inputCost:1, outputCost:1 }, { id: 'model2', tokenLimits: { TPD: 200, RPD: 2 }, name: 'm2', inputCost:1, outputCost:1 })

describe('generateAnthropicResponse', () => {
  beforeEach(() => mockCreate.mockReset())

  it('returns text from first model', async () => {
    mockCreate.mockResolvedValueOnce({ usage: { input_tokens: 1, output_tokens: 2 }, content: [{ type: 'text', text: 'hello' }] })
    const result = await generateAnthropicResponse([], 'model1')
    expect(result).toBe('hello')
    expect(mockCreate).toHaveBeenCalledWith({ model: 'model1', system: expect.any(String), messages: [], max_tokens: 100 })
    expect(calculateLLMCost).toHaveBeenCalledWith({ llmId: 'model1', inputTokens: 1, outputTokens: 2 })
  })

  it('falls back to next model on token error', async () => {
    mockCreate
      .mockRejectedValueOnce(new Error('TPM limit'))
      .mockResolvedValueOnce({ usage: { input_tokens: 3, output_tokens: 4 }, content: [{ type: 'text', text: 'ok' }] })
    const result = await generateAnthropicResponse([], 'model1')
    expect(result).toBe('ok')
    expect(mockCreate).toHaveBeenNthCalledWith(1, expect.objectContaining({ model: 'model1' }))
    expect(mockCreate).toHaveBeenNthCalledWith(2, expect.objectContaining({ model: 'model2' }))
  })

  it('throws when all models fail', async () => {
    mockCreate.mockRejectedValue(new Error('TPM'))
    await expect(generateAnthropicResponse([], 'model1')).rejects.toThrow('No available models could fulfill the request due to token limits.')
  })
})
