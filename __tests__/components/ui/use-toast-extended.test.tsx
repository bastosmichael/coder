import React from 'react'
import { render, act } from '@testing-library/react'

describe('toast and useToast integration', () => {
  it('adds, replaces and dismisses toasts', () => {
    const mod = require('../../../components/ui/use-toast')
    const { toast, useToast } = mod

    function Viewer() {
      const { toasts } = useToast()
      return (
        <div>
          {toasts
            .filter(t => t.open)
            .map(t => (
              <div key={t.id}>{t.title}</div>
            ))}
        </div>
      )
    }

    const { queryByText } = render(<Viewer />)

    act(() => {
      toast({ title: 'A' })
    })
    expect(queryByText('A')).toBeInTheDocument()

    let control: any
    act(() => {
      control = toast({ title: 'B' })
    })
    expect(queryByText('B')).toBeInTheDocument()
    expect(queryByText('A')).toBeNull() // limited to one toast

    act(() => {
      control.dismiss()
    })
    expect(queryByText('B')).toBeNull()
  })
})
