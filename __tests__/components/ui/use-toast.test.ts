import { reducer } from '../../../components/ui/use-toast'

describe('use-toast reducer', () => {
  it('adds a toast and limits length', () => {
    const state = { toasts: [{ id: '1', open: true }] as any[] }
    const next = reducer(state, { type: 'ADD_TOAST', toast: { id: '2', open: true } } as any)
    expect(next.toasts[0].id).toBe('2')
    expect(next.toasts.length).toBe(1)
  })

  it('updates a toast', () => {
    const state = { toasts: [{ id: '1', title: 'Old' }] as any[] }
    const next = reducer(state, { type: 'UPDATE_TOAST', toast: { id: '1', title: 'New' } } as any)
    expect(next.toasts[0].title).toBe('New')
  })

  it('dismisses a single toast', () => {
    const state = { toasts: [{ id: '1', open: true }] as any[] }
    const next = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' } as any)
    expect(next.toasts[0].open).toBe(false)
  })

  it('removes a toast', () => {
    const state = { toasts: [{ id: '1' }, { id: '2' }] as any[] }
    const next = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' } as any)
    expect(next.toasts).toEqual([{ id: '2' }])
  })

  it('dismisses all toasts when id undefined', () => {
    const state = { toasts: [{ id: '1', open: true }, { id: '2', open: true }] as any[] }
    const next = reducer(state, { type: 'DISMISS_TOAST' } as any)
    expect(next.toasts.every(t => !t.open)).toBe(true)
  })

  it('removes all toasts when id undefined', () => {
    const state = { toasts: [{ id: '1' }, { id: '2' }] as any[] }
    const next = reducer(state, { type: 'REMOVE_TOAST' } as any)
    expect(next.toasts.length).toBe(0)
  })
})
