import { render } from '@testing-library/react'
import { MenubarItem } from '../../../components/ui/menubar'

jest.mock('@radix-ui/react-menubar', () => ({
  Item: (props: any) => <div data-testid="item" {...props} />
}))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('MenubarItem', () => {
  it('applies inset class when inset prop is true', () => {
    const { getByTestId } = render(<MenubarItem inset className="extra" />)
    const item = getByTestId('item')
    expect(item.className).toContain('pl-8')
    expect(item.className).toContain('extra')
  })
})
