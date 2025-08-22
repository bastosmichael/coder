import { render } from '@testing-library/react'

jest.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: any) => <div data-testid="clerk">{children}</div>
}))

// Mock Clerk themes to avoid missing module errors during tests
jest.mock('@clerk/themes', () => ({ dark: {} }), { virtual: true })

jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'font', variable: '--font' })
}))

import RootLayout, { metadata } from '../../app/layout'

describe('RootLayout', () => {
  const originalEnv = process.env
  beforeEach(() => {
    process.env = { ...originalEnv }
  })
  afterEach(() => {
    process.env = originalEnv
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Coder')
  })

  it('wraps children with ClerkProvider in advanced mode', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'advanced'
    const { getByTestId } = render(
      <RootLayout>
        <span>Child</span>
      </RootLayout>
    )
    expect(getByTestId('clerk')).toBeInTheDocument()
  })

  it('omits ClerkProvider in simple mode', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'simple'
    const { queryByTestId } = render(
      <RootLayout>
        <span>Child</span>
      </RootLayout>
    )
    expect(queryByTestId('clerk')).toBeNull()
  })
})
