import { generateOpenAIResponse } from '../../../actions/ai/generate-openai-response'
import OpenAI from 'openai'
import { calculateLLMCost } from '../../../lib/ai/calculate-llm-cost'

jest.mock('openai')
jest.mock('../../../lib/ai/calculate-llm-cost')

const mockCreate = jest.fn()
;(OpenAI as unknown as jest.Mock).mockImplementation(() => ({
  chat: { completions: { create: mockCreate } }
}))
;(calculateLLMCost as jest.Mock).mockReturnValue(0)

describe('generateOpenAIResponse', () => {
  it('returns text and calculates cost on success', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'hi' } }],
      usage: { prompt_tokens: 2, completion_tokens: 3 }
    })

    const result = await generateOpenAIResponse([{ role: 'user', content: 'q' }])
    expect(result).toBe('hi')
    expect(mockCreate).toHaveBeenCalled()
    expect(calculateLLMCost).toHaveBeenCalledWith({
      llmId: 'gpt-4o-mini',
      inputTokens: 2,
      outputTokens: 3
    })
  })

  it('throws formatted error when context limit exceeded', async () => {
    const error = { error: { message: "This model's maximum context length is 50 tokens. However, your messages resulted in 55 tokens." } }
    mockCreate.mockRejectedValue(error)

    await expect(generateOpenAIResponse([])).rejects.toThrow(/EXCEED_CONTEXT/)
  })
})
