import React from 'react'
import { render } from '@testing-library/react'

import InstructionsLoadingPage from '../app/[workspaceId]/[projectId]/instructions/loading'
import IntegrationsLoadingPage from '../app/[workspaceId]/[projectId]/integrations/loading'
import IssuesLoadingPage from '../app/[workspaceId]/[projectId]/issues/loading'
import TemplatesLoadingPage from '../app/[workspaceId]/[projectId]/templates/loading'
import SettingsLoadingPage from '../app/[workspaceId]/[projectId]/settings/loading'

const pages = [
  InstructionsLoadingPage,
  IntegrationsLoadingPage,
  IssuesLoadingPage,
  TemplatesLoadingPage,
  SettingsLoadingPage
]

describe('project loading pages', () => {
  it('all return a LoadingPage component', async () => {
    for (const Page of pages) {
      const element = (await Page()) as React.ReactElement
      const { container } = render(element)
      expect(container.querySelector('svg')).toBeInTheDocument()
    }
  })
})
