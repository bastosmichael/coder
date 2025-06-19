import React from 'react'
import { render } from '@testing-library/react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuShortcut,
  ContextMenuSubTrigger
} from '../../../components/ui/context-menu'

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
