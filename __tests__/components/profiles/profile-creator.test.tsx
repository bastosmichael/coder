import { render, waitFor } from '@testing-library/react'
import { ProfileCreator } from '../../../components/profiles/profile-creator'

jest.mock('../../../db/queries', () => ({
  createWorkspaces: jest.fn(),
  createProjects: jest.fn()
}))
jest.mock('../../../db/queries/profiles-queries', () => ({
  createProfile: jest.fn()
}))

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

import { createWorkspaces, createProjects } from '../../../db/queries'
import { createProfile } from '../../../db/queries/profiles-queries'

describe('ProfileCreator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates profile, workspaces, projects and navigates', async () => {
    ;(createProfile as jest.Mock).mockResolvedValue({})
    ;(createWorkspaces as jest.Mock).mockResolvedValue([{ id: 'w' }])
    ;(createProjects as jest.Mock).mockResolvedValue([{ id: 'p' }])
    render(<ProfileCreator />)
    await waitFor(() => expect(createProfile).toHaveBeenCalled())
    expect(createWorkspaces).toHaveBeenCalledWith({ name: 'Workspace' })
    expect(createProjects).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/workspaces')
  })

  it('logs error when creation fails', async () => {
    const error = new Error('fail')
    ;(createProfile as jest.Mock).mockRejectedValue(error)
    render(<ProfileCreator />)
    await waitFor(() => expect(createProfile).toHaveBeenCalled())
    expect(mockPush).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(error)
  })
})
