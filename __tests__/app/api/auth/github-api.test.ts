var listForAuthUser: jest.Mock

jest.mock('@octokit/rest', () => {
  listForAuthUser = jest.fn()
  return {
    __esModule: true,
    Octokit: jest.fn().mockImplementation(() => ({
      orgs: { listForAuthenticatedUser: listForAuthUser }
    }))
  }
})

import {
  fetchGitHubOrganizations,
  clearGitHubApiCache
} from '../../../../app/api/auth/callback/github/api'

describe('fetchGitHubOrganizations', () => {
  beforeEach(() => {
    listForAuthUser.mockReset()
    clearGitHubApiCache()
  })

  it('returns organization list', async () => {
    listForAuthUser.mockResolvedValue({ data: [{ id: 1 }] })
    const data = await fetchGitHubOrganizations()
    expect(listForAuthUser).toHaveBeenCalled()
    expect(data).toEqual([{ id: 1 }])
  })

  it('throws after retries', async () => {
    listForAuthUser.mockRejectedValue(new Error('fail'))
    await expect(fetchGitHubOrganizations()).rejects.toThrow('Failed to fetch GitHub organizations')
    expect(listForAuthUser).toHaveBeenCalledTimes(3)
  })
})
