import { fireEvent, render } from '@testing-library/react'
import { Dashboard } from '../../../components/dashboard/dashboard'

jest.mock('next/navigation', () => ({ usePathname: () => '/' }))

const workspaces = [{ id: 'w1', name: 'W1' }]
const projects = [{ id: 'p1', name: 'P1' }]

describe('Dashboard', () => {
  it('toggles project links in collapsible', () => {
    const { getByText, queryByText } = render(
      <Dashboard
        IntegrationStatus={{ isGitHubConnected: false }}
        workspaces={workspaces as any}
        workspaceId="w1"
        projects={projects as any}
      >
        <div>Child</div>
      </Dashboard>
    )

    expect(queryByText('Issues')).not.toBeInTheDocument()
    fireEvent.click(getByText('P1'))
    expect(queryByText('Issues')).toBeInTheDocument()
  })
})
