import { render } from '@testing-library/react'
import AuthLayout from '../app/(auth)/layout'

describe('AuthLayout', () => {
  it('wraps children in centered container', async () => {
    const Layout = await AuthLayout({ children: <span>child</span> })
    const { getByText } = render(Layout as any)
    const child = getByText('child')
    expect(child.parentElement?.className).toContain('flex')
    expect(child).toBeInTheDocument()
  })
})
