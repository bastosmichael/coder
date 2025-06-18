import React from 'react'
import { render } from '@testing-library/react'
import { NavigationMenu, NavigationMenuTrigger } from '../../../components/ui/navigation-menu'

jest.mock('@radix-ui/react-navigation-menu', () => ({
  Root: ({ children, ...props }: any) => <div data-testid="root" {...props}>{children}</div>,
  Trigger: ({ children, ...props }: any) => <button data-testid="trigger" {...props}>{children}</button>,
  Viewport: ({ children, ...props }: any) => <div data-testid="viewport" {...props}>{children}</div>
}))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('NavigationMenu', () => {
  it('renders trigger with chevron', () => {
    const { getByTestId, getByText } = render(
      <NavigationMenu>
        <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
      </NavigationMenu>
    )
    expect(getByTestId('trigger')).toBeInTheDocument()
    expect(getByText('Menu')).toBeInTheDocument()
    expect(getByTestId('viewport')).toBeInTheDocument()
  })
})
