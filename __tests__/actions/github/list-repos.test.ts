import { getAuthenticatedOctokit } from '../../../actions/github/auth'
import { listRepos } from '../../../actions/github/list-repos'

jest.mock('../../../actions/github/auth', () => ({ getAuthenticatedOctokit: jest.fn() }))

describe('listRepos', () => {
  const mockOctokit = {
    apps: { listReposAccessibleToInstallation: jest.fn() },
    request: jest.fn()
  }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(getAuthenticatedOctokit as jest.Mock).mockResolvedValue(mockOctokit)
  })

  it('lists repos using installation flow', async () => {
    const repo = {
      description: 'd',
      full_name: 'o/r',
      html_url: 'url',
      id: 1,
      name: 'r',
      private: false,
      updated_at: '2023-01-01'
    }
    mockOctokit.apps.listReposAccessibleToInstallation
      .mockResolvedValueOnce({ data: { repositories: [repo], length: 1 } })
      .mockResolvedValueOnce({ data: { repositories: [], length: 0 } })

    const result = await listRepos(1, null)
    expect(result).toEqual([
      {
        description: 'd',
        full_name: 'o/r',
        html_url: 'url',
        id: 1,
        name: 'r',
        private: false
      }
    ])
    expect(mockOctokit.apps.listReposAccessibleToInstallation).toHaveBeenCalled()
  })

  it('lists repos for user when no installation id', async () => {
    const repo = { full_name: 'o/r', html_url: 'url', id: 1, name: 'b', private: true, description: 'd', updated_at: '2023-01-01' }
    mockOctokit.request
      .mockResolvedValueOnce({ data: [repo], length: 1 })
      .mockResolvedValueOnce({ data: [], length: 0 })

    const result = await listRepos(null, null)
    expect(result).toEqual([
      {
        description: 'd',
        full_name: 'o/r',
        html_url: 'url',
        id: 1,
        name: 'b',
        private: true
      }
    ])
    expect(mockOctokit.request).toHaveBeenCalled()
  })
})
