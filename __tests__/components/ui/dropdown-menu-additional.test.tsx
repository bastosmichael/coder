import React from 'react'
import { render } from '@testing-library/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '../../../components/ui/dropdown-menu'

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('DropdownMenu misc components', () => {
  it('renders label, separator and radio item', () => {
    const { getByText } = render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset>Label</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem inset>Item</DropdownMenuItem>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    expect(getByText('Label')).toHaveClass('pl-8')
    expect(getByText('Item')).toHaveClass('pl-8')
    expect(getByText('A')).toBeInTheDocument()
  })
})
