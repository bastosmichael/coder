import React from 'react'
import { render } from '@testing-library/react'
import { Switch } from '../../../components/ui/switch'

jest.mock('@radix-ui/react-switch', () => ({
  Root: ({ children, ...props }: any) => <button data-testid="root" {...props}>{children}</button>,
  Thumb: (props: any) => <span data-testid="thumb" {...props} />
}))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('Switch', () => {
  it('renders thumb inside root', () => {
    const { getByTestId } = render(<Switch />)
    expect(getByTestId('root')).toBeInTheDocument()
    expect(getByTestId('thumb')).toBeInTheDocument()
  })
})
