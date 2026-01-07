import { fireEvent, render, waitFor } from '@testing-library/react'
import { ProjectSetup } from '../../../components/projects/project-setup'

jest.mock('../../../actions/github/list-branches', () => ({ listBranches: jest.fn() }))
jest.mock('../../../db/queries/projects-queries', () => ({ updateProject: jest.fn() }))

const push = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useParams: () => ({ projectId: 'p', workspaceId: 'w' })
}))

import { listBranches } from '../../../actions/github/list-branches'
import { updateProject } from '../../../db/queries/projects-queries'

describe('ProjectSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const project = {
    id: 'p',
    workspaceId: 'w',
    name: 'proj',
    githubRepoFullName: null,
    githubTargetBranch: null
  } as any

  const repos = [{ id: 1, name: 'R1', full_name: 'org/R1' }]

  it('fetches branches on repo select and submits', async () => {
    ;(listBranches as jest.Mock).mockResolvedValue(['main'])
    ;(updateProject as jest.Mock).mockResolvedValue(undefined)

    const { getByText, getByRole, queryByText } = render(
      <ProjectSetup project={project} repos={repos} />
    )

    fireEvent.click(getByText('Select a repository'))
    fireEvent.click(getByText('R1'))
    await waitFor(() => expect(listBranches).toHaveBeenCalledWith('org/R1'))

    fireEvent.click(getByText('Select target branch'))
    fireEvent.click(getByText('main'))

    fireEvent.change(getByRole('textbox'), { target: { value: 'My Project' } })

    const button = getByText('Continue') as HTMLButtonElement
    await waitFor(() => expect(button).not.toBeDisabled())

    fireEvent.click(button)
    await waitFor(() =>
      expect(updateProject).toHaveBeenCalledWith('p', {
        name: 'My Project',
        githubRepoFullName: 'org/R1',
        githubTargetBranch: 'main'
      })
    )
    expect(push).toHaveBeenCalledWith('/w/p/issues')
  })

  it('handles submit errors gracefully', async () => {
    ;(listBranches as jest.Mock).mockResolvedValue(['main'])
    ;(updateProject as jest.Mock).mockRejectedValue(new Error('fail'))

    const { getByText } = render(<ProjectSetup project={project} repos={repos} />)
    fireEvent.click(getByText('Select a repository'))
    fireEvent.click(getByText('R1'))
    await waitFor(() => expect(listBranches).toHaveBeenCalled())

    fireEvent.click(getByText('Select target branch'))
    fireEvent.click(getByText('main'))

    fireEvent.click(getByText('Continue'))
    await waitFor(() => expect(updateProject).toHaveBeenCalled())
    expect(push).not.toHaveBeenCalled()
  })
})
