import { fireEvent, render } from '@testing-library/react'

jest.mock('@clerk/nextjs', () => ({ UserButton: () => <div>User</div> }))
jest.mock('@clerk/nextjs/server', () => ({ auth: jest.fn(() => ({ userId: 'u1' })) }))
jest.mock('next/navigation', () => ({ usePathname: () => '/' }))

import { TextEncoder, TextDecoder } from 'util'
// polyfill before requiring Dashboard and Next utilities
// @ts-ignore
if (!global.TextEncoder) global.TextEncoder = TextEncoder
// @ts-ignore
if (!global.TextDecoder) global.TextDecoder = TextDecoder
// polyfill Request for next/server modules
// @ts-ignore
if (!global.Request) global.Request = class {}

const { Dashboard } = require('../../../components/dashboard/dashboard')

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
