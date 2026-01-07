import { generatePR } from '../../../actions/github/generate-pr'
import { getAuthenticatedOctokit } from '../../../actions/github/auth'

jest.mock('../../../actions/github/auth', () => ({ getAuthenticatedOctokit: jest.fn() }))

describe('generatePR', () => {
  const project = { githubRepoFullName: 'o/r', githubTargetBranch: 'main' } as any
  const mockOctokit = {
    git: {
      getRef: jest.fn(),
      createRef: jest.fn(),
      createTree: jest.fn(),
      createCommit: jest.fn(),
      updateRef: jest.fn()
    },
    repos: { getContent: jest.fn() },
    pulls: { create: jest.fn() }
  }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(getAuthenticatedOctokit as jest.Mock).mockResolvedValue(mockOctokit)
    mockOctokit.git.getRef.mockResolvedValue({ data: { object: { sha: 'base' } } })
    mockOctokit.git.createTree.mockResolvedValue({ data: { sha: 'tree' } })
    mockOctokit.git.createCommit.mockResolvedValue({ data: { sha: 'commit' } })
    mockOctokit.pulls.create.mockResolvedValue({ data: { html_url: 'url' } })
  })

  it('skips when no file changes', async () => {
    const result = await generatePR('b', project, { files: [], prTitle: '', prDescription: '' })
    expect(result).toEqual({ prLink: null, branchName: expect.any(String) })
    expect(mockOctokit.pulls.create).not.toHaveBeenCalled()
  })

  it('retries branch creation on 422', async () => {
    mockOctokit.git.createRef
      .mockRejectedValueOnce({ status: 422 })
      .mockResolvedValueOnce({})

    const files = [{ path: 'f', status: 'new', content: 'c' }]
    const result = await generatePR('b', project, { files, prTitle: 't', prDescription: 'd' })
    expect(mockOctokit.git.createRef).toHaveBeenCalledTimes(2)
    expect(mockOctokit.pulls.create).toHaveBeenCalled()
    expect(result.prLink).toBe('url')
  })
})
