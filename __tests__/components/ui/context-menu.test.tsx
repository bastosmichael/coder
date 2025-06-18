import React from 'react'
import { render } from '@testing-library/react'
import { ContextMenuItem } from '../../../components/ui/context-menu'

jest.mock('@radix-ui/react-context-menu', () => ({
  Item: ({ children, ...props }: any) => <div data-testid="item" {...props}>{children}</div>
}))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('ContextMenuItem', () => {
  it('applies inset class when inset prop is true', () => {
    const { getByTestId } = render(<ContextMenuItem inset className="extra">Item</ContextMenuItem>)
    expect(getByTestId('item').className).toContain('pl-8')
    expect(getByTestId('item').className).toContain('extra')
  })
})
