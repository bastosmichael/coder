import { db } from '../../db/db'
import { getUserId } from '../../actions/auth/auth'
import { revalidatePath } from 'next/cache'

jest.mock('../../actions/github/list-repos', () => ({ listRepos: jest.fn() }))
jest.mock('../../actions/github/list-branches', () => ({ listBranches: jest.fn() }))
jest.mock('../../app/api/auth/callback/github/api', () => ({ fetchGitHubRepoIssues: jest.fn(() => []) }))

jest.mock('../../db/db', () => {
  const dbMock: any = {
    insert: jest.fn(() => dbMock),
    update: jest.fn(() => dbMock),
    delete: jest.fn(() => dbMock),
    set: jest.fn(() => dbMock),
    values: jest.fn(() => dbMock),
    where: jest.fn(() => dbMock),
    returning: jest.fn(),
    select: jest.fn(() => dbMock),
    from: jest.fn(() => dbMock),
    innerJoin: jest.fn(() => dbMock),
    orderBy: jest.fn(() => dbMock),
    limit: jest.fn(),
    query: {
      projects: {
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
const findFirstMock = db.query.projects.findFirst as jest.Mock
const findManyMock = db.query.projects.findMany as jest.Mock
const selectMock = db.select as jest.Mock
const limitMock = db.limit as jest.Mock

const queries = require('../../db/queries/projects-queries')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('projects queries', () => {
  it('creates a project and updates workspace', async () => {
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    returningMock.mockResolvedValue([{ id: 'p', workspaceId: 'w' }])
    const res = await queries.createProject({ name: 'N', workspaceId: 'w' } as any)
    expect(insertMock).toHaveBeenCalled()
    expect(valuesMock).toHaveBeenCalledWith({ name: 'N', workspaceId: 'w', userId: 'u' })
    expect(updateMock).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(res).toEqual({ id: 'p', workspaceId: 'w' })
  })

  it('returns existing project when repo already linked', async () => {
    findFirstMock.mockResolvedValueOnce({ id: 'x' })
    const res = await queries.createProject({
      name: 'N',
      workspaceId: 'w',
      githubRepoFullName: 'r'
    } as any)
    expect(res).toEqual({ id: 'x' })
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('gets project by id', async () => {
    findFirstMock.mockResolvedValue({ id: '1' })
    const res = await queries.getProjectById('1')
    expect(findFirstMock).toHaveBeenCalled()
    expect(res).toEqual({ id: '1' })
  })

  it('gets projects by workspace', async () => {
    findManyMock.mockResolvedValue(['p'])
    const res = await queries.getProjectsByWorkspaceId('w')
    expect(findManyMock).toHaveBeenCalled()
    expect(res).toEqual(['p'])
  })

  it('finds project by repo', async () => {
    findFirstMock.mockResolvedValue({ id: 'p' })
    const res = await queries.findProjectByRepo('w', 'repo')
    expect(findFirstMock).toHaveBeenCalled()
    expect(res).toEqual({ id: 'p' })
  })

  it('updates a project', async () => {
    findFirstMock.mockResolvedValueOnce({ id: '1', workspaceId: 'w' })
    await queries.updateProject('1', { name: 'n' } as any)
    expect(updateMock).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('throws when update target missing', async () => {
    findFirstMock.mockResolvedValueOnce(undefined)
    await expect(queries.updateProject('x', {})).rejects.toThrow('Project with id x not found')
  })

  it('deletes a project', async () => {
    findFirstMock.mockResolvedValueOnce({ id: '1', workspaceId: 'w' })
    await queries.deleteProject('1')
    expect(deleteMock).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('gets most recent issue within projects', async () => {
    selectMock.mockReturnValue(db)
    ;(db.from as jest.Mock).mockReturnValue(db)
    ;(db.innerJoin as jest.Mock).mockReturnValue(db)
    ;(db.where as jest.Mock).mockReturnValue(db)
    ;(db.orderBy as jest.Mock).mockReturnValue(db)
    limitMock.mockResolvedValue([{ projectId: 'p' }])

    const res = await queries.getMostRecentIssueWithinProjects('w')
    expect(selectMock).toHaveBeenCalled()
    expect(res).toEqual({ projectId: 'p' })
  })
})
