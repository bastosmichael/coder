jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn() }))

let auth: jest.Mock

describe('getUserId', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    ;({ auth } = require('@clerk/nextjs/server'))
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns simple user id in simple mode', async () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'simple'
    const { getUserId } = await import('../../../actions/auth/auth')
    await expect(getUserId()).resolves.toBe('simple_user_1')
  })

  it('returns id from clerk when authenticated', async () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'complex'
    ;(auth as unknown as jest.Mock).mockReturnValue({ userId: 'abc' })
    const { getUserId } = await import('../../../actions/auth/auth')
    await expect(getUserId()).resolves.toBe('abc')
  })

  it('throws when no user is authenticated', async () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'complex'
    ;(auth as unknown as jest.Mock).mockReturnValue({ userId: null })
    const { getUserId } = await import('../../../actions/auth/auth')
    await expect(getUserId()).rejects.toThrow('User not authenticated')
  })
})
