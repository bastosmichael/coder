jest.mock('../../../lib/ai/limit-tokens', () => ({
  limitTokens: jest.fn(() => ({ prompt: 'LIMITED', includedFiles: [], tokensUsed: 5 }))
}));

import { buildCodePlanPrompt } from '../../../lib/ai/build-plan-prompt';
import { buildCodeGenPrompt } from '../../../lib/ai/build-codegen-prompt';
import { limitTokens } from '../../../lib/ai/limit-tokens';

describe('build prompt helpers', () => {
  beforeEach(() => {
    (limitTokens as jest.Mock).mockClear();
  });

  it('buildCodePlanPrompt returns prompt with format instructions', async () => {
    const result = await buildCodePlanPrompt({
      issue: { name: 'Title', description: 'Desc' },
      codebaseFiles: [],
      instructionsContext: 'Do it'
    });
    expect(limitTokens).toHaveBeenCalled();
    expect(result).toContain('LIMITED');
    expect(result).toContain('# Format');
  });

  it('buildCodeGenPrompt returns prompt with format instructions', async () => {
    const result = await buildCodeGenPrompt({
      issue: { title: 'T', description: 'D' },
      codebaseFiles: [],
      plan: 'Plan',
      instructionsContext: 'Ctx'
    });
    expect(limitTokens).toHaveBeenCalled();
    expect(result).toContain('LIMITED');
    expect(result).toContain('<pr_description>');
  });
});
