import { TextEncoder, TextDecoder } from 'util'

// Polyfill web APIs expected by Next utilities
// @ts-ignore
global.TextEncoder = TextEncoder
// @ts-ignore
global.TextDecoder = TextDecoder
// @ts-ignore
global.Request = global.Request || class {}
// @ts-ignore
global.Response = global.Response || class {}
// @ts-ignore
global.Headers = global.Headers || class {}

test('re-exports project queries', () => {
  const fn = jest.fn()
  jest.doMock('../../db/queries/projects-queries', () => ({ createProject: fn }))

  const modules = [
    '../../db/queries/embedded-branches-queries',
    '../../db/queries/embedded-files-queries',
    '../../db/queries/instructions-queries',
    '../../db/queries/issue-messages-queries',
    '../../db/queries/issues-queries',
    '../../db/queries/issues-to-instructions-queries',
    '../../db/queries/profiles-queries',
    '../../db/queries/templates-queries',
    '../../db/queries/templates-to-instructions-queries',
    '../../db/queries/workspaces-queries'
  ]
  modules.forEach(m => jest.doMock(m, () => ({})))

  jest.isolateModules(() => {
    const index = require('../../db/queries')
    expect(index.createProject).toBe(fn)
  })
})
