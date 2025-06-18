import {
  createIssueMessageRecord,
  getIssueMessageById,
  getIssueMessagesByIssueId,
  updateIssueMessage,
  deleteIssueMessage,
  deleteIssueMessagesByIssueId
} from '../../db/queries/issue-messages-queries'
import { db } from '../../db/db'
import { revalidatePath } from 'next/cache'

jest.mock('../../db/db', () => {
  const dbMock: any = {
    insert: jest.fn(() => dbMock),
    update: jest.fn(() => dbMock),
    delete: jest.fn(() => dbMock),
    set: jest.fn(() => dbMock),
    where: jest.fn(() => dbMock),
    values: jest.fn(() => dbMock),
    returning: jest.fn(),
    query: {
      issueMessages: {
        findMany: jest.fn(),
        findFirst: jest.fn()
      }
    }
  }
  return { db: dbMock }
})

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

describe('issue messages queries', () => {
  beforeEach(() => jest.clearAllMocks())

  it('creates issue message record', async () => {
    ;(db.returning as jest.Mock).mockResolvedValue([{ id: '1' }])
    const res = await createIssueMessageRecord({ text: 't' } as any)
    expect(db.insert).toHaveBeenCalled()
    expect(db.values).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(res).toEqual({ id: '1' })
  })

  it('gets message by id', async () => {
    ;(db.query.issueMessages.findFirst as jest.Mock).mockResolvedValue({ id: '1' })
    const res = await getIssueMessageById('1')
    expect(db.query.issueMessages.findFirst).toHaveBeenCalled()
    expect(res).toEqual({ id: '1' })
  })

  it('gets messages by issue id', async () => {
    ;(db.query.issueMessages.findMany as jest.Mock).mockResolvedValue(['m'])
    const res = await getIssueMessagesByIssueId('i')
    expect(db.query.issueMessages.findMany).toHaveBeenCalled()
    expect(res).toEqual(['m'])
  })

  it('updates message', async () => {
    await updateIssueMessage('1', { text: 'n' } as any)
    expect(db.update).toHaveBeenCalled()
    expect(db.set).toHaveBeenCalledWith({ text: 'n' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('deletes message', async () => {
    await deleteIssueMessage('1')
    expect(db.delete).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('deletes messages by issue id', async () => {
    await deleteIssueMessagesByIssueId('i')
    expect(db.delete).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})
