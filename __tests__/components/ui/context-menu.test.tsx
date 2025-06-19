import React from 'react'
import { render } from '@testing-library/react'

// mock Radix primitives before importing component to avoid context errors
jest.mock(
  '@radix-ui/react-context-menu',
  () => ({
    Root: ({ children }: any) => <div>{children}</div>,
    Trigger: ({ children }: any) => <div>{children}</div>,
    Group: ({ children }: any) => <div>{children}</div>,
    Portal: ({ children }: any) => <div>{children}</div>,
    Sub: ({ children }: any) => <div>{children}</div>,
    RadioGroup: ({ children }: any) => <div>{children}</div>,
    SubTrigger: ({ children, ...props }: any) => (
      <div data-testid="sub-trigger" {...props}>
        {children}
      </div>
    ),
    SubContent: ({ children, ...props }: any) => (
      <div data-testid="sub-content" {...props}>
        {children}
      </div>
    ),
    Content: ({ children, ...props }: any) => (
      <div data-testid="content" {...props}>{children}</div>
    ),
    Item: ({ children, ...props }: any) => (
      <div data-testid="item" {...props}>{children}</div>
    ),
    CheckboxItem: ({ children }: any) => <div>{children}</div>,
    RadioItem: ({ children }: any) => <div>{children}</div>,
    ItemIndicator: ({ children }: any) => <span>{children}</span>,
    Label: ({ children }: any) => <div>{children}</div>,
    Separator: ({ children }: any) => <div>{children}</div>,
  }),
  { virtual: true }
)

jest.mock('../../../lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}))

import { ContextMenuItem } from '../../../components/ui/context-menu';


describe('ContextMenuItem', () => {
  it('applies inset class when inset prop is true', () => {
    const { getByTestId } = render(<ContextMenuItem inset className="extra">Item</ContextMenuItem>)
    expect(getByTestId('item').className).toContain('pl-8')
    expect(getByTestId('item').className).toContain('extra')
  })
})
