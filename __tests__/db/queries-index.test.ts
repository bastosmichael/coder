test('re-exports project queries', () => {
  const fn = jest.fn()
  jest.doMock('../../db/queries/projects-queries', () => ({ createProject: fn }))

  jest.isolateModules(() => {
    const index = require('../../db/queries')
    expect(index.createProject).toBe(fn)
  })
})
