import { jest } from '@jest/globals'

describe('db initialization', () => {
  const originalEnv = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    // polyfill for driver
    // @ts-ignore
    global.TextDecoder = require('util').TextDecoder
  })
  afterEach(() => {
    process.env = originalEnv
  })

  it('uses neon when url contains neon', () => {
    process.env.DATABASE_URL = 'https://neon.example'

    const neon = jest.fn(() => 'client')
    const drizzle = jest.fn(() => 'db')
    jest.mock('@neondatabase/serverless', () => ({ neon, neonConfig: {} }), { virtual: true })
    jest.mock('drizzle-orm/neon-http', () => ({ drizzle }), { virtual: true })

    const mod = require('../../db/db')
    expect(neon).toHaveBeenCalledWith('https://neon.example')
    expect(drizzle).toHaveBeenCalledWith('client', expect.any(Object))
    expect(mod.db).toBe('db')
  })

  it('uses postgres when url does not contain neon', () => {
    process.env.DATABASE_URL = 'postgres://localhost/db'

    const pg = jest.fn(() => 'pgClient')
    const drizzlePg = jest.fn(() => 'dbPg')
    jest.mock('@neondatabase/serverless', () => ({ neon: jest.fn(), neonConfig: {} }), { virtual: true })
    jest.mock('postgres', () => pg, { virtual: true })
    jest.mock('drizzle-orm/postgres-js', () => ({ drizzle: drizzlePg }), { virtual: true })

    const mod = require('../../db/db')
    expect(pg).toHaveBeenCalledWith('postgres://localhost/db', { prepare: false })
    expect(drizzlePg).toHaveBeenCalledWith('pgClient', expect.any(Object))
    expect(mod.db).toBe('dbPg')
  })
})
