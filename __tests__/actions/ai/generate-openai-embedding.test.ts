import { generateEmbedding } from '../../../actions/ai/generate-openai-embedding'
import OpenAI from 'openai'
import { EPHEMYRAL_EMBEDDING_MODEL, EPHEMYRAL_EMBEDDING_DIMENSIONS } from '../../../lib/constants/ephemyral-coder-config'

jest.mock('openai')

const mockCreate = jest.fn()
;(OpenAI as unknown as jest.Mock).mockImplementation(() => ({
  embeddings: { create: mockCreate }
}))

describe('generateEmbedding', () => {
  it('returns embedding when request succeeds', async () => {
    const embedding = [0.1, 0.2]
    mockCreate.mockResolvedValue({ data: [{ embedding }] })
    const result = await generateEmbedding('text')
    expect(mockCreate).toHaveBeenCalledWith({
      model: EPHEMYRAL_EMBEDDING_MODEL,
      dimensions: EPHEMYRAL_EMBEDDING_DIMENSIONS,
      input: 'text'
    })
    expect(result).toBe(embedding)
  })

  it('throws when request fails', async () => {
    const error = new Error('fail')
    mockCreate.mockRejectedValue(error)
    await expect(generateEmbedding('x')).rejects.toThrow('fail')
  })
})
