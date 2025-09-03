var mockGetAuthUser: jest.Mock
var mockGetRepos: jest.Mock
var mockCreateRepo: jest.Mock
var mockListIssues: jest.Mock
var mockListPulls: jest.Mock
var mockAuth: jest.Mock

jest.mock('@octokit/rest', () => {
  mockGetAuthUser = jest.fn()
  mockGetRepos = jest.fn()
  mockCreateRepo = jest.fn()
  mockListIssues = jest.fn()
  mockListPulls = jest.fn()
  mockAuth = jest.fn()
  return {
    __esModule: true,
    Octokit: jest.fn().mockImplementation(() => ({
      users: { getAuthenticated: mockGetAuthUser },
      repos: { listForOrg: mockGetRepos, createInOrg: mockCreateRepo },
      issues: { listForRepo: mockListIssues },
      pulls: { list: mockListPulls },
      auth: mockAuth
    }))
  }
})

global.fetch = jest.fn()

import {
  fetchUserGitHubAccount,
  fetchGitHubRepositories,
  createGitHubRepository,
  fetchGitHubRepoIssues,
  fetchOpenGitHubRepoIssues,
  fetchOpenGitHubRepoPullRequests,
  getGitHubAccessToken
} from '../../../../app/api/auth/callback/github/api'

describe('github api helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches user account and retries', async () => {
    mockGetAuthUser.mockRejectedValueOnce(new Error('fail'))
    mockGetAuthUser.mockResolvedValue({ data: { id: 1, login: 'u' } })
    const data = await fetchUserGitHubAccount()
    expect(mockGetAuthUser).toHaveBeenCalledTimes(2)
    expect(data).toEqual({ id: 1, login: 'u' })
  })

  it('fetches repositories', async () => {
    mockGetRepos.mockResolvedValue({ data: [{ id: 1 }] })
    const repos = await fetchGitHubRepositories('org')
    expect(mockGetRepos).toHaveBeenCalledWith({ org: 'org' })
    expect(repos).toEqual([{ id: 1 }])
  })

  it('creates repository and returns data', async () => {
    mockCreateRepo.mockResolvedValue({ data: { id: 2 } })
    const repo = await createGitHubRepository('org', 'name', 't')
    expect(mockCreateRepo).toHaveBeenCalledWith({ org: 'org', name: 'name', private: true })
    expect(repo).toEqual({ id: 2 })
  })

  it('fetches repo issues', async () => {
    mockListIssues.mockResolvedValue({ data: [{ id: 3 }, { id: 4, pull_request: {} }] })
    const issues = await fetchGitHubRepoIssues('o/r')
    expect(mockListIssues).toHaveBeenCalledWith({ owner: 'o', repo: 'r' })
    expect(issues).toEqual([{ id: 3 }])
  })

  it('filters open issues only', async () => {
    mockListIssues.mockResolvedValue({ data: [{ id: 1 }, { id: 2, pull_request: {} }] })
    const data = await fetchOpenGitHubRepoIssues('o/r')
    expect(data).toEqual([{ id: 1 }])
  })

  it('fetches open pull requests', async () => {
    mockListPulls.mockResolvedValue({ data: [{ id: 5 }] })
    const prs = await fetchOpenGitHubRepoPullRequests('o/r')
    expect(mockListPulls).toHaveBeenCalledWith({ owner: 'o', repo: 'r', state: 'open' })
    expect(prs).toEqual([{ id: 5 }])
  })

  it('obtains access token via fetch', async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ access_token: 'z' })
    })
    const token = await getGitHubAccessToken('c')
    expect(fetch).toHaveBeenCalled()
    expect(token).toBe('z')
  })
})
