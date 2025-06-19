import {
  createTemplateRecords,
  getTemplateById,
  getTemplatesWithInstructionsByProjectId,
  getTemplateWithInstructionById,
  updateTemplate,
  deleteTemplate
} from '../../db/queries/templates-queries'
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
      templates: {
        findFirst: jest.fn(),
        findMany: jest.fn()
      }
    }
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
const findFirstMock = db.query.templates.findFirst as jest.Mock
const findManyMock = db.query.templates.findMany as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

describe('templates queries', () => {
  it('creates template records', async () => {
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    returningMock.mockResolvedValue(['r'])
    const res = await createTemplateRecords([{ projectId: 'p', name: 'n' } as any])
    expect(insertMock).toHaveBeenCalled()
    expect(valuesMock).toHaveBeenCalledWith([{ projectId: 'p', name: 'n', userId: 'u' }])
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(res).toEqual(['r'])
  })

  it('gets template by id', async () => {
    findFirstMock.mockResolvedValue({ id: '1' })
    const res = await getTemplateById('1')
    expect(findFirstMock).toHaveBeenCalled()
    expect(res).toEqual({ id: '1' })
  })

  it('gets templates with instructions by project id', async () => {
    findManyMock.mockResolvedValue(['t'])
    const res = await getTemplatesWithInstructionsByProjectId('p')
    expect(findManyMock).toHaveBeenCalled()
    expect(res).toEqual(['t'])
  })

  it('gets template with instruction by id', async () => {
    findFirstMock.mockResolvedValue({ id: '1' })
    const res = await getTemplateWithInstructionById('1')
    expect(findFirstMock).toHaveBeenCalled()
    expect(res).toEqual({ id: '1' })
  })

  it('updates a template', async () => {
    await updateTemplate('1', { name: 'n' } as any, 'p')
    expect(updateMock).toHaveBeenCalled()
    expect(db.set).toHaveBeenCalledWith({ name: 'n', projectId: 'p' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('deletes a template', async () => {
    await deleteTemplate('1')
    expect(deleteMock).toHaveBeenCalled()
    expect(db.where).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})
