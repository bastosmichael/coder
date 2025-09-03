import { fireEvent, render, waitFor } from '@testing-library/react'
import { DeleteProjectButton } from '../../../components/projects/delete-project-button'

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
import { toast } from 'sonner'

const mockDeleteProject = jest.fn()
jest.mock('../../../db/queries/projects-queries', () => ({
  __esModule: true,
  deleteProject: (...args: any[]) => mockDeleteProject(...args)
}))

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

describe('DeleteProjectButton', () => {
  beforeEach(() => {
    mockDeleteProject.mockReset()
    mockPush.mockReset()
    toast.success.mockReset()
    toast.error.mockReset()
  })

  it('deletes project and navigates', async () => {
    mockDeleteProject.mockResolvedValue(undefined)
    const { getByText } = render(
      <DeleteProjectButton projectId="p1" workspaceId="w1" />
    )
    fireEvent.click(getByText('Delete Project'))
    fireEvent.click(getByText('Delete'))
    await waitFor(() => expect(mockDeleteProject).toHaveBeenCalledWith('p1'))
    expect(mockPush).toHaveBeenCalledWith('/w1')
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toast on failure', async () => {
    mockDeleteProject.mockRejectedValue(new Error('fail'))
    const { getByText } = render(
      <DeleteProjectButton projectId="p1" workspaceId="w1" />
    )
    fireEvent.click(getByText('Delete Project'))
    fireEvent.click(getByText('Delete'))
    await waitFor(() => expect(mockDeleteProject).toHaveBeenCalled())
    expect(toast.error).toHaveBeenCalled()
  })
})
