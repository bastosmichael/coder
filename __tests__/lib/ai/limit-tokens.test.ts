jest.mock('../../lib/constants/ephemyral-coder-config', () => ({
  EPHEMYRAL_MAX_INPUT_TOKENS: 30
}));

jest.mock('../../lib/ai/estimate-claude-tokens', () => ({
  estimateClaudeSonnet3_5TokenCount: (text: string) => text.length
}));

import { limitTokens } from '../../lib/ai/limit-tokens';

describe('limitTokens', () => {
  it('includes files until the token limit is reached', () => {
    const basePrompt = 'base';
    const files = [
      { path: 'a.ts', content: 'contentA' },
      { path: 'b.ts', content: 'contentB' }
    ];
    const result = limitTokens(basePrompt, files);
    expect(result.includedFiles).toEqual([files[0]]);
    const expectedTokens = basePrompt.length + `# File Path: a.ts\ncontentA`.length;
    expect(result.tokensUsed).toBe(expectedTokens);
    expect(result.prompt).toContain('Available Codebase Files');
    expect(result.prompt).toContain('## File Path: a.ts');
    expect(result.prompt).not.toContain('b.ts');
  });

  it('returns no files when base prompt exceeds limit', async () => {
    jest.resetModules();
    jest.doMock('../../lib/constants/ephemyral-coder-config', () => ({
      EPHEMYRAL_MAX_INPUT_TOKENS: 10
    }));
    jest.doMock('../../lib/ai/estimate-claude-tokens', () => ({
      estimateClaudeSonnet3_5TokenCount: (text: string) => text.length
    }));
    const { limitTokens: limited } = await import('../../lib/ai/limit-tokens');
    const result = limited('verylongprompt', [{ path: 'x.ts', content: 'c' }]);
    expect(result.includedFiles).toEqual([]);
    expect(result.prompt).toContain('No codebase files.');
    expect(result.tokensUsed).toBe('verylongprompt'.length);
  });
});
