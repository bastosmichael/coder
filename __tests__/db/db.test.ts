import { jest } from '@jest/globals'

const mockNeon = jest.fn()
const mockDrizzleNeon = jest.fn()
const mockPg = jest.fn()
const mockDrizzlePg = jest.fn()

jest.mock('@neondatabase/serverless', () => ({ neon: mockNeon, neonConfig: {} }), { virtual: true })
jest.mock('drizzle-orm/neon-http', () => ({ drizzle: mockDrizzleNeon }), { virtual: true })
jest.mock('postgres', () => mockPg, { virtual: true })
jest.mock('drizzle-orm/postgres-js', () => ({ drizzle: mockDrizzlePg }), { virtual: true })

describe('db initialization', () => {
  const originalEnv = process.env
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
    // @ts-ignore
    global.TextDecoder = require('util').TextDecoder
    // @ts-ignore
    global.TextEncoder = require('util').TextEncoder
    mockNeon.mockReset()
    mockDrizzleNeon.mockReset()
    mockPg.mockReset()
    mockDrizzlePg.mockReset()
    mockNeon.mockImplementation(() => 'client')
    mockDrizzleNeon.mockImplementation(() => 'db')
    mockPg.mockImplementation(() => 'pgClient')
    mockDrizzlePg.mockImplementation(() => 'dbPg')
  })
  afterEach(() => {
    process.env = originalEnv
  })

  it('uses neon when url contains neon', () => {
    process.env.DATABASE_URL = 'https://neon.example'
    const mod = require('../../db/db')
    expect(mockNeon).toHaveBeenCalledWith('https://neon.example')
    expect(mockDrizzleNeon).toHaveBeenCalledWith('client', expect.any(Object))
    expect(mod.db).toBe('db')
  })

  it('uses postgres when url does not contain neon', () => {
    process.env.DATABASE_URL = 'postgres://localhost/db'
    const mod = require('../../db/db')
    expect(mockPg).toHaveBeenCalledWith('postgres://localhost/db', { prepare: false })
    expect(mockDrizzlePg).toHaveBeenCalledWith('pgClient', expect.any(Object))
    expect(mod.db).toBe('dbPg')
  })
})
