import React from 'react'
import { render } from '@testing-library/react'
import { NavigationMenu, NavigationMenuTrigger } from '../../../components/ui/navigation-menu'

jest.mock('@radix-ui/react-navigation-menu', () => ({
  Root: Object.assign(
    ({ children, ...props }: any) => <div data-testid="root" {...props}>{children}</div>,
    { displayName: 'Root' }
  ),
  List: Object.assign(
    ({ children, ...props }: any) => <ul data-testid="list" {...props}>{children}</ul>,
    { displayName: 'List' }
  ),
  Item: Object.assign((props: any) => <li {...props} />, { displayName: 'Item' }),
  Trigger: Object.assign(
    ({ children, ...props }: any) => <button data-testid="trigger" {...props}>{children}</button>,
    { displayName: 'Trigger' }
  ),
  Content: Object.assign((props: any) => <div {...props} />, { displayName: 'Content' }),
  Link: Object.assign((props: any) => <a {...props} />, { displayName: 'Link' }),
  Viewport: Object.assign(
    ({ children, ...props }: any) => <div data-testid="viewport" {...props}>{children}</div>,
    { displayName: 'Viewport' }
  ),
  Indicator: { displayName: 'Indicator' }
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
