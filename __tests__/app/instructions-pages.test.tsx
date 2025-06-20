import React from "react"
import { render, screen } from "@testing-library/react"

jest.mock("../../components/instructions/instruction-list", () => ({
  InstructionsList: jest.fn(() => <div>instructions list</div>)
}))

jest.mock("../../components/instructions/instruction", () => ({
  Instruction: jest.fn(({ instruction }) => <div>{instruction.name}</div>)
}))

jest.mock("../../components/instructions/new-instruction-form", () => ({
  __esModule: true,
  default: () => <div>new instruction form</div>
}))

jest.mock("../../components/instructions/edit-instruction-form", () => ({
  __esModule: true,
  default: () => <div>edit instruction form</div>
}))

jest.mock("../../components/utility/not-found", () => ({
  NotFound: ({ message }: { message: string }) => <div>{message}</div>
}))

jest.mock("../../db/queries/instructions-queries", () => ({
  getInstructionsByProjectId: jest.fn(),
  getInstructionById: jest.fn()
}))

import InstructionListPage from "../../app/[workspaceId]/[projectId]/instructions/page"
import InstructionPage from "../../app/[workspaceId]/[projectId]/instructions/[id]/page"
import EditInstructionPage from "../../app/[workspaceId]/[projectId]/instructions/[id]/edit/page"
import CreateInstructionPage from "../../app/[workspaceId]/[projectId]/instructions/create/page"

const { getInstructionsByProjectId, getInstructionById } =
  require("../../db/queries/instructions-queries") as any
const InstructionListMock =
  require("../../components/instructions/instruction-list")
    .InstructionsList as jest.Mock
const InstructionMock = require("../../components/instructions/instruction")
  .Instruction as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  ;(console.error as jest.Mock).mockRestore()
})

describe("instruction pages", () => {
  it("lists instructions for project", async () => {
    getInstructionsByProjectId.mockResolvedValue(["a"])
    const Page = await InstructionListPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p" })
    } as any)
    render(Page as any)
    expect(InstructionListMock).toHaveBeenCalledWith(
      { instructions: ["a"] },
      {}
    )
  })

  it("renders single instruction", async () => {
    getInstructionById.mockResolvedValue({ id: "1", name: "test" })
    const Page = await InstructionPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p", id: "1" })
    } as any)
    render(Page as any)
    expect(InstructionMock).toHaveBeenCalledWith(
      { instruction: { id: "1", name: "test" } },
      {}
    )
    expect(screen.getByText("test")).toBeInTheDocument()
  })

  it("handles missing instruction", async () => {
    getInstructionById.mockResolvedValue(null)
    const Page = await InstructionPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p", id: "1" })
    } as any)
    render(Page as any)
    expect(screen.getByText("Instruction not found")).toBeInTheDocument()
  })

  it("renders edit instruction page", async () => {
    getInstructionById.mockResolvedValue({ id: "1", name: "x" })
    const Page = await EditInstructionPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p", id: "1" })
    } as any)
    render(Page as any)
    expect(screen.getByText("edit instruction form")).toBeInTheDocument()
  })

  it("edit page handles missing instruction", async () => {
    getInstructionById.mockResolvedValue(null)
    const Page = await EditInstructionPage({
      params: Promise.resolve({ workspaceId: "w", projectId: "p", id: "1" })
    } as any)
    render(Page as any)
    expect(screen.getByText("Instruction not found")).toBeInTheDocument()
  })

  it("renders create instruction page", async () => {
    const Page = await CreateInstructionPage()
    render(Page as any)
    expect(screen.getByText("new instruction form")).toBeInTheDocument()
  })
})
