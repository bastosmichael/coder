import { deleteGitHubPR } from '../../../actions/github/delete-pr'
import { getAuthenticatedOctokit } from '../../../actions/github/auth'

jest.mock('../../../actions/github/auth', () => ({ getAuthenticatedOctokit: jest.fn() }))

describe('deleteGitHubPR', () => {
  const project = { githubInstallationId: 1, githubRepoFullName: 'owner/repo' } as any
  const mockOctokit = {
    pulls: { update: jest.fn() },
    git: { deleteRef: jest.fn() }
  }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(getAuthenticatedOctokit as jest.Mock).mockResolvedValue(mockOctokit)
  })

  it('closes the PR and deletes the branch', async () => {
    await deleteGitHubPR(project, 'https://github.com/owner/repo/pull/123', 'feature')
    expect(mockOctokit.pulls.update).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      pull_number: 123,
      state: 'closed'
    })
    expect(mockOctokit.git.deleteRef).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      ref: 'heads/feature'
    })
  })

  it('throws when pr link is invalid', async () => {
    await expect(deleteGitHubPR(project, 'bad-link', 'branch')).rejects.toThrow('Invalid PR link')
  })
})
