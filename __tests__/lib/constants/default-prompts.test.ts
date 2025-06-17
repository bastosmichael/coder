import { DEFAULT_PLAN_PROMPT } from '../../../lib/constants/default-prompts'

describe('DEFAULT_PLAN_PROMPT', () => {
  it('contains guidance text', () => {
    expect(DEFAULT_PLAN_PROMPT).toMatch(/detailed, clear/)
  })
})
