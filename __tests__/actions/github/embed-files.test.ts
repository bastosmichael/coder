var mockCreate: jest.Mock
jest.mock('openai', () => {
  mockCreate = jest.fn()
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({ embeddings: { create: mockCreate } }))
  }
})

jest.mock('gpt-tokenizer', () => ({ encode: jest.fn(() => [1, 2, 3]) }))

import { embedFiles } from '../../../actions/github/embed-files'

describe('embedFiles', () => {
  it('calls openai and returns prepared files', async () => {
    mockCreate.mockResolvedValue({ data: [{ embedding: [0.1] }, { embedding: [0.2] }] })
    const files = [
      { path: 'a.ts', content: 'code' },
      { path: 'b.ts', content: 'more' }
    ] as any

    const result = await embedFiles(files)
    expect(mockCreate).toHaveBeenCalled()
    expect(result).toEqual([
      { path: 'a.ts', content: 'code', tokenCount: 3, embedding: [0.1] },
      { path: 'b.ts', content: 'more', tokenCount: 3, embedding: [0.2] }
    ])
  })
})
