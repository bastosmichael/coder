import React from 'react'
import { render } from '@testing-library/react'
import { AspectRatio } from '../../../components/ui/aspect-ratio'

describe('AspectRatio component', () => {
  it('renders children', () => {
    const { getByText } = render(<AspectRatio>child</AspectRatio>)
    expect(getByText('child')).toBeInTheDocument()
  })
})
