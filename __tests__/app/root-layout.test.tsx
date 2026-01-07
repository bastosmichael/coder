import { render } from '@testing-library/react'

jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'font', variable: '--font' })
}))

import RootLayout, { metadata } from '../../app/layout'

describe('RootLayout', () => {
  it('exports metadata', () => {
    expect(metadata.title).toBe('Coder')
  })

  it('renders children', () => {
    const { getByText } = render(
      <RootLayout>
        <span>Child</span>
      </RootLayout>
    )
    expect(getByText('Child')).toBeInTheDocument()
  })
})
