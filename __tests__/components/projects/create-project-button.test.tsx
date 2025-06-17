import { fireEvent, render, waitFor } from '@testing-library/react'
import { CreateProjectButton } from '../../../components/projects/create-project-button'

jest.mock('../../../db/queries/projects-queries', () => {
  const createProject = jest.fn()
  return { __esModule: true, createProject }
})
import { createProject } from '../../../db/queries/projects-queries'

jest.mock('next/navigation', () => {
  const router = { push: jest.fn(), refresh: jest.fn() }
  return { __esModule: true, useRouter: () => router, router }
})
import { router } from 'next/navigation'

describe('CreateProjectButton', () => {
  beforeEach(() => {
    createProject.mockReset()
    router.push.mockReset()
    router.refresh.mockReset()
  })

  it('creates project and navigates', async () => {
    createProject.mockResolvedValue({ id: 'p1' })
    const { container } = render(
      <CreateProjectButton params={{ workspaceId: 'w1' }} />
    )
    fireEvent.click(container.querySelector('div.cursor-pointer')!)
    await waitFor(() => expect(createProject).toHaveBeenCalled())
    expect(router.push).toHaveBeenCalledWith('/w1/p1/settings')
    expect(router.refresh).toHaveBeenCalled()
  })

  it('handles errors gracefully', async () => {
    createProject.mockRejectedValue(new Error('fail'))
    const { container } = render(
      <CreateProjectButton params={{ workspaceId: 'w1' }} />
    )
    fireEvent.click(container.querySelector('div.cursor-pointer')!)
    await waitFor(() => expect(createProject).toHaveBeenCalled())
    expect(router.push).not.toHaveBeenCalled()
  })
})
