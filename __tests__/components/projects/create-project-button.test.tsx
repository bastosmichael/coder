import { fireEvent, render, waitFor } from '@testing-library/react'
import { CreateProjectButton } from '../../../components/projects/create-project-button'

const createProject = jest.fn()
jest.mock('../../../db/queries/projects-queries', () => ({ createProject }))

const push = jest.fn()
const refresh = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push, refresh }) }))

describe('CreateProjectButton', () => {
  beforeEach(() => {
    createProject.mockReset()
    push.mockReset()
    refresh.mockReset()
  })

  it('creates project and navigates', async () => {
    createProject.mockResolvedValue({ id: 'p1' })
    const { container } = render(
      <CreateProjectButton params={{ workspaceId: 'w1' }} />
    )
    fireEvent.click(container.querySelector('div.cursor-pointer')!)
    await waitFor(() => expect(createProject).toHaveBeenCalled())
    expect(push).toHaveBeenCalledWith('/w1/p1/settings')
    expect(refresh).toHaveBeenCalled()
  })

  it('handles errors gracefully', async () => {
    createProject.mockRejectedValue(new Error('fail'))
    const { container } = render(
      <CreateProjectButton params={{ workspaceId: 'w1' }} />
    )
    fireEvent.click(container.querySelector('div.cursor-pointer')!)
    await waitFor(() => expect(createProject).toHaveBeenCalled())
    expect(push).not.toHaveBeenCalled()
  })
})
