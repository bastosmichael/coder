import { fetchWithRetry } from '../../../actions/github/fetch-codebase'

describe('fetchWithRetry', () => {
  it('retries when hitting secondary rate limit', async () => {
    jest.useFakeTimers()
    const octokit = { repos: { getContent: jest.fn() } } as any
    const error = { status: 403, message: 'secondary rate limit' }
    octokit.repos.getContent.mockRejectedValueOnce(error)
    octokit.repos.getContent.mockResolvedValue({ success: true })

    const promise = fetchWithRetry(octokit, {})
    jest.advanceTimersByTime(1000)
    const result = await promise
    expect(result).toEqual({ success: true })
    expect(octokit.repos.getContent).toHaveBeenCalledTimes(2)
    jest.useRealTimers()
  })
})
