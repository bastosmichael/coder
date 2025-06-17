import * as cfg from '../../../lib/constants/ephemyral-coder-config'

describe('ephemyral coder config', () => {
  it('has sensible defaults', () => {
    expect(cfg.EPHEMYRAL_EMBEDDING_MODEL).toBeDefined()
    expect(cfg.EPHEMYRAL_MAX_INPUT_TOKENS).toBeGreaterThan(0)
  })
})
