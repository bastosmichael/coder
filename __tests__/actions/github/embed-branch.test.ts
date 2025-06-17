import { embedBranch } from '../../actions/github/embed-branch'
import { fetchFiles } from '../../actions/github/fetch-files'
import { createEmbeddedFiles, deleteAllEmbeddedFilesByEmbeddedBranchId } from '../../db/queries/embedded-files-queries'
import { embedFiles } from '../../actions/github/embed-files'
import { fetchCodebaseForBranch } from '../../actions/github/fetch-codebase'
import { tokenizeFiles } from '../../actions/github/tokenize-files'

jest.mock('../../actions/github/fetch-files', () => ({ fetchFiles: jest.fn() }))
jest.mock('../../db/queries/embedded-files-queries', () => ({
  createEmbeddedFiles: jest.fn(),
  deleteAllEmbeddedFilesByEmbeddedBranchId: jest.fn()
}))
jest.mock('../../actions/github/embed-files', () => ({ embedFiles: jest.fn() }))
jest.mock('../../actions/github/fetch-codebase', () => ({ fetchCodebaseForBranch: jest.fn() }))
jest.mock('../../actions/github/tokenize-files', () => ({ tokenizeFiles: jest.fn() }))
jest.mock('../../lib/constants/ephemyral-coder-config', () => ({ MAX_RETRY_ATTEMPTS: 2, RETRY_DELAY: 1 }))

describe('embedBranch', () => {
  beforeEach(() => jest.clearAllMocks())

  it('embeds branch and retries insert', async () => {
    ;(fetchCodebaseForBranch as jest.Mock).mockResolvedValue(['file'])
    ;(fetchFiles as jest.Mock).mockResolvedValue([{ path: 'p', content: 'c' }])
    ;(tokenizeFiles as jest.Mock).mockResolvedValue([{ path: 'p', content: 'c' }])
    ;(embedFiles as jest.Mock).mockResolvedValue([{ path: 'p', content: 'c' }])
    ;(createEmbeddedFiles as jest.Mock)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(undefined)

    jest.useFakeTimers()
    const promise = embedBranch({
      projectId: 'p',
      githubRepoFullName: 'r',
      branchName: 'b',
      embeddedBranchId: 'e',
      installationId: 1
    })
    jest.runAllTimers()
    await promise
    expect(deleteAllEmbeddedFilesByEmbeddedBranchId).toHaveBeenCalledWith('e')
    expect(createEmbeddedFiles).toHaveBeenCalledTimes(2)
    jest.useRealTimers()
  })
})
