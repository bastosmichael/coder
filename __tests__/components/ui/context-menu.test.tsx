import React from 'react'
import { render } from '@testing-library/react'

// mock Radix primitives before importing component to avoid context errors
jest.mock('@radix-ui/react-context-menu', () => ({
  Root: { displayName: 'Root' },
  Trigger: { displayName: 'Trigger' },
  Group: { displayName: 'Group' },
  Portal: ({ children }: any) => <div>{children}</div>,
  Sub: { displayName: 'Sub' },
  RadioGroup: { displayName: 'RadioGroup' },
  SubTrigger: Object.assign(
    ({ children, ...props }: any) => (
      <div data-testid="sub-trigger" {...props}>
        {children}
      </div>
    ),
    { displayName: 'SubTrigger' }
  ),
  SubContent: Object.assign(
    ({ children, ...props }: any) => (
      <div data-testid="sub-content" {...props}>
        {children}
      </div>
    ),
    { displayName: 'SubContent' }
  ),
  Content: Object.assign(
    ({ children, ...props }: any) => (
      <div data-testid="content" {...props}>
        {children}
      </div>
    ),
    { displayName: 'Content' }
  ),
  Item: Object.assign(
    ({ children, ...props }: any) => (
      <div data-testid="item" {...props}>
        {children}
      </div>
    ),
    { displayName: 'Item' }
  ),
  CheckboxItem: { displayName: 'CheckboxItem' },
  RadioItem: { displayName: 'RadioItem' },
  ItemIndicator: ({ children }: any) => <span>{children}</span>,
  Label: { displayName: 'Label' },
  Separator: { displayName: 'Separator' }
}))

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
