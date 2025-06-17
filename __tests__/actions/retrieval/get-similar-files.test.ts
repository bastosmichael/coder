import { getMostSimilarEmbeddedFiles } from '../../../actions/retrieval/get-similar-files'
import { generateEmbedding } from '../../../actions/ai/generate-openai-embedding'
import { db } from '../../../db/db'
import { getProjectById } from '../../../db/queries'

jest.mock('../../../actions/ai/generate-openai-embedding', () => ({ generateEmbedding: jest.fn() }))
jest.mock('../../../db/db', () => ({
  db: {
    query: { embeddedBranches: { findFirst: jest.fn() } },
    select: jest.fn(() => ({
      from: () => ({
        where: () => ({
          orderBy: () => Promise.resolve([])
        })
      })
    }))
  }
}))
jest.mock('../../../db/queries', () => ({ getProjectById: jest.fn() }))

describe('getMostSimilarEmbeddedFiles', () => {
  it('throws when project missing', async () => {
    ;(getProjectById as jest.Mock).mockResolvedValue(undefined)
    await expect(getMostSimilarEmbeddedFiles('t','1')).rejects.toThrow('Project not found')
  })

  it('filters files by token limit', async () => {
    ;(getProjectById as jest.Mock).mockResolvedValue({ githubTargetBranch: 'main' })
    ;(db.query.embeddedBranches.findFirst as jest.Mock).mockResolvedValue({ id: 'b', projectId: '1', branchName: 'main' })
    ;(generateEmbedding as jest.Mock).mockResolvedValue([0,0,0])
    ;(db.select as jest.Mock).mockReturnValue({
      from: () => ({
        where: () => ({
          orderBy: () => Promise.resolve([
            { id:'1', tokenCount: 50 },
            { id:'2', tokenCount: 200000 }
          ])
        })
      })
    })

    const result = await getMostSimilarEmbeddedFiles('t','1')
    expect(result).toEqual([{ id:'1', tokenCount: 50 }])
  })
})
