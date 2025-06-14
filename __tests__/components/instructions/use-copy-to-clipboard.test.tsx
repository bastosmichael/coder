import { act, renderHook } from '@testing-library/react'
import { useCopyToClipboard } from '../../../components/instructions/use-copy-to-clipboard'

describe('useCopyToClipboard', () => {
  it('copies text and resets after timeout', async () => {
    jest.useFakeTimers()
    const writeText = jest.fn(() => Promise.resolve())
    Object.assign(navigator, { clipboard: { writeText } })

    const { result } = renderHook(() => useCopyToClipboard({ timeout: 1000 }))
    await act(async () => {
      result.current.copyToClipboard('hello')
    })
    expect(writeText).toHaveBeenCalledWith('hello')
    expect(result.current.isCopied).toBe(true)

    // Fast-forward timers
    jest.runAllTimers()
    expect(result.current.isCopied).toBe(false)
    jest.useRealTimers()
  })
})
