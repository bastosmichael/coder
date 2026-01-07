import { embedTargetBranch } from '../../../actions/github/embed-target-branch'
import { embedBranch } from '../../../actions/github/embed-branch'
import {
  createEmbeddedBranch,
  findEmbeddedBranch,
  updateEmbeddedBranchById
} from '../../../db/queries/embedded-branches-queries'
import { getAuthenticatedOctokit } from '../../../actions/github/auth'

jest.mock('../../../actions/github/embed-branch', () => ({ embedBranch: jest.fn() }))
jest.mock('../../../db/queries/embedded-branches-queries', () => ({
  createEmbeddedBranch: jest.fn(),
  findEmbeddedBranch: jest.fn(),
  updateEmbeddedBranchById: jest.fn()
}))
jest.mock('../../../actions/github/auth', () => ({ getAuthenticatedOctokit: jest.fn() }))

describe('embedTargetBranch', () => {
  const mockOctokit = {
    repos: {
      getBranch: jest.fn()
    }
  }

  const baseParams = {
    projectId: 'p',
    githubRepoFullName: 'o/r',
    branchName: 'main'
  }

  beforeEach(() => {
    jest.resetAllMocks()
    ;(getAuthenticatedOctokit as jest.Mock).mockResolvedValue(mockOctokit)
    mockOctokit.repos.getBranch.mockResolvedValue({ data: { commit: { sha: 'sha1' } } })
  })

  it('creates and embeds new branch when none exists', async () => {
    ;(findEmbeddedBranch as jest.Mock).mockResolvedValue(undefined)
    ;(createEmbeddedBranch as jest.Mock).mockResolvedValue({ id: '1', lastEmbeddedCommitHash: null })

    const result = await embedTargetBranch(baseParams)
    expect(createEmbeddedBranch).toHaveBeenCalled()
    expect(embedBranch).toHaveBeenCalled()
    expect(updateEmbeddedBranchById).toHaveBeenCalledWith('1', { lastEmbeddedCommitHash: 'sha1' })
    expect(result).toEqual({ id: '1', lastEmbeddedCommitHash: null })
  })

  it('returns existing branch when up to date', async () => {
    const existing = { id: '2', lastEmbeddedCommitHash: 'sha1' }
    ;(findEmbeddedBranch as jest.Mock).mockResolvedValue(existing)

    const result = await embedTargetBranch(baseParams)
    expect(createEmbeddedBranch).not.toHaveBeenCalled()
    expect(embedBranch).not.toHaveBeenCalled()
    expect(updateEmbeddedBranchById).not.toHaveBeenCalled()
    expect(result).toBe(existing)
  })
})
