import { fireEvent, render, act } from '@testing-library/react'
import { SiteHeader } from '../../../components/marketing/site-header'

jest.mock('@clerk/nextjs', () => ({
  SignInButton: ({ children }: any) => <button>{children}</button>,
  SignedIn: ({ children }: any) => <>{children}</>,
  SignedOut: ({ children }: any) => <>{children}</>,
  UserButton: () => <div>User</div>
}))

describe('SiteHeader', () => {
  const originalEnv = process.env
  beforeEach(() => {
    process.env = { ...originalEnv }
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    process.env = originalEnv
    ;(console.error as jest.Mock).mockRestore()
  })

  it('shows workspace link in simple mode', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'simple'
    const { getByText } = render(<SiteHeader />)
    const link = getByText('Workspace →').closest('a')
    expect(link?.getAttribute('href')).toBe('/onboarding')
  })

  it('shows login and user button in advanced mode', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'advanced'
    const { getByText } = render(<SiteHeader />)
    expect(getByText('Login')).toBeInTheDocument()
    expect(getByText('User')).toBeInTheDocument()
  })

  it('toggles mobile menu', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'simple'
    const { getAllByRole, container } = render(<SiteHeader />)
    const button = getAllByRole('button', { name: 'Toggle menu' })[0]
    const nav = container.querySelectorAll('nav')[1] as HTMLElement
    expect(nav.className).toContain('pointer-events-none')
    fireEvent.click(button)
    expect(nav.className).not.toContain('pointer-events-none')
  })

  it('closes menu on orientation change', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'simple'
    const { getAllByRole, container } = render(<SiteHeader />)
    const button = getAllByRole('button', { name: 'Toggle menu' })[0]
    const nav = container.querySelectorAll('nav')[1] as HTMLElement
    fireEvent.click(button)
    expect(nav.className).not.toContain('pointer-events-none')
    act(() => {
      window.dispatchEvent(new Event('orientationchange'))
    })
    expect(nav.className).toContain('pointer-events-none')
  })

  it('closes menu on resize', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'simple'
    const { getAllByRole, container, unmount } = render(<SiteHeader />)
    const button = getAllByRole('button', { name: 'Toggle menu' })[0]
    const nav = container.querySelectorAll('nav')[1] as HTMLElement
    fireEvent.click(button)
    expect(nav.className).not.toContain('pointer-events-none')
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    expect(nav.className).toContain('pointer-events-none')
    unmount()
  })
})
