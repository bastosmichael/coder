import '@testing-library/jest-dom'

// Suppress console.error and console.warn during tests to keep output clean
const originalError = console.error
const originalWarn = console.warn
const originalLog = console.log

let errorSpy: jest.SpyInstance
let warnSpy: jest.SpyInstance
let logSpy: jest.SpyInstance

beforeAll(() => {
  errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterAll(() => {
  errorSpy.mockRestore()
  warnSpy.mockRestore()
  logSpy.mockRestore()
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

// next-themes uses matchMedia which isn't defined in jsdom
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}
