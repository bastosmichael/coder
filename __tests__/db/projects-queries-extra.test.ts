import { db } from '../../db/db'
import { getUserId } from '../../actions/auth/auth'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill encoders and web primitives used by Next.js utilities
// @ts-ignore
global.TextEncoder = TextEncoder
// @ts-ignore
global.TextDecoder = TextDecoder
// @ts-ignore
global.Request = global.Request || class {}
// @ts-ignore
global.Response = global.Response || class {}
// @ts-ignore
global.Headers = global.Headers || class {}

jest.mock('../../actions/github/list-repos', () => ({ listRepos: jest.fn() }))
jest.mock('../../actions/github/list-branches', () => ({ listBranches: jest.fn() }))
jest.mock('../../app/api/auth/callback/github/api', () => ({ fetchGitHubRepoIssues: jest.fn(() => []) }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

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

const findManyMock = db.query.projects.findMany as jest.Mock

const queries = require('../../db/queries/projects-queries')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('projects queries additional', () => {
  it('gets projects by user id', async () => {
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    findManyMock.mockResolvedValue(['p'])
    const res = await queries.getProjectsByUserId()
    expect(findManyMock).toHaveBeenCalled()
    expect(res).toEqual(['p'])
  })

  it('gets all projects', async () => {
    findManyMock.mockResolvedValue(['a', 'b'])
    const res = await queries.getAllProjects()
    expect(findManyMock).toHaveBeenCalled()
    expect(res).toEqual(['a', 'b'])
  })

  it('creates projects for workspace without a repository', async () => {
    const workspace = { id: 'w', name: 'W' }
    findManyMock.mockResolvedValueOnce([])
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    ;(db.insert as jest.Mock).mockReturnValue(db)
    ;(db.values as jest.Mock).mockReturnValue(db)
    const returning = db.returning as jest.Mock
    returning.mockResolvedValue([{ id: 'p' }])

    const res = await queries.createProjects([workspace])

    expect(findManyMock).toHaveBeenCalled()
    expect(returning).toHaveBeenCalled()
    expect(res).toEqual([{ id: 'p' }])
  })
})
