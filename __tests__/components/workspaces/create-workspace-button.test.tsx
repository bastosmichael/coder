import { fireEvent, render, waitFor } from '@testing-library/react'
import { CreateWorkspaceButton } from '../../../components/workspaces/create-workspace-button'

jest.mock('../../../db/queries/workspaces-queries', () => {
  const createWorkspace = jest.fn()
  return { __esModule: true, createWorkspace }
})
import { createWorkspace } from '../../../db/queries/workspaces-queries'

jest.mock('next/navigation', () => {
  const router = { push: jest.fn() }
  return { __esModule: true, useRouter: () => router, router }
})
import { router } from 'next/navigation'

describe('CreateWorkspaceButton', () => {
  beforeEach(() => {
    createWorkspace.mockReset()
    router.push.mockReset()
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
    expect(router.push).toHaveBeenCalledWith('/w1')
  })

  it('handles errors gracefully', async () => {
    createWorkspace.mockRejectedValue(new Error('fail'))
    const { getByText } = render(<CreateWorkspaceButton />)
    fireEvent.click(getByText('Workspace'))
    fireEvent.click(getByText('Create'))
    await waitFor(() => expect(createWorkspace).toHaveBeenCalled())
    expect(router.push).not.toHaveBeenCalled()
  })
})
