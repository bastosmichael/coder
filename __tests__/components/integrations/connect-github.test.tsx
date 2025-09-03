import { fireEvent, render, waitFor } from '@testing-library/react'
import { ConnectGitHub } from '../../../components/integrations/connect-github'

const mockPush = jest.fn()
const mockUseParams = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => mockUseParams()
}))

describe('ConnectGitHub', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockUseParams.mockClear()
    process.env.NEXT_PUBLIC_GITHUB_APP_NAME = 'app'
  })

  it('navigates to github oauth url', async () => {
    mockUseParams.mockReturnValue({ projectId: 'p1' })
    const { getByText } = render(<ConnectGitHub isGitHubConnected={false} />)
    fireEvent.click(getByText('Connect'))
    await waitFor(() => expect(mockPush).toHaveBeenCalled())
    expect(mockPush.mock.calls[0][0]).toContain('installations/select_target')
  })

  it('handles missing project id', async () => {
    mockUseParams.mockReturnValue({})
    const { getByText } = render(<ConnectGitHub isGitHubConnected={false} />)
    fireEvent.click(getByText('Connect'))
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/projects'))
  })
})
