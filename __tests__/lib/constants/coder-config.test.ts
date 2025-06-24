import * as cfg from '../../../lib/constants/coder-config'

describe('coder config', () => {
  it('has sensible defaults', () => {
    expect(cfg.CODER_EMBEDDING_MODEL).toBeDefined()
    expect(cfg.CODER_MAX_INPUT_TOKENS).toBeGreaterThan(0)
  })
})
