import React from 'react'
import { render } from '@testing-library/react'
import { Toaster } from '../../../components/ui/toaster'

jest.mock('../../../components/ui/use-toast', () => ({
  useToast: () => ({
    toasts: [{ id: '1', title: 'T', description: 'D', action: <span>A</span>, open: true }]
  })
}))

describe('Toaster', () => {
  it('renders provided toasts', () => {
    const { getByText } = render(<Toaster />)
    expect(getByText('T')).toBeInTheDocument()
    expect(getByText('D')).toBeInTheDocument()
    expect(getByText('A')).toBeInTheDocument()
  })
})
