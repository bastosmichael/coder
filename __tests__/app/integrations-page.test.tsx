import React from "react"
import { render, screen } from "@testing-library/react"

jest.mock("../../components/integrations/integrations", () => ({
  Integrations: jest.fn(({ isGitHubConnected }) => (
    <div>integrations {String(isGitHubConnected)}</div>
  ))
}))

jest.mock("../../components/utility/not-found", () => ({
  NotFound: ({ message }: { message: string }) => <div>{message}</div>
}))

jest.mock("../../db/queries", () => ({
  getWorkspaceById: jest.fn(),
  getProjectById: jest.fn()
}))

import IntegrationsPage from "../../app/[workspaceId]/[projectId]/integrations/page"

const { getWorkspaceById, getProjectById } = require("../../db/queries") as any
const IntegrationsMock = require("../../components/integrations/integrations")
  .Integrations as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  ;(console.error as jest.Mock).mockRestore()
})

describe("IntegrationsPage", () => {
  it("handles missing workspace", async () => {
    getWorkspaceById.mockResolvedValue(null)
    const Page = await IntegrationsPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(screen.getByText("Workspace not found")).toBeInTheDocument()
  })

  it("handles missing project", async () => {
    getWorkspaceById.mockResolvedValue({ id: "w" })
    getProjectById.mockResolvedValue(null)
    const Page = await IntegrationsPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(screen.getByText("Project not found")).toBeInTheDocument()
  })

  it("renders integrations with connection state", async () => {
    getWorkspaceById.mockResolvedValue({ id: "w" })
    getProjectById.mockResolvedValue({ githubInstallationId: 1 })
    const Page = await IntegrationsPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(IntegrationsMock).toHaveBeenCalledWith(
      { isGitHubConnected: true },
      {}
    )
  })
})
