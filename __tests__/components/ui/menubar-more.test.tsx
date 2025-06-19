import React from 'react'
import { render } from '@testing-library/react'
import {
  MenubarSubTrigger,
  MenubarCheckboxItem,
  MenubarRadioItem
} from '../../../components/ui/menubar'

jest.mock('@radix-ui/react-menubar', () => {
  const React = require('react')
  const comp = (id: string) =>
    Object.assign(
      React.forwardRef((props: any, ref) => (
        <div ref={ref} data-testid={id} {...props} />
      )),
      { displayName: id }
    )
  return {
    Root: comp('root'),
    Item: comp('item'),
    Trigger: comp('trigger'),
    SubTrigger: comp('sub-trigger'),
    SubContent: comp('sub-content'),
    Content: comp('content'),
    CheckboxItem: comp('checkbox'),
    RadioItem: comp('radio'),
    ItemIndicator: ({ children }: any) => <span data-testid="indicator">{children}</span>,
    Label: comp('label'),
    Separator: comp('separator'),
    Portal: ({ children }: any) => <div>{children}</div>,
    Menu: comp('menu'),
    Group: comp('group'),
    Sub: comp('sub'),
    RadioGroup: comp('radiogroup')
  }
})

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('Menubar extra components', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    ;(console.error as jest.Mock).mockRestore()
  })

  it('renders sub trigger with inset', () => {
    const { getByTestId } = render(
      <MenubarSubTrigger inset className="extra">Text</MenubarSubTrigger>
    )
    expect(getByTestId('sub-trigger').className).toContain('pl-8')
    expect(getByTestId('sub-trigger').className).toContain('extra')
  })

  it('renders checkbox and radio items', () => {
    const { getByTestId, getAllByTestId } = render(
      <>
        <MenubarCheckboxItem checked>Check</MenubarCheckboxItem>
        <MenubarRadioItem>Radio</MenubarRadioItem>
      </>
    )
    expect(getByTestId('checkbox')).toBeInTheDocument()
    expect(getByTestId('radio')).toBeInTheDocument()
    // should render indicator icon once for checkbox
    expect(getAllByTestId('indicator').length).toBe(1)
  })
})
