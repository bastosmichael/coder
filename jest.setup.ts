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

// Basic ResizeObserver mock for components relying on it
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-ignore
global.ResizeObserver = global.ResizeObserver || ResizeObserver

// Some components (cmdk) rely on scrollIntoView which isn't implemented in JSDOM
if (!HTMLElement.prototype.scrollIntoView) {
  // @ts-ignore
  HTMLElement.prototype.scrollIntoView = jest.fn()
}
