import { TextEncoder, TextDecoder } from 'util'

// polyfill TextEncoder/Decoder required by Next.js utils
// @ts-ignore
global.TextEncoder = TextEncoder
// @ts-ignore
global.TextDecoder = TextDecoder

import * as index from '../db/queries'
import { createProject } from '../db/queries/projects-queries'

test('re-exports project queries', () => {
  expect(index.createProject).toBe(createProject)
})
