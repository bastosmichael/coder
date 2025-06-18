import React from 'react'
import { render } from '@testing-library/react'
import { ToggleGroup, ToggleGroupItem } from '../../../components/ui/toggle-group'

jest.mock('@radix-ui/react-toggle-group', () => ({
  Root: ({ children, ...props }: any) => <div data-testid="root" {...props}>{children}</div>,
  Item: ({ children, ...props }: any) => <button data-testid="item" {...props}>{children}</button>
}))

jest.mock('../../../components/ui/toggle', () => ({
  toggleVariants: jest.fn(() => 'toggle'),
}))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('ToggleGroup', () => {
  it('passes context variant to items', () => {
    const { getByTestId } = render(
      <ToggleGroup variant="outline">
        <ToggleGroupItem>Item</ToggleGroupItem>
      </ToggleGroup>
    )
    expect(getByTestId('item').className).toContain('toggle')
  })
})
