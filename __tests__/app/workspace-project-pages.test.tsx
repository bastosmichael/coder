import { render, screen } from '@testing-library/react'
import WorkspacePage from '../app/[workspaceId]/page'
import ProjectPage from '../app/[workspaceId]/[projectId]/page'

jest.mock('../db/queries/workspaces-queries', () => ({ getWorkspaceById: jest.fn() }))
jest.mock('../db/queries/projects-queries', () => ({ getProjectById: jest.fn() }))

const { getWorkspaceById } = require('../db/queries/workspaces-queries') as { getWorkspaceById: jest.Mock }
const { getProjectById } = require('../db/queries/projects-queries') as { getProjectById: jest.Mock }

describe('Workspace and Project pages', () => {
  it('shows workspace name', async () => {
    getWorkspaceById.mockResolvedValue({ name: 'WS' })
    const Page = await WorkspacePage({ params: Promise.resolve({ workspaceId: '1' }) } as any)
    render(Page as any)
    expect(screen.getByText('WS')).toBeInTheDocument()
  })

  it('handles missing workspace', async () => {
    getWorkspaceById.mockResolvedValue(null)
    const Page = await WorkspacePage({ params: Promise.resolve({ workspaceId: '1' }) } as any)
    render(Page as any)
    expect(screen.getByText('Workspace not found')).toBeInTheDocument()
  })

  it('shows project name', async () => {
    getProjectById.mockResolvedValue({ name: 'PR' })
    const Page = await ProjectPage({ params: Promise.resolve({ workspaceId: '1', projectId: '2' }) } as any)
    render(Page as any)
    expect(screen.getByText('PR')).toBeInTheDocument()
  })

  it('handles missing project', async () => {
    getProjectById.mockResolvedValue(null)
    const Page = await ProjectPage({ params: Promise.resolve({ workspaceId: '1', projectId: '2' }) } as any)
    render(Page as any)
    expect(screen.getByText('Project not found')).toBeInTheDocument()
  })
})
