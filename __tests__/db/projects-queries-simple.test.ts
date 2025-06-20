import { db } from '../../db/db'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder as any
global.TextDecoder = TextDecoder as any
import { getUserId } from '../../actions/auth/auth'
import { listRepos } from '../../actions/github/list-repos'
import { listBranches } from '../../actions/github/list-branches'
import { fetchGitHubRepoIssues } from '../../app/api/auth/callback/github/api'
import { addInstructionToTemplate } from '../../db/queries/templates-to-instructions-queries'
import { addInstructionToIssue } from '../../db/queries/issues-to-instructions-queries'

jest.mock('../../actions/github/list-repos', () => ({ listRepos: jest.fn() }))
jest.mock('../../actions/github/list-branches', () => ({ listBranches: jest.fn() }))
jest.mock('../../app/api/auth/callback/github/api', () => ({ fetchGitHubRepoIssues: jest.fn() }))
jest.mock('../../db/queries/templates-to-instructions-queries', () => ({ addInstructionToTemplate: jest.fn() }))
jest.mock('../../db/queries/issues-to-instructions-queries', () => ({ addInstructionToIssue: jest.fn() }))

jest.mock('../../db/db', () => {
  const dbMock: any = {
    insert: jest.fn(() => dbMock),
    update: jest.fn(() => dbMock),
    delete: jest.fn(() => dbMock),
    set: jest.fn(() => dbMock),
    values: jest.fn(() => dbMock),
    where: jest.fn(() => dbMock),
    returning: jest.fn(),
    query: { projects: { findFirst: jest.fn(), findMany: jest.fn() } }
  }
  return { db: dbMock }
})

jest.mock('../../actions/auth/auth', () => ({ getUserId: jest.fn() }))

describe('createProjects simple mode', () => {
  const queries = require('../../db/queries/projects-queries')
  const returning = db.returning as jest.Mock
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_APP_MODE = 'simple'
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    ;(console.error as jest.Mock).mockRestore()
  })

  it('creates project and sample data from repos', async () => {
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    ;(listRepos as jest.Mock).mockResolvedValue([{ id: 'r', name: 'repo', full_name: 'org/repo' }])
    ;(listBranches as jest.Mock).mockResolvedValue(['main'])
    ;(fetchGitHubRepoIssues as jest.Mock).mockResolvedValue([])

    returning
      .mockResolvedValueOnce([{ id: 'p', workspaceId: 'w' }]) // createProject
      .mockResolvedValueOnce([{ id: 'i' }]) // createSampleInstruction
      .mockResolvedValueOnce([{ id: 't' }]) // createSampleTemplate
    for (let i = 0; i < 5; i++) {
      returning.mockResolvedValueOnce([{ id: `iss${i}` }])
    }

    const res = await queries.createProjects([
      { id: 'w', githubOrganizationId: '1', githubOrganizationName: 'org' }
    ])

    expect(listRepos).toHaveBeenCalledWith(null, 'org')
    expect(listBranches).toHaveBeenCalledWith(null, 'org/repo')
    expect(addInstructionToTemplate).toHaveBeenCalledWith('t', 'i')
    expect(addInstructionToIssue).toHaveBeenCalledTimes(5)
    expect(res).toEqual([{ id: 'p', workspaceId: 'w' }])
  })
})
