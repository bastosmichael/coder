import { render } from '@testing-library/react'
import { Integrations } from '../../../components/integrations/integrations'
import React from 'react'

jest.mock('../../../components/integrations/connect-github', () => ({ ConnectGitHub: () => <div>GitHub</div> }))

const mockSearch = jest.fn()
jest.mock('next/navigation', () => ({ useSearchParams: () => ({ get: mockSearch }) }))

describe('Integrations', () => {
  beforeEach(() => {
    mockSearch.mockReset()
  })

  it('renders error and success messages', () => {
    mockSearch.mockImplementation(key => {
      if (key === 'error') return encodeURIComponent('err')
      if (key === 'success') return encodeURIComponent('ok')
      return null
    })
    const { getByText } = render(<Integrations isGitHubConnected={false} />)
    expect(getByText('err')).toBeInTheDocument()
    expect(getByText('ok')).toBeInTheDocument()
    expect(getByText('GitHub')).toBeInTheDocument()
  })

  it('handles missing params', () => {
    mockSearch.mockReturnValue(null)
    const { queryByText } = render(<Integrations isGitHubConnected={true} />)
    expect(queryByText('GitHub')).toBeInTheDocument()
    expect(queryByText('err')).not.toBeInTheDocument()
    expect(queryByText('ok')).not.toBeInTheDocument()
  })
})
