import React from 'react'
import { render } from '@testing-library/react'
import { PaginationNext, PaginationPrevious } from '../../../components/ui/pagination'

describe('Pagination components', () => {
  it('renders next and previous links', () => {
    const { getByLabelText } = render(
      <div>
        <PaginationPrevious />
        <PaginationNext />
      </div>
    )
    expect(getByLabelText('Go to previous page')).toBeInTheDocument()
    expect(getByLabelText('Go to next page')).toBeInTheDocument()
  })
})
