import * as queries from '../../db/queries/issues-queries'
import { db } from '../../db/db'
import { getUserId } from '../../actions/auth/auth'
import { revalidatePath } from 'next/cache'
import { fetchGitHubRepoIssues } from '../../app/api/auth/callback/github/api'
import { getProjectById } from '../../db/queries/projects-queries'

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
      issues: {
        findMany: jest.fn(),
        findFirst: jest.fn()
      }
    }
  }
  return { db: dbMock }
})

jest.mock('../../actions/auth/auth', () => ({ getUserId: jest.fn() }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))
jest.mock('../../app/api/auth/callback/github/api', () => ({
  fetchGitHubRepoIssues: jest.fn()
}))
jest.mock('../../db/queries/projects-queries', () => ({
  getProjectById: jest.fn()
}))

describe('issues queries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates an issue', async () => {
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    ;(db.returning as jest.Mock).mockResolvedValue([{ id: '1', projectId: 'p' }])
    const issue = await queries.createIssue({ projectId: 'p', name: 'N', content: 'C' } as any)
    expect(db.insert).toHaveBeenCalled()
    expect(db.values).toHaveBeenCalledWith({ projectId: 'p', name: 'N', content: 'C', userId: 'u' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(issue).toEqual({ id: '1', projectId: 'p' })
  })

  it('gets issues by project id', async () => {
    ;(db.query.issues.findMany as jest.Mock).mockResolvedValue(['a'])
    const result = await queries.getIssuesByProjectId('p')
    expect(db.query.issues.findMany).toHaveBeenCalled()
    expect(result).toEqual(['a'])
  })

  it('gets issue by id', async () => {
    ;(db.query.issues.findFirst as jest.Mock).mockResolvedValue({ id: '1' })
    const result = await queries.getIssueById('1')
    expect(db.query.issues.findFirst).toHaveBeenCalled()
    expect(result).toEqual({ id: '1' })
  })

  it('updates an issue', async () => {
    ;(db.returning as jest.Mock).mockResolvedValue([{ id: '1', projectId: 'p' }])
    const result = await queries.updateIssue('1', { name: 'new' } as any)
    expect(db.update).toHaveBeenCalled()
    expect(db.set).toHaveBeenCalledWith({ name: 'new' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(result).toEqual({ id: '1', projectId: 'p' })
  })

  it('throws on empty update', async () => {
    await expect(queries.updateIssue('1', {})).rejects.toThrow('No fields provided to update')
  })

  it('deletes an issue', async () => {
    ;(db.query.issues.findFirst as jest.Mock).mockResolvedValue({ id: '1', projectId: 'p' })
    await queries.deleteIssue('1')
    expect(db.delete).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('throws when delete target missing', async () => {
    ;(db.query.issues.findFirst as jest.Mock).mockResolvedValue(undefined)
    await expect(queries.deleteIssue('x')).rejects.toThrow('Issue with id x not found')
  })

  it('updates issues from github', async () => {
    ;(getProjectById as jest.Mock).mockResolvedValue({ githubRepoFullName: 'o/r' })
    ;(fetchGitHubRepoIssues as jest.Mock).mockResolvedValue([{ title: 'A', body: 'b' }])
    ;(db.query.issues.findMany as jest.Mock).mockResolvedValue([])
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    ;(db.returning as jest.Mock).mockResolvedValue([{ id: '1' }])

    const res = await queries.updateIssuesFromGitHub('p')
    expect(fetchGitHubRepoIssues).toHaveBeenCalledWith('o/r')
    expect(db.insert).toHaveBeenCalled()
    expect(res).toEqual([{ id: '1' }])
  })
})
