import { fireEvent, render, waitFor } from '@testing-library/react'
import { DeleteProjectButton } from '../../../components/projects/delete-project-button'

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
import { toast } from 'sonner'

const deleteProject = jest.fn()
jest.mock('../../../db/queries/projects-queries', () => ({
  __esModule: true,
  deleteProject: (...args: any[]) => deleteProject(...args)
}))

const push = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push })
}))

describe('DeleteProjectButton', () => {
  beforeEach(() => {
    deleteProject.mockReset()
    push.mockReset()
    toast.success.mockReset()
    toast.error.mockReset()
  })

  it('deletes project and navigates', async () => {
    deleteProject.mockResolvedValue(undefined)
    const { getByText } = render(
      <DeleteProjectButton projectId="p1" workspaceId="w1" />
    )
    fireEvent.click(getByText('Delete Project'))
    fireEvent.click(getByText('Delete'))
    await waitFor(() => expect(deleteProject).toHaveBeenCalledWith('p1'))
    expect(push).toHaveBeenCalledWith('/w1')
    expect(toast.success).toHaveBeenCalled()
  })

  it('shows error toast on failure', async () => {
    deleteProject.mockRejectedValue(new Error('fail'))
    const { getByText } = render(
      <DeleteProjectButton projectId="p1" workspaceId="w1" />
    )
    fireEvent.click(getByText('Delete Project'))
    fireEvent.click(getByText('Delete'))
    await waitFor(() => expect(deleteProject).toHaveBeenCalled())
    expect(toast.error).toHaveBeenCalled()
  })
})
