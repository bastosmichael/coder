import { addInstructionToTemplate, removeInstructionFromTemplate, getInstructionsForTemplate } from '../../db/queries/templates-to-instructions-queries'
import { db } from '../../db/db'
import { revalidatePath } from 'next/cache'

jest.mock('../../db/db', () => {
  const dbMock: any = {
    insert: jest.fn(() => dbMock),
    delete: jest.fn(() => dbMock),
    values: jest.fn(() => dbMock),
    where: jest.fn(() => dbMock),
    query: { templatesToInstructions: { findMany: jest.fn() } }
  }
  return { db: dbMock }
})

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

describe('templates-to-instructions queries', () => {
  beforeEach(() => jest.clearAllMocks())

  it('adds instruction to template', async () => {
    await addInstructionToTemplate('t', 'i')
    expect(db.insert).toHaveBeenCalled()
    expect(db.values).toHaveBeenCalledWith({ templateId: 't', instructionId: 'i' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('removes instruction from template', async () => {
    await removeInstructionFromTemplate('t', 'i')
    expect(db.delete).toHaveBeenCalled()
    expect(db.where).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('gets instructions for template', async () => {
    ;(db.query.templatesToInstructions.findMany as jest.Mock).mockResolvedValue(['res'])
    const result = await getInstructionsForTemplate('t')
    expect(db.query.templatesToInstructions.findMany).toHaveBeenCalled()
    expect(result).toEqual(['res'])
  })
})
