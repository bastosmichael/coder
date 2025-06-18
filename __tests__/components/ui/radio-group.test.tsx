import React from 'react'
import { render } from '@testing-library/react'
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group'

jest.mock('@radix-ui/react-radio-group', () => ({
  Root: ({ children, ...props }: any) => <div data-testid="root" {...props}>{children}</div>,
  Item: ({ children, ...props }: any) => <div data-testid="item" {...props}>{children}</div>,
  Indicator: ({ children, ...props }: any) => <span data-testid="indicator" {...props}>{children}</span>
}))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('RadioGroup', () => {
  it('renders indicator inside item', () => {
    const { getByTestId } = render(
      <RadioGroup>
        <RadioGroupItem />
      </RadioGroup>
    )
    expect(getByTestId('item')).toBeInTheDocument()
    expect(getByTestId('indicator')).toBeInTheDocument()
  })
})
