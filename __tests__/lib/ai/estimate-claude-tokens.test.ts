jest.mock('gpt-tokenizer', () => ({
  encode: jest.fn((text: string) => Array(text.length).fill(0)),
}))

import { encode } from 'gpt-tokenizer'
import { estimateClaudeSonnet3_5TokenCount } from '../../../lib/ai/estimate-claude-tokens'

describe('estimateClaudeSonnet3_5TokenCount', () => {
  it('estimates token count as 1.4 times gpt-tokenizer length', () => {
    const text = 'Hello world';
    const expected = encode(text).length * 1.4;
    expect(estimateClaudeSonnet3_5TokenCount(text)).toBeCloseTo(expected);
  });
});
