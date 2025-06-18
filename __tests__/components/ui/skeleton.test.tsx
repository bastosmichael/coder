import React from 'react'
import { render } from '@testing-library/react'
import { Skeleton } from '../../../components/ui/skeleton'

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('Skeleton component', () => {
  it('renders with provided class', () => {
    const { container } = render(<Skeleton className="extra" />)
    expect(container.firstChild).toHaveClass('extra')
  })
})
