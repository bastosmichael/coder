import { createProfile, getProfileByUserId, updateProfile } from '../../db/queries/profiles-queries'

jest.mock('../../db/db', () => ({
  db: {
    insert: jest.fn(() => ({ values: jest.fn(() => ({ returning: jest.fn(async () => [{ id: 'p' }]) })) })),
    update: jest.fn(() => ({ set: jest.fn(() => ({ where: jest.fn(() => ({ returning: jest.fn(async () => [{ id: 'u' }]) })) })) })),
    query: { profiles: { findFirst: jest.fn(async () => ({ id: 'p' })) } }
  }
}))

jest.mock('../../actions/auth/auth', () => ({ getUserId: () => Promise.resolve('u') }))
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

import { db } from '../../db/db'
import { revalidatePath } from 'next/cache'

const insertMock = (db.insert as jest.Mock)
const updateMock = (db.update as jest.Mock)
const findFirstMock = (db.query.profiles.findFirst as jest.Mock)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('profiles queries', () => {
  it('creates profile and returns result', async () => {
    const profile = await createProfile({ name: 'n' })
    expect(insertMock).toHaveBeenCalled()
    expect(profile).toEqual({ id: 'p' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('gets profile by user id', async () => {
    const result = await getProfileByUserId()
    expect(findFirstMock).toHaveBeenCalled()
    expect(result).toEqual({ id: 'p' })
  })

  it('updates profile', async () => {
    const profile = await updateProfile({ name: 'x' })
    expect(updateMock).toHaveBeenCalled()
    expect(profile).toEqual({ id: 'u' })
    expect(revalidatePath).toHaveBeenCalledWith('/')
  })
})
