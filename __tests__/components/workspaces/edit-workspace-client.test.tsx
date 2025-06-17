import { fireEvent, render, waitFor } from '@testing-library/react'
import { EditWorkspaceClient } from '../../../components/workspaces/edit-workspace-client'
import { deleteWorkspace, updateWorkspace } from '../../../db/queries/workspaces-queries'

jest.mock('../../../db/queries/workspaces-queries', () => ({
  updateWorkspace: jest.fn(),
  deleteWorkspace: jest.fn()
}))

const router = { push: jest.fn(), refresh: jest.fn() }
jest.mock('next/navigation', () => ({ useRouter: () => router }))

describe('EditWorkspaceClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('submits updated workspace name', async () => {
    ;(updateWorkspace as jest.Mock).mockResolvedValue(undefined)
    const { getByPlaceholderText, getByText } = render(
      <EditWorkspaceClient workspace={{ id: 'w1', name: 'Old' } as any} workspaceId="w1" />
    )
    fireEvent.change(getByPlaceholderText('Enter workspace name'), { target: { value: 'New' } })
    fireEvent.click(getByText('Save Changes'))
    await waitFor(() => expect(updateWorkspace).toHaveBeenCalledWith('w1', { name: 'New' }))
    expect(router.refresh).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('/w1')
  })

  it('deletes workspace', async () => {
    ;(deleteWorkspace as jest.Mock).mockResolvedValue(undefined)
    const { getByText } = render(
      <EditWorkspaceClient workspace={{ id: 'w1', name: 'Old' } as any} workspaceId="w1" />
    )
    fireEvent.click(getByText('Delete Workspace'))
    fireEvent.click(getByText('Delete'))
    await waitFor(() => expect(deleteWorkspace).toHaveBeenCalledWith('w1'))
    expect(router.refresh).toHaveBeenCalled()
    expect(router.push).toHaveBeenCalledWith('/workspaces')
  })
})
