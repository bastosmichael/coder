jest.mock('@octokit/rest', () => ({ Octokit: jest.fn().mockImplementation((args: any) => ({ args })) }))

let Octokit: jest.Mock

const originalEnv = process.env

describe('getAuthenticatedOctokit', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    ;({ Octokit } = require('@octokit/rest'))
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('uses PAT for authentication', async () => {
    process.env.GITHUB_PAT = 'pat'
    const { getAuthenticatedOctokit } = await import('../../../actions/github/auth')
    const octokit = await getAuthenticatedOctokit()
    expect((Octokit as unknown as jest.Mock).mock.calls[0][0]).toEqual({ auth: 'pat' })
    expect((octokit as any).args).toEqual({ auth: 'pat' })
  })
})
