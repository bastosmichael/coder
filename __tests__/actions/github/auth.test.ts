jest.mock('@octokit/auth-app', () => ({ createAppAuth: jest.fn() }))
jest.mock('@octokit/rest', () => ({ Octokit: jest.fn().mockImplementation((args: any) => ({ args })) }))

let createAppAuth: jest.Mock
let Octokit: jest.Mock

const originalEnv = process.env

describe('getAuthenticatedOctokit', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    ;({ createAppAuth } = require('@octokit/auth-app'))
    ;({ Octokit } = require('@octokit/rest'))
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('uses PAT when in simple mode', async () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'simple'
    process.env.GITHUB_PAT = 'pat'
    const { getAuthenticatedOctokit } = await import('../../../actions/github/auth')
    const octokit = await getAuthenticatedOctokit(null)
    expect((Octokit as unknown as jest.Mock).mock.calls[0][0]).toEqual({ auth: 'pat' })
    expect((octokit as any).args).toEqual({ auth: 'pat' })
  })

  it('authenticates via app when installation id provided', async () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'advanced'
    process.env.NEXT_PUBLIC_GITHUB_APP_ID = '1'
    process.env.GITHUB_PRIVATE_KEY = 'k'
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID = 'cid'
    process.env.GITHUB_CLIENT_SECRET = 'sec'
    const tokenFn = jest.fn().mockResolvedValue({ token: 't' })
    ;(createAppAuth as unknown as jest.Mock).mockReturnValue(tokenFn)
    const { getAuthenticatedOctokit } = await import('../../../actions/github/auth')
    const octokit = await getAuthenticatedOctokit(5)
    expect(createAppAuth).toHaveBeenCalled()
    expect(tokenFn).toHaveBeenCalledWith({ type: 'installation', installationId: 5 })
    expect((octokit as any).args).toEqual({ auth: 't' })
  })

  it('throws when installation id missing in app mode', async () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'advanced'
    process.env.NEXT_PUBLIC_GITHUB_APP_ID = '1'
    process.env.GITHUB_PRIVATE_KEY = 'k'
    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID = 'cid'
    process.env.GITHUB_CLIENT_SECRET = 'sec'
    const tokenFn = jest.fn()
    ;(createAppAuth as unknown as jest.Mock).mockReturnValue(tokenFn)
    const { getAuthenticatedOctokit } = await import('../../../actions/github/auth')
    await expect(getAuthenticatedOctokit(null as any)).rejects.toThrow('Installation ID is required')
  })
})
