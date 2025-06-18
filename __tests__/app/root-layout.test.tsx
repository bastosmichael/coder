import { render } from '@testing-library/react'
import RootLayout, { metadata } from '../../app/layout'

jest.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: any) => <div data-testid="clerk">{children}</div>
}))

jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'font', variable: '--font' })
}))

describe('RootLayout', () => {
  const originalEnv = process.env
  beforeEach(() => {
    process.env = { ...originalEnv }
  })
  afterEach(() => {
    process.env = originalEnv
  })

  it('exports metadata', () => {
    expect(metadata.title).toBe('Ephemyral Coder')
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
