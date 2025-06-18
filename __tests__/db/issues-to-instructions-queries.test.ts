import { addInstructionToIssue, removeInstructionFromIssue, getInstructionsForIssue } from '../../db/queries/issues-to-instructions-queries'
import { db } from '../../db/db'
import { revalidatePath } from 'next/cache'

jest.mock('../../db/db', () => {
  const dbMock: any = {
    insert: jest.fn(() => dbMock),
    delete: jest.fn(() => dbMock),
    where: jest.fn(() => dbMock),
    values: jest.fn(() => dbMock),
    query: { issuesToInstructions: { findMany: jest.fn() } }
  }
  return { db: dbMock }
})

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

describe('issues-to-instructions queries', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('adds instruction to issue', async () => {
    await addInstructionToIssue('i', 'ins')
    expect(db.insert).toHaveBeenCalled()
    expect(db.values).toHaveBeenCalledWith({ issueId: 'i', instructionId: 'ins' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('removes instruction from issue', async () => {
    await removeInstructionFromIssue('i', 'ins')
    expect(db.delete).toHaveBeenCalled()
    expect(db.where).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('gets instructions for issue', async () => {
    ;(db.query.issuesToInstructions.findMany as jest.Mock).mockResolvedValue(['a'])
    const result = await getInstructionsForIssue('i')
    expect(db.query.issuesToInstructions.findMany).toHaveBeenCalled()
    expect(result).toEqual(['a'])
  })
})
