import { fireEvent, render, waitFor } from '@testing-library/react'
import { CreateWorkspaceButton } from '../../../components/workspaces/create-workspace-button'

const createWorkspace = jest.fn()
jest.mock('../../../db/queries/workspaces-queries', () => ({ createWorkspace }))

const push = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

describe('CreateWorkspaceButton', () => {
  beforeEach(() => {
    createWorkspace.mockReset()
    push.mockReset()
  })

  it('creates workspace and navigates', async () => {
    createWorkspace.mockResolvedValue({ id: 'w1' })
    const { getByText } = render(<CreateWorkspaceButton />)
    fireEvent.click(getByText('Workspace'))
    fireEvent.change(
      document.querySelector('input')!,
      { target: { value: 'A' } }
    )
    fireEvent.click(getByText('Create'))
    await waitFor(() => expect(createWorkspace).toHaveBeenCalledWith({ name: 'A' }))
    expect(push).toHaveBeenCalledWith('/w1')
  })

  it('handles errors gracefully', async () => {
    createWorkspace.mockRejectedValue(new Error('fail'))
    const { getByText } = render(<CreateWorkspaceButton />)
    fireEvent.click(getByText('Workspace'))
    fireEvent.click(getByText('Create'))
    await waitFor(() => expect(createWorkspace).toHaveBeenCalled())
    expect(push).not.toHaveBeenCalled()
  })
})
