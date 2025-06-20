jest.mock('../../../lib/ai/limit-tokens', () => ({
  limitTokens: jest.fn(() => ({ prompt: 'LIMIT', tokensUsed: 9 }))
}))

import { buildCodeGenPrompt } from '../../../lib/ai/build-codegen-prompt'
import { buildCodePlanPrompt } from '../../../lib/ai/build-plan-prompt'
import { limitTokens } from '../../../lib/ai/limit-tokens'

describe('build prompt warnings', () => {
  beforeEach(() => {
    ;(limitTokens as jest.Mock).mockClear()
  })

  it('logs tokens used for codegen prompt', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    await buildCodeGenPrompt({
      issue: { title: 't', description: 'd' },
      codebaseFiles: [{ path: 'a', content: 'c' }],
      plan: 'plan',
      instructionsContext: 'ctx'
    })
    expect(spy).toHaveBeenCalledWith('Code Gen Prompt: Tokens used: 9')
    spy.mockRestore()
  })

  it('logs tokens used for codeplan prompt', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    await buildCodePlanPrompt({
      issue: { name: 'n', description: 'd' },
      codebaseFiles: [{ path: 'a', content: 'c' }],
      instructionsContext: 'ctx'
    })
    expect(spy).toHaveBeenCalledWith('Code Plan Prompt: Tokens used: 9')
    spy.mockRestore()
  })
})
