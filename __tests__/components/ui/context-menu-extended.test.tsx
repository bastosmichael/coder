import React from 'react'
import { render } from '@testing-library/react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger
} from '../../../components/ui/context-menu'

jest.mock('@radix-ui/react-context-menu', () => ({
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
  Content: ({ children }: any) => <div>{children}</div>,
  Item: ({ children, ...props }: any) => (
    <div data-testid="item" {...props}>
      {children}
    </div>
  ),
  CheckboxItem: ({ children, ...props }: any) => (
    <div data-testid="checkbox" {...props}>
      {children}
    </div>
  ),
  RadioItem: ({ children }: any) => <div>{children}</div>,
  ItemIndicator: ({ children }: any) => <span>{children}</span>,
  Label: ({ children }: any) => <div>{children}</div>,
  Separator: ({ children }: any) => <div>{children}</div>
}), { virtual: true })

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('ContextMenu components', () => {
  it('applies inset class and renders children', () => {
    const { getByText } = render(
      <ContextMenu open>
        <ContextMenuTrigger>Open</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem inset>Item</ContextMenuItem>
          <ContextMenuCheckboxItem checked>Check</ContextMenuCheckboxItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>Sub</ContextMenuSubTrigger>
            <ContextMenuSubContent>SubContent</ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuShortcut className="shortcut">S</ContextMenuShortcut>
        </ContextMenuContent>
      </ContextMenu>
    )
    expect(getByText('Item')).toHaveClass('pl-8')
    expect(getByText('Check')).toBeInTheDocument()
    expect(getByText('Sub')).toHaveClass('pl-8')
    expect(getByText('S')).toHaveClass('shortcut')
  })
})
