import * as React from 'react'
import { act, renderHook } from '@testing-library/react'

describe('useToast hook', () => {
  const loadHook = () => {
    jest.resetModules()
    return require('../../../components/ui/use-toast').useToast as () => any
  }

  it('adds and dismisses a toast', () => {
    const useToast = loadHook()
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'hello' })
    })

    expect(result.current.toasts).toHaveLength(1)
    const id = result.current.toasts[0].id

    act(() => {
      result.current.dismiss(id)
    })

    expect(result.current.toasts[0].open).toBe(false)
  })

  it('updates a toast via returned helper', () => {
    const useToast = loadHook()
    const { result } = renderHook(() => useToast())

    act(() => {
      const t = result.current.toast({ title: 'a' })
      t.update({ id: t.id, title: 'b' })
    })

    expect(result.current.toasts[0].title).toBe('b')
  })
})
