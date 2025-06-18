import { act, renderHook } from '@testing-library/react'

// reload the hook module so memory state resets between tests
const loadHook = () => {
  let exports
  jest.isolateModules(() => {
    exports = require('../../../components/ui/use-toast') as typeof import('../../../components/ui/use-toast')
  })
  return exports!
}

describe('use-toast hook', () => {
  it('adds and dismisses toasts', () => {
    const { useToast } = loadHook()
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.toast({ title: 'Hello' })
    })
    expect(result.current.toasts[0].title).toBe('Hello')
    act(() => {
      result.current.dismiss(result.current.toasts[0].id)
    })
    expect(result.current.toasts[0].open).toBe(false)
  })
})

describe('toast reducer', () => {
  it('handles actions', () => {
    const { reducer } = loadHook()
    const state = { toasts: [] }
    const add = reducer(state, { type: 'ADD_TOAST', toast: { id: '1', open: true } })
    expect(add.toasts).toHaveLength(1)
    const add2 = reducer(add, { type: 'ADD_TOAST', toast: { id: '2', open: true } })
    expect(add2.toasts).toHaveLength(1)
    expect(add2.toasts[0].id).toBe('2')
    const updated = reducer(add2, { type: 'UPDATE_TOAST', toast: { id: '2', title: 't' } })
    expect(updated.toasts[0].title).toBe('t')
    const dismissed = reducer(updated, { type: 'DISMISS_TOAST', toastId: '2' })
    expect(dismissed.toasts[0].open).toBe(false)
    const removed = reducer(dismissed, { type: 'REMOVE_TOAST', toastId: '2' })
    expect(removed.toasts).toHaveLength(0)
  })
})
