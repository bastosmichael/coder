var getAuthUser: jest.Mock
var getRepos: jest.Mock
var listIssues: jest.Mock
var listPulls: jest.Mock

jest.mock('@octokit/rest', () => {
  getAuthUser = jest.fn()
  getRepos = jest.fn()
  listIssues = jest.fn()
  listPulls = jest.fn()
  return {
    __esModule: true,
    Octokit: jest.fn().mockImplementation(() => ({
      users: { getAuthenticated: getAuthUser },
      repos: { listForOrg: getRepos },
      issues: { listForRepo: listIssues },
      pulls: { list: listPulls }
    }))
  }
})

global.fetch = jest.fn()

import {
  fetchUserGitHubAccount,
  fetchGitHubRepositories,
  fetchGitHubRepoIssues,
  fetchOpenGitHubRepoIssues,
  fetchOpenGitHubRepoPullRequests
} from '../../../../app/api/auth/callback/github/api'

describe('github api helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches user account and retries', async () => {
    getAuthUser.mockRejectedValueOnce(new Error('fail'))
    getAuthUser.mockResolvedValue({ data: { id: 1, login: 'u' } })
    const data = await fetchUserGitHubAccount()
    expect(getAuthUser).toHaveBeenCalledTimes(2)
    expect(data).toEqual({ id: 1, login: 'u' })
  })

  it('fetches repositories', async () => {
    getRepos.mockResolvedValue({ data: [{ id: 1 }] })
    const repos = await fetchGitHubRepositories('org')
    expect(getRepos).toHaveBeenCalledWith({ org: 'org' })
    expect(repos).toEqual([{ id: 1 }])
  })

  it('fetches repo issues', async () => {
    listIssues.mockResolvedValue({ data: [{ id: 3 }, { id: 4, pull_request: {} }] })
    const issues = await fetchGitHubRepoIssues('o/r')
    expect(listIssues).toHaveBeenCalledWith({ owner: 'o', repo: 'r' })
    expect(issues).toEqual([{ id: 3 }])
  })

  it('filters open issues only', async () => {
    listIssues.mockResolvedValue({ data: [{ id: 1 }, { id: 2, pull_request: {} }] })
    const data = await fetchOpenGitHubRepoIssues('o/r')
    expect(data).toEqual([{ id: 1 }])
  })

  it('fetches open pull requests', async () => {
    listPulls.mockResolvedValue({ data: [{ id: 5 }] })
    const prs = await fetchOpenGitHubRepoPullRequests('o/r')
    expect(listPulls).toHaveBeenCalledWith({ owner: 'o', repo: 'r', state: 'open' })
    expect(prs).toEqual([{ id: 5 }])
  })
})
