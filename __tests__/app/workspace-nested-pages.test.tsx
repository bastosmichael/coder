import React from "react"
import { render, screen } from "@testing-library/react"

jest.mock("../../components/dashboard/dashboard", () => ({
  Dashboard: jest.fn(({ children }) => <div data-testid="dash">{children}</div>)
}))

jest.mock("../../db/queries/workspaces-queries", () => ({
  getWorkspacesByUserId: jest.fn(),
  getWorkspaceById: jest.fn()
}))

jest.mock("../../db/queries/projects-queries", () => ({
  getProjectsByWorkspaceId: jest.fn(),
  getProjectById: jest.fn()
}))

jest.mock("../../db/queries/templates-queries", () => ({
  getTemplatesWithInstructionsByProjectId: jest.fn()
}))

jest.mock("../../db/queries/instructions-queries", () => ({
  getInstructionsByProjectId: jest.fn()
}))

jest.mock("../../actions/github/list-repos", () => ({ listRepos: jest.fn() }))

jest.mock("../../components/templates/template-list", () => ({
  TemplatesList: jest.fn(() => <div>templates list</div>)
}))

jest.mock("../../components/instructions/instruction-list", () => ({
  InstructionsList: jest.fn(() => <div>instructions list</div>)
}))

jest.mock("../../components/projects/project-setup", () => ({
  ProjectSetup: jest.fn(() => <div>setup</div>)
}))

jest.mock("../../components/workspaces/edit-workspace-client", () => ({
  EditWorkspaceClient: jest.fn(() => <div>edit workspace</div>)
}))

jest.mock("../../components/utility/not-found", () => ({
  NotFound: ({ message }: { message: string }) => <div>{message}</div>
}))

const { getWorkspacesByUserId, getWorkspaceById } =
  require("../../db/queries/workspaces-queries") as any
const { getProjectsByWorkspaceId, getProjectById } =
  require("../../db/queries/projects-queries") as any
const { getTemplatesWithInstructionsByProjectId } =
  require("../../db/queries/templates-queries") as any
const { getInstructionsByProjectId } =
  require("../../db/queries/instructions-queries") as any
const { listRepos } = require("../../actions/github/list-repos") as any
const DashboardMock = require("../../components/dashboard/dashboard")
  .Dashboard as jest.Mock
const TemplatesListMock = require("../../components/templates/template-list")
  .TemplatesList as jest.Mock
const InstructionsListMock =
  require("../../components/instructions/instruction-list")
    .InstructionsList as jest.Mock
const ProjectSetupMock = require("../../components/projects/project-setup")
  .ProjectSetup as jest.Mock
const EditWorkspaceClientMock =
  require("../../components/workspaces/edit-workspace-client")
    .EditWorkspaceClient as jest.Mock

import WorkspaceLayout from "../../app/[workspaceId]/layout"
import TemplatesPage from "../../app/[workspaceId]/[projectId]/templates/page"
import InstructionListPage from "../../app/[workspaceId]/[projectId]/instructions/page"
import SettingsPage from "../../app/[workspaceId]/[projectId]/settings/page"
import EditWorkspacePage from "../../app/[workspaceId]/edit/page"

beforeEach(() => {
  jest.clearAllMocks()
})

describe("workspace nested pages", () => {
  it("renders workspace layout with data", async () => {
    getWorkspacesByUserId.mockResolvedValue([{ id: "w" }])
    getProjectsByWorkspaceId.mockResolvedValue([{ id: "p" }])
    const Layout = await WorkspaceLayout({
      children: <span>child</span>,
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Layout as any)
    expect(DashboardMock).toHaveBeenCalled()
    const props = DashboardMock.mock.calls[0][0]
    expect(props.workspaceId).toBe("w")
    expect(props.projectId).toBe("p")
    expect(props.workspaces).toEqual([{ id: "w" }])
    expect(props.projects).toEqual([{ id: "p" }])
    expect(screen.getByText("child")).toBeInTheDocument()
  })

  it("renders templates page and handles errors", async () => {
    getTemplatesWithInstructionsByProjectId.mockRejectedValueOnce(
      new Error("x")
    )
    getInstructionsByProjectId.mockRejectedValueOnce(new Error("y"))
    const Page = await TemplatesPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(TemplatesListMock).toHaveBeenCalledWith(
      { templatesWithInstructions: [], instructions: [], projectId: "p" },
      {}
    )
  })

  it("renders templates page with data", async () => {
    getTemplatesWithInstructionsByProjectId.mockResolvedValue(["t"])
    getInstructionsByProjectId.mockResolvedValue(["i"])
    const Page = await TemplatesPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(TemplatesListMock).toHaveBeenCalledWith(
      { templatesWithInstructions: ["t"], instructions: ["i"], projectId: "p" },
      {}
    )
  })

  it("renders instructions list page", async () => {
    getInstructionsByProjectId.mockResolvedValue(["a"])
    const Page = await InstructionListPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(InstructionsListMock).toHaveBeenCalledWith(
      { instructions: ["a"] },
      {}
    )
  })

  it("renders settings page", async () => {
    process.env.NEXT_PUBLIC_APP_MODE = "simple"
    getProjectById.mockResolvedValue({
      id: "p",
      githubInstallationId: "i",
      githubRepoFullName: "r"
    })
    getWorkspaceById.mockResolvedValue({ githubOrganizationName: "org" })
    listRepos.mockResolvedValue(["repo"])
    const Page = await SettingsPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(ProjectSetupMock).toHaveBeenCalledWith(
      {
        className: "mt-6",
        project: {
          id: "p",
          githubInstallationId: "i",
          githubRepoFullName: "r"
        },
        repos: ["repo"]
      },
      {}
    )
  })

  it("settings page handles missing project", async () => {
    getProjectById.mockResolvedValue(null)
    const Page = await SettingsPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(screen.getByText("Project not found")).toBeInTheDocument()
  })

  it("settings page handles missing workspace", async () => {
    getProjectById.mockResolvedValue({ id: "p" })
    getWorkspaceById.mockResolvedValue(null)
    const Page = await SettingsPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(screen.getByText("Workspace not found")).toBeInTheDocument()
  })

  it("edit workspace page renders", async () => {
    getWorkspaceById.mockResolvedValue({ id: "w" })
    const Page = await EditWorkspacePage({
      params: Promise.resolve({ workspaceId: "w" })
    } as any)
    render(Page as any)
    expect(EditWorkspaceClientMock).toHaveBeenCalledWith(
      { workspace: { id: "w" }, workspaceId: "w" },
      {}
    )
  })

  it("edit workspace page handles missing workspace", async () => {
    getWorkspaceById.mockResolvedValue(null)
    const Page = await EditWorkspacePage({
      params: Promise.resolve({ workspaceId: "w" })
    } as any)
    render(Page as any)
    expect(screen.getByText("Workspace not found")).toBeInTheDocument()
  })
})
