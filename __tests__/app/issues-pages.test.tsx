import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('../components/issues/issues-list', () => ({
  IssuesList: jest.fn(() => <div>issues list</div>)
}))

jest.mock('../components/issues/issue-view', () => ({
  IssueView: jest.fn(() => <div>issue view</div>)
}))

jest.mock('../components/issues/edit-issue-form', () => ({
  EditIssueForm: jest.fn(() => <div>edit issue form</div>)
}))

jest.mock('../components/issues/issue-creation', () => ({
  IssueCreation: jest.fn(({ projectId }) => <div>create issue {projectId}</div>)
}))

jest.mock('../components/utility/not-found', () => ({
  NotFound: ({ message }: { message: string }) => <div>{message}</div>
}))

jest.mock('../db/queries/issues-queries', () => ({
  getIssuesByProjectId: jest.fn(),
  getIssueById: jest.fn()
}))

jest.mock('../db/queries/issues-to-instructions-queries', () => ({
  getInstructionsForIssue: jest.fn()
}))

jest.mock('../db/queries/projects-queries', () => ({
  getProjectById: jest.fn()
}))

import IssuesPage from '../app/[workspaceId]/[projectId]/issues/page'
import IssuePage from '../app/[workspaceId]/[projectId]/issues/[issueId]/page'
import EditIssuePage from '../app/[workspaceId]/[projectId]/issues/[issueId]/edit/page'
import CreateIssuePage from '../app/[workspaceId]/[projectId]/issues/create/page'

const { getIssuesByProjectId, getIssueById } = require('../db/queries/issues-queries') as any
const { getProjectById } = require('../db/queries/projects-queries') as any
const { getInstructionsForIssue } = require('../db/queries/issues-to-instructions-queries') as any
const IssuesListMock = require('../components/issues/issues-list').IssuesList as jest.Mock
const IssueViewMock = require('../components/issues/issue-view').IssueView as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  ;(console.error as jest.Mock).mockRestore()
})

describe('issue pages', () => {
  it('lists project issues', async () => {
    getIssuesByProjectId.mockResolvedValue(['i'])
    const Page = await IssuesPage({ params: Promise.resolve({ workspaceId: 'w', projectId: 'p' }) } as any)
    render(Page as any)
    expect(IssuesListMock).toHaveBeenCalledWith({ issues: ['i'], projectId: 'p' }, {})
  })

  it('renders single issue', async () => {
    getIssueById.mockResolvedValue({ id: '1' })
    getProjectById.mockResolvedValue({ id: 'p' })
    getInstructionsForIssue.mockResolvedValue([])
    const Page = await IssuePage({ params: Promise.resolve({ workspaceId: 'w', projectId: 'p', issueId: '1' }) } as any)
    render(Page as any)
    expect(IssueViewMock).toHaveBeenCalledWith(
      { item: { id: '1' }, project: { id: 'p' }, attachedInstructions: [], workspaceId: 'w' },
      {}
    )
  })

  it('handles missing issue', async () => {
    getIssueById.mockResolvedValue(null)
    const Page = await IssuePage({ params: Promise.resolve({ workspaceId: 'w', projectId: 'p', issueId: '1' }) } as any)
    render(Page as any)
    expect(screen.getByText('Issue not found')).toBeInTheDocument()
  })

  it('handles missing project', async () => {
    getIssueById.mockResolvedValue({ id: '1' })
    getProjectById.mockResolvedValue(null)
    const Page = await IssuePage({ params: Promise.resolve({ workspaceId: 'w', projectId: 'p', issueId: '1' }) } as any)
    render(Page as any)
    expect(screen.getByText('Project not found')).toBeInTheDocument()
  })

  it('renders edit issue page', async () => {
    getIssueById.mockResolvedValue({ id: '1' })
    const Page = await EditIssuePage({ params: Promise.resolve({ workspaceId: 'w', projectId: 'p', issueId: '1' }) } as any)
    render(Page as any)
    expect(screen.getByText('edit issue form')).toBeInTheDocument()
  })

  it('edit page handles missing issue', async () => {
    getIssueById.mockResolvedValue(null)
    const Page = await EditIssuePage({ params: Promise.resolve({ workspaceId: 'w', projectId: 'p', issueId: '1' }) } as any)
    render(Page as any)
    expect(screen.getByText('Issue not found')).toBeInTheDocument()
  })

  it('renders create issue page', async () => {
    const Page = await CreateIssuePage({ params: Promise.resolve({ workspaceId: 'w', projectId: 'p' }) } as any)
    render(Page as any)
    expect(screen.getByText('create issue p')).toBeInTheDocument()
  })
})
