import { fireEvent, render, act } from '@testing-library/react'
import { SiteHeader } from '../../../components/marketing/site-header'

describe('SiteHeader', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    ;(console.error as jest.Mock).mockRestore()
  })

  it('shows workspace link', () => {
    const { getByText } = render(<SiteHeader />)
    const link = getByText('Workspace →').closest('a')
    expect(link?.getAttribute('href')).toBe('/onboarding')
  })

  it('toggles mobile menu', () => {
    const { getAllByRole, container } = render(<SiteHeader />)
    const button = getAllByRole('button', { name: 'Toggle menu' })[0]
    const nav = container.querySelectorAll('nav')[1] as HTMLElement
    expect(nav.className).toContain('pointer-events-none')
    fireEvent.click(button)
    expect(nav.className).not.toContain('pointer-events-none')
  })

  it('closes menu on orientation change', () => {
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
