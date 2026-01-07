import { render } from '@testing-library/react'
import { Integrations } from '../../../components/integrations/integrations'
import React from 'react'

describe('Integrations', () => {
  it('renders the integrations message', () => {
    const { getByText } = render(<Integrations />)
    expect(getByText('Integrations')).toBeInTheDocument()
    expect(getByText(/GITHUB_PAT/)).toBeInTheDocument()
  })
})
