var mockListForAuthUser: jest.Mock

jest.mock('@octokit/rest', () => {
  mockListForAuthUser = jest.fn()
  return {
    __esModule: true,
    Octokit: jest.fn().mockImplementation(() => ({
      orgs: { listForAuthenticatedUser: mockListForAuthUser }
    }))
  }
})

import { fetchGitHubOrganizations } from '../../../../app/api/auth/callback/github/api'

describe('fetchGitHubOrganizations', () => {
  beforeEach(() => {
    mockListForAuthUser.mockReset()
  })

  it('returns organization list', async () => {
    mockListForAuthUser.mockResolvedValue({ data: [{ id: 1 }] })
    const data = await fetchGitHubOrganizations()
    expect(mockListForAuthUser).toHaveBeenCalled()
    expect(data).toEqual([{ id: 1 }])
  })

  it('throws after retries', async () => {
    mockListForAuthUser.mockRejectedValue(new Error('fail'))
    await expect(fetchGitHubOrganizations()).rejects.toThrow('Failed to fetch GitHub organizations')
    expect(mockListForAuthUser).toHaveBeenCalledTimes(3)
  })
})
