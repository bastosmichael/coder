import { createEmbeddedFiles, deleteAllEmbeddedFilesByEmbeddedBranchId } from '../db/queries/embedded-files-queries'
import { db } from '../db/db'
import { getUserId } from '../actions/auth/auth'
import { revalidatePath } from 'next/cache'

jest.mock('../db/db', () => {
  const dbMock: any = {
    insert: jest.fn(() => dbMock),
    delete: jest.fn(() => dbMock),
    where: jest.fn(() => dbMock),
    values: jest.fn(() => dbMock),
    returning: jest.fn()
  }
  return { db: dbMock }
})

jest.mock('../actions/auth/auth', () => ({ getUserId: jest.fn() }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

describe('embedded files queries', () => {
  beforeEach(() => jest.clearAllMocks())

  it('creates embedded files', async () => {
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    ;(db.insert as jest.Mock).mockResolvedValue(['r'])
    const res = await createEmbeddedFiles([{ embeddedBranchId: 'b', filePath: 'f' }] as any)
    expect(db.insert).toHaveBeenCalled()
    expect(db.values).toHaveBeenCalledWith([{ embeddedBranchId: 'b', filePath: 'f', userId: 'u' }])
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(res).toEqual(['r'])
  })

  it('deletes files by branch id', async () => {
    await deleteAllEmbeddedFilesByEmbeddedBranchId('b')
    expect(db.delete).toHaveBeenCalled()
    expect(db.where).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})
