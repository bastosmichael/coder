import { getAuthenticatedOctokit } from '../../../actions/github/auth'
import { listBranches } from '../../../actions/github/list-branches'

jest.mock('../../../actions/github/auth', () => ({ getAuthenticatedOctokit: jest.fn() }))

describe('listBranches', () => {
  const mockOctokit = { repos: { listBranches: jest.fn() } }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(getAuthenticatedOctokit as jest.Mock).mockResolvedValue(mockOctokit)
  })

  it('aggregates branches across pages', async () => {
    mockOctokit.repos.listBranches
      .mockResolvedValueOnce({ data: [{ name: 'main' }] })
      .mockResolvedValueOnce({ data: [{ name: 'dev' }] })
      .mockResolvedValueOnce({ data: [] })

    const result = await listBranches('owner/repo')
    expect(result).toEqual(['main', 'dev'])
    expect(mockOctokit.repos.listBranches).toHaveBeenCalledTimes(3)
  })

  it('returns empty array on error', async () => {
    mockOctokit.repos.listBranches.mockRejectedValue(new Error('fail'))
    const branches = await listBranches('owner/repo')
    expect(branches).toEqual([])
  })
})
