import React from 'react'
import { render } from '@testing-library/react'
import { Toggle } from '../../../components/ui/toggle'

jest.mock('@radix-ui/react-toggle', () => ({
  Root: ({ children, ...props }: any) => <button data-testid="root" {...props}>{children}</button>
}))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('Toggle', () => {
  it('applies variant classes', () => {
    const { getByTestId } = render(<Toggle variant="outline" className="extra">T</Toggle>)
    expect(getByTestId('root').className).toContain('outline')
    expect(getByTestId('root').className).toContain('extra')
  })
})
