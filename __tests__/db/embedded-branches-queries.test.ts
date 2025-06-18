import {
  createEmbeddedBranch,
  getEmbeddedBranchesByProjectId,
  getEmbeddedBranchById,
  updateEmbeddedBranchById,
  findEmbeddedBranch
} from '../../db/queries/embedded-branches-queries'
import { db } from '../../db/db'
import { getUserId } from '../../actions/auth/auth'
import { revalidatePath } from 'next/cache'

jest.mock('../../db/db', () => {
  const dbMock: any = {
    insert: jest.fn(() => dbMock),
    update: jest.fn(() => dbMock),
    delete: jest.fn(() => dbMock),
    set: jest.fn(() => dbMock),
    values: jest.fn(() => dbMock),
    where: jest.fn(() => dbMock),
    returning: jest.fn(),
    query: {
      embeddedBranches: {
        findMany: jest.fn(),
        findFirst: jest.fn()
      }
    }
  }
  return { db: dbMock }
})

jest.mock('../../actions/auth/auth', () => ({ getUserId: jest.fn() }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

describe('embedded branches queries', () => {
  beforeEach(() => jest.clearAllMocks())

  it('creates an embedded branch', async () => {
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    ;(db.returning as jest.Mock).mockResolvedValue([{ id: '1' }])
    const res = await createEmbeddedBranch({ projectId: 'p' } as any)
    expect(db.insert).toHaveBeenCalled()
    expect(db.values).toHaveBeenCalledWith({ projectId: 'p', userId: 'u' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(res).toEqual({ id: '1' })
  })

  it('gets embedded branches by project id', async () => {
    ;(db.query.embeddedBranches.findMany as jest.Mock).mockResolvedValue(['b'])
    const res = await getEmbeddedBranchesByProjectId('p')
    expect(db.query.embeddedBranches.findMany).toHaveBeenCalled()
    expect(res).toEqual(['b'])
  })

  it('gets embedded branch by id', async () => {
    ;(db.query.embeddedBranches.findFirst as jest.Mock).mockResolvedValue({ id: '1' })
    const res = await getEmbeddedBranchById('1')
    expect(db.query.embeddedBranches.findFirst).toHaveBeenCalled()
    expect(res).toEqual({ id: '1' })
  })

  it('updates embedded branch', async () => {
    ;(db.returning as jest.Mock).mockResolvedValue([{ id: '1' }])
    const res = await updateEmbeddedBranchById('1', { name: 'n' } as any)
    expect(db.update).toHaveBeenCalled()
    expect(db.set).toHaveBeenCalledWith({ name: 'n' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(res).toEqual({ id: '1' })
  })

  it('finds embedded branch', async () => {
    ;(db.query.embeddedBranches.findFirst as jest.Mock).mockResolvedValue({ id: '1' })
    const res = await findEmbeddedBranch({ projectId: 'p', githubRepoFullName: 'r', branchName: 'b' })
    expect(db.query.embeddedBranches.findFirst).toHaveBeenCalled()
    expect(res).toEqual({ id: '1' })
  })
})
