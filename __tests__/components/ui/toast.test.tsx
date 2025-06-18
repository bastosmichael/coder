import React from 'react'
import { render } from '@testing-library/react'
import { Toast } from '../../../components/ui/toast'

describe('Toast component', () => {
  it('renders with destructive variant', () => {
    const { container } = render(<Toast variant="destructive">hi</Toast>)
    expect(container.firstChild).toHaveTextContent('hi')
    expect(container.firstChild?.className).toMatch(/destructive/)
  })
})
