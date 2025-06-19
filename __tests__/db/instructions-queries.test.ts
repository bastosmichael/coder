import {
  createInstructionRecords,
  getInstructionById,
  getInstructionsByProjectId,
  updateInstruction,
  deleteInstruction,
} from '../../db/queries/instructions-queries'
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
      instructions: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    },
  }
  return { db: dbMock }
})

jest.mock('../../actions/auth/auth', () => ({ getUserId: jest.fn() }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

const insertMock = db.insert as jest.Mock
const updateMock = db.update as jest.Mock
const deleteMock = db.delete as jest.Mock
const valuesMock = db.values as jest.Mock
const returningMock = db.returning as jest.Mock
const findFirstMock = db.query.instructions.findFirst as jest.Mock
const findManyMock = db.query.instructions.findMany as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

describe('instructions queries', () => {
  it('creates instruction records', async () => {
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    returningMock.mockResolvedValue(['r'])
    const res = await createInstructionRecords([{ projectId: 'p', content: 'c' } as any])
    expect(insertMock).toHaveBeenCalled()
    expect(valuesMock).toHaveBeenCalledWith([{ projectId: 'p', content: 'c', userId: 'u' }])
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(res).toEqual(['r'])
  })

  it('gets instruction by id', async () => {
    findFirstMock.mockResolvedValue({ id: '1' })
    const res = await getInstructionById('1')
    expect(findFirstMock).toHaveBeenCalled()
    expect(res).toEqual({ id: '1' })
  })

  it('gets instructions by project id', async () => {
    findManyMock.mockResolvedValue(['i'])
    const res = await getInstructionsByProjectId('p')
    expect(findManyMock).toHaveBeenCalled()
    expect(res).toEqual(['i'])
  })

  it('updates an instruction', async () => {
    await updateInstruction('1', { content: 'c' })
    expect(updateMock).toHaveBeenCalled()
    expect(db.set).toHaveBeenCalledWith({ content: 'c' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('deletes an instruction', async () => {
    await deleteInstruction('1')
    expect(deleteMock).toHaveBeenCalled()
    expect(db.where).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})
