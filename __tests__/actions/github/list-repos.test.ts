import { getAuthenticatedOctokit } from '../../../actions/github/auth'
import { listRepos } from '../../../actions/github/list-repos'

jest.mock('../../../actions/github/auth', () => ({ getAuthenticatedOctokit: jest.fn() }))

describe('listRepos', () => {
  const mockOctokit = {
    request: jest.fn()
  }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(getAuthenticatedOctokit as jest.Mock).mockResolvedValue(mockOctokit)
  })

  it('lists repos for user', async () => {
    const repo = { full_name: 'o/r', html_url: 'url', id: 1, name: 'b', private: true, description: 'd', updated_at: '2023-01-01' }
    mockOctokit.request
      .mockResolvedValueOnce({ data: [repo], length: 1 })
      .mockResolvedValueOnce({ data: [], length: 0 })

    const result = await listRepos(null)
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
