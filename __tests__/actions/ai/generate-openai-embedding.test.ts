const mockCreate = jest.fn()
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    embeddings: { create: mockCreate },
    chat: { completions: { create: mockCreate } }
  }))
}), { virtual: true })

import { generateEmbedding } from '../../../actions/ai/generate-openai-embedding'
import { EPHEMYRAL_EMBEDDING_MODEL, EPHEMYRAL_EMBEDDING_DIMENSIONS } from '../../../lib/constants/ephemyral-coder-config'

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
