import React from 'react'
import { render } from '@testing-library/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSubTrigger,
  DropdownMenuShortcut
} from '../../../components/ui/dropdown-menu'

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('DropdownMenu extended', () => {
  it('renders items and applies props', () => {
    const { getByText } = render(
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8}>
          <DropdownMenuCheckboxItem checked>Check</DropdownMenuCheckboxItem>
          <DropdownMenuSubTrigger inset>Sub</DropdownMenuSubTrigger>
          <DropdownMenuShortcut className="short">X</DropdownMenuShortcut>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(getByText('Check')).toBeInTheDocument()
    expect(getByText('Sub')).toHaveClass('pl-8')
    expect(getByText('X')).toHaveClass('short')
  })
})
