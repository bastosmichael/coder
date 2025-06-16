import '@testing-library/jest-dom'

// Suppress console.error and console.warn during tests to keep output clean
const originalError = console.error
const originalWarn = console.warn

let errorSpy: jest.SpyInstance
let warnSpy: jest.SpyInstance

beforeAll(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterAll(() => {
  errorSpy.mockRestore()
  warnSpy.mockRestore()
})
