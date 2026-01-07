describe('getUserId', () => {
  it('returns the default user id', async () => {
    const { getUserId } = await import('../../../actions/auth/auth')
    await expect(getUserId()).resolves.toBe('simple_user_1')
  })
})
