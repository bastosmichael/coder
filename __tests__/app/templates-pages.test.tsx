import React from "react"
import { render, screen } from "@testing-library/react"

jest.mock("../../components/templates/template-list", () => ({
  TemplatesList: jest.fn(({ templatesWithInstructions }: any) => (
    <div>list {templatesWithInstructions.length}</div>
  ))
}))

jest.mock("../../components/templates/template", () => ({
  Template: jest.fn(({ template }: any) => <div>template {template.id}</div>)
}))

jest.mock("../../components/templates/new-template-form", () => ({
  __esModule: true,
  default: ({ instructions }: any) => (
    <div>new template form {instructions.length}</div>
  )
}))

jest.mock("../../components/templates/edit-template-form", () => ({
  __esModule: true,
  default: () => <div>edit template form</div>
}))

jest.mock("../../components/utility/not-found", () => ({
  NotFound: ({ message }: { message: string }) => <div>{message}</div>
}))

jest.mock("../../db/queries/templates-queries", () => ({
  getTemplatesWithInstructionsByProjectId: jest.fn(),
  getTemplateWithInstructionById: jest.fn()
}))

jest.mock("../../db/queries/instructions-queries", () => ({
  getInstructionsByProjectId: jest.fn()
}))

import TemplatesPage from "../../app/[workspaceId]/[projectId]/templates/page"
import TemplatePage from "../../app/[workspaceId]/[projectId]/templates/[id]/page"
import EditTemplatePage from "../../app/[workspaceId]/[projectId]/templates/[id]/edit/page"
import CreateTemplatePage from "../../app/[workspaceId]/[projectId]/templates/create/page"

const { getTemplatesWithInstructionsByProjectId, getTemplateWithInstructionById } =
  require("../../db/queries/templates-queries") as any
const { getInstructionsByProjectId } = require("../../db/queries/instructions-queries") as any
const TemplatesListMock = require("../../components/templates/template-list").TemplatesList as jest.Mock
const TemplateMock = require("../../components/templates/template").Template as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  ;(console.error as jest.Mock).mockRestore()
})

describe("template pages", () => {
  it("lists templates for project", async () => {
    getTemplatesWithInstructionsByProjectId.mockResolvedValue([{ id: "t" }])
    getInstructionsByProjectId.mockResolvedValue([{ id: "i" }])
    const Page = await TemplatesPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(TemplatesListMock).toHaveBeenCalledWith(
      {
        templatesWithInstructions: [{ id: "t" }],
        instructions: [{ id: "i" }],
        projectId: "p"
      },
      {}
    )
  })

  it("shows single template", async () => {
    getTemplateWithInstructionById.mockResolvedValue({ id: "t" })
    const Page = await TemplatePage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p", id: "t" })
    } as any)
    render(Page as any)
    expect(TemplateMock).toHaveBeenCalledWith({ template: { id: "t" } }, {})
    expect(screen.getByText("template t")).toBeInTheDocument()
  })

  it("handles missing template", async () => {
    getTemplateWithInstructionById.mockResolvedValue(null)
    const Page = await TemplatePage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p", id: "x" })
    } as any)
    render(Page as any)
    expect(screen.getByText("Template not found")).toBeInTheDocument()
  })

  it("renders edit template page", async () => {
    getTemplateWithInstructionById.mockResolvedValue({ id: "t" })
    getInstructionsByProjectId.mockResolvedValue([{ id: "i" }])
    const Page = await EditTemplatePage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p", id: "t" })
    } as any)
    render(Page as any)
    expect(screen.getByText("edit template form")).toBeInTheDocument()
  })

  it("edit page handles missing template", async () => {
    getTemplateWithInstructionById.mockResolvedValue(null)
    const Page = await EditTemplatePage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p", id: "t" })
    } as any)
    render(Page as any)
    expect(screen.getByText("Template not found")).toBeInTheDocument()
  })

  it("renders create template page", async () => {
    getInstructionsByProjectId.mockResolvedValue([{ id: "i" }])
    const Page = await CreateTemplatePage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(screen.getByText("new template form 1")).toBeInTheDocument()
  })
})

