import React from 'react'
import { render } from '@testing-library/react'
import { MenubarItem } from '../../../components/ui/menubar'

jest.mock('@radix-ui/react-menubar', () => {
  const Item = Object.assign(
    React.forwardRef((props: any, ref) => <div ref={ref} data-testid="item" {...props} />),
    { displayName: 'Item' }
  )
  const Content = React.forwardRef((props: any, ref) => <div ref={ref} data-testid="content" {...props} />)
  Content.displayName = 'Content'

  return {
    Root: { displayName: 'Root' },
    Item,
    Trigger: { displayName: 'Trigger' },
    SubTrigger: { displayName: 'SubTrigger' },
    SubContent: { displayName: 'SubContent' },
    Content,
    CheckboxItem: { displayName: 'CheckboxItem' },
    RadioItem: { displayName: 'RadioItem' },
    Label: { displayName: 'Label' },
    Separator: { displayName: 'Separator' },
    Portal: ({ children }: any) => <div>{children}</div>,
    Menu: { displayName: 'Menu' },
    Group: { displayName: 'Group' },
    Sub: { displayName: 'Sub' },
    RadioGroup: { displayName: 'RadioGroup' }
  }
})

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('MenubarItem', () => {
  it('applies inset class when inset prop is true', () => {
    const { getByTestId } = render(<MenubarItem inset className="extra" />)
    const item = getByTestId('item')
    expect(item.className).toContain('pl-8')
    expect(item.className).toContain('extra')
  })
})
import { MenubarContent, MenubarShortcut } from '../../../components/ui/menubar'

describe('Menubar additional components', () => {
  it('passes class names to content', () => {
    const { getByTestId } = render(<MenubarContent className="extra" />)
    expect(getByTestId('content')).toHaveClass('extra')
  })

  it('renders shortcut with custom class', () => {
    const { getByText } = render(<MenubarShortcut className="x">S</MenubarShortcut>)
    expect(getByText('S').className).toContain('x')
  })
})
