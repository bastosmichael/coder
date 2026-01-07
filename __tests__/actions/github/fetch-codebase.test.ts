jest.mock('../../../actions/github/auth', () => ({ getAuthenticatedOctokit: jest.fn() }))

import { fetchCodebaseForBranch, fetchWithRetry } from '../../../actions/github/fetch-codebase'

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  ;(console.warn as jest.Mock).mockRestore()
})

describe('fetchWithRetry', () => {
  it('retries when hitting secondary rate limit', async () => {
    jest.useFakeTimers()
    const octokit = { repos: { getContent: jest.fn() } } as any
    const error = { status: 403, message: 'secondary rate limit' }
    octokit.repos.getContent.mockRejectedValueOnce(error)
    octokit.repos.getContent.mockResolvedValue({ success: true })

    const promise = fetchWithRetry(octokit as any, {})
    await jest.runOnlyPendingTimersAsync()
    const result = await promise
    expect(result).toEqual({ success: true })
    expect(octokit.repos.getContent).toHaveBeenCalledTimes(2)
    jest.useRealTimers()
  })
})
import { getAuthenticatedOctokit } from '../../../actions/github/auth'

describe('fetchCodebaseForBranch', () => {
  const mockOctokit = { repos: { getContent: jest.fn() } }
  const baseParams = { githubRepoFullName: 'o/r', path: '', branch: 'main' }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(getAuthenticatedOctokit as jest.Mock).mockResolvedValue(mockOctokit)
  })

  it('returns files from nested directories', async () => {
    mockOctokit.repos.getContent
      .mockResolvedValueOnce({ data: [
        { type: 'file', name: 'a.ts', path: 'a.ts' },
        { type: 'dir', name: 'sub', path: 'sub' }
      ] })
      .mockResolvedValueOnce({ data: [
        { type: 'file', name: 'b.ts', path: 'sub/b.ts' }
      ] })

    const result = await fetchCodebaseForBranch(baseParams)
    expect(result).toEqual([
      { type: 'file', name: 'a.ts', path: 'a.ts', owner: 'o', repo: 'r', ref: 'main' },
      { type: 'file', name: 'b.ts', path: 'sub/b.ts', owner: 'o', repo: 'r', ref: 'main' }
    ])
  })

  it('throws on nested fetch error', async () => {
    const error = new Error('fail')
    mockOctokit.repos.getContent
      .mockResolvedValueOnce({ data: [
        { type: 'dir', name: 'sub', path: 'sub' }
      ] })
      .mockRejectedValueOnce(error)

    await expect(fetchCodebaseForBranch(baseParams)).rejects.toThrow('fail')
  })
})
