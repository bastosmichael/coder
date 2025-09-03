import { fireEvent, render, waitFor } from '@testing-library/react'
import { ConnectGitHub } from '../../../components/integrations/connect-github'

const push = jest.fn()
const useParams = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useParams: () => useParams()
}))

describe('ConnectGitHub', () => {
  beforeEach(() => {
    push.mockClear()
    useParams.mockClear()
    process.env.NEXT_PUBLIC_GITHUB_APP_NAME = 'app'
  })

  it('navigates to github oauth url', async () => {
    useParams.mockReturnValue({ projectId: 'p1' })
    const { getByText } = render(<ConnectGitHub isGitHubConnected={false} />)
    fireEvent.click(getByText('Connect'))
    await waitFor(() => expect(push).toHaveBeenCalled())
    expect(push.mock.calls[0][0]).toContain('installations/select_target')
  })

  it('handles missing project id', async () => {
    useParams.mockReturnValue({})
    const { getByText } = render(<ConnectGitHub isGitHubConnected={false} />)
    fireEvent.click(getByText('Connect'))
    await waitFor(() => expect(push).toHaveBeenCalledWith('/projects'))
  })
})
