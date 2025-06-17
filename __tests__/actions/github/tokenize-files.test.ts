jest.mock('gpt-tokenizer', () => ({
  encode: jest.fn((input: string) => new Array(input.length).fill(0))
}))

import { tokenizeFiles } from '../../../actions/github/tokenize-files'

describe('tokenizeFiles', () => {
  it('filters files with token limits', async () => {
    const files = [
      { path: 'a', content: '123' },
      { path: 'b', content: 'x'.repeat(9000) },
      { path: 'c', content: '' }
    ] as any
    const result = await tokenizeFiles(files)
    expect(result).toEqual([{ path: 'a', content: '123' }])
  })
})
