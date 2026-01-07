import {
  createWorkspaces,
  createWorkspace,
  getWorkspaceById,
  getWorkspacesByUserId,
  updateWorkspace,
  deleteWorkspace
} from '../../db/queries/workspaces-queries'
import { db } from '../../db/db'
import { getUserId } from '../../actions/auth/auth'
import { revalidatePath } from 'next/cache'
import { fetchGitHubOrganizations, fetchUserGitHubAccount } from '../../app/api/auth/callback/github/api'

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
      workspaces: {
        findFirst: jest.fn(),
        findMany: jest.fn()
      }
    }
  }
  return { db: dbMock }
})

jest.mock('../../actions/auth/auth', () => ({ getUserId: jest.fn() }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))
jest.mock('../../app/api/auth/callback/github/api', () => ({
  fetchGitHubOrganizations: jest.fn(),
  fetchUserGitHubAccount: jest.fn()
}))

const insertMock = db.insert as jest.Mock
const updateMock = db.update as jest.Mock
const deleteMock = db.delete as jest.Mock
const valuesMock = db.values as jest.Mock
const returningMock = db.returning as jest.Mock
const findFirstMock = db.query.workspaces.findFirst as jest.Mock
const findManyMock = db.query.workspaces.findMany as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
})

describe('workspaces queries', () => {
  it('creates workspaces from GitHub organizations and user', async () => {
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    ;(fetchGitHubOrganizations as jest.Mock).mockResolvedValue([{ id: '1', login: 'org' }])
    ;(fetchUserGitHubAccount as jest.Mock).mockResolvedValue({ id: '2', login: 'me' })
    returningMock.mockResolvedValue([{ id: 'w' }])
    const res = await createWorkspaces({ name: 'n' } as any)
    expect(insertMock).toHaveBeenCalledTimes(2)
    expect(valuesMock).toHaveBeenCalledWith({ name: 'org', userId: 'u', githubOrganizationId: '1', githubOrganizationName: 'org' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(res).toEqual([{ id: 'w' }, { id: 'w' }])
  })

  it('creates single workspace', async () => {
    ;(getUserId as jest.Mock).mockResolvedValue('u')
    returningMock.mockResolvedValue([{ id: 'x' }])
    const res = await createWorkspace({ name: 'x' } as any)
    expect(insertMock).toHaveBeenCalled()
    expect(valuesMock).toHaveBeenCalledWith({ name: 'x', userId: 'u' })
    expect(res).toEqual({ id: 'x' })
  })

  it('gets workspace by id', async () => {
    findFirstMock.mockResolvedValue({ id: '1' })
    const res = await getWorkspaceById('1')
    expect(findFirstMock).toHaveBeenCalled()
    expect(res).toEqual({ id: '1' })
  })

  it('gets workspaces by user id', async () => {
    findManyMock.mockResolvedValue(['w'])
    const res = await getWorkspacesByUserId()
    expect(findManyMock).toHaveBeenCalled()
    expect(res).toEqual(['w'])
  })

  it('updates workspace', async () => {
    await updateWorkspace('1', { name: 'n' })
    expect(updateMock).toHaveBeenCalled()
    expect(db.set).toHaveBeenCalledWith({ name: 'n' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('deletes workspace', async () => {
    await deleteWorkspace('1')
    expect(deleteMock).toHaveBeenCalled()
    expect(db.where).toHaveBeenCalled()
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})
