import * as config from '../../../lib/constants/linear-config'

describe('linear-config constants', () => {
  it('contains expected values', () => {
    expect(config.IN_PROGRESS_EMOJI).toBe('thought_balloon')
    expect(config.COMPLETED_EMOJI).toBe('white_check_mark')
    expect(config.AI_LABEL).toBe('Assign To AI')
  })
})
