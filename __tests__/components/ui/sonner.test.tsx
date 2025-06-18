import { render } from '@testing-library/react'
import React from 'react'
import { Toaster } from '../../../components/ui/sonner'
import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

jest.mock('next-themes', () => ({ useTheme: jest.fn() }))
jest.mock('sonner', () => ({ Toaster: jest.fn((props: any) => <div data-testid="sonner" {...props} />) }))

describe('Toaster component', () => {
  it('passes theme from useTheme to Sonner', () => {
    ;(useTheme as jest.Mock).mockReturnValue({ theme: 'light' })
    const { getByTestId } = render(<Toaster />)
    const el = getByTestId('sonner')
    expect(el).toHaveClass('toaster')
    expect((Sonner as jest.Mock).mock.calls[0][0].theme).toBe('light')
  })
})
