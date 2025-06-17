import { fireEvent, render, waitFor } from "@testing-library/react"
import { NewIssueForm } from "../../../components/issues/new-issue-form"

jest.mock("../../../db/queries/instructions-queries", () => ({
  getInstructionsByProjectId: jest.fn()
}))
jest.mock("../../../db/queries/templates-to-instructions-queries", () => ({
  getInstructionsForTemplate: jest.fn()
}))
jest.mock("../../../db/queries/issues-queries", () => ({
  createIssue: jest.fn()
}))
jest.mock("../../../db/queries/issues-to-instructions-queries", () => ({
  addInstructionToIssue: jest.fn()
}))
jest.mock("../../../components/ui/multi-select", () => ({
  MultiSelect: ({ onToggleSelect }: any) => (
    <button onClick={() => onToggleSelect(["i2"])}>ms</button>
  )
}))
const router = { push: jest.fn(), refresh: jest.fn() }
jest.mock("next/navigation", () => ({
  useParams: () => ({ projectId: "p" }),
  useRouter: () => router
}))
import { useRouter } from "next/navigation"
import {
  getInstructionsByProjectId
} from "../../../db/queries/instructions-queries"
import { getInstructionsForTemplate } from "../../../db/queries/templates-to-instructions-queries"
import { createIssue } from "../../../db/queries/issues-queries"
import { addInstructionToIssue } from "../../../db/queries/issues-to-instructions-queries"

describe("NewIssueForm", () => {
  const templates = [{ id: "t1", name: "T", content: "C" }]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("creates issue with template and instructions", async () => {
    ;(getInstructionsByProjectId as jest.Mock).mockResolvedValue([
      { id: "i1", name: "N" }
    ])
    ;(getInstructionsForTemplate as jest.Mock).mockResolvedValue([
      { instruction: { id: "i1", name: "I" } }
    ])
    ;(createIssue as jest.Mock).mockResolvedValue({ id: "i" })
    const router = useRouter() as any

    const { getByRole, getByText, getByPlaceholderText } = render(
      <NewIssueForm templates={templates as any} />
    )

    fireEvent.click(getByRole("combobox"))
    fireEvent.click(getByText("T"))

    await waitFor(() =>
      expect(getInstructionsForTemplate).toHaveBeenCalledWith("t1")
    )

    await waitFor(() =>
      expect(getByPlaceholderText("Issue name") as HTMLInputElement).toHaveValue("T")
    )

    const createButton = getByText("Create") as HTMLButtonElement

    await waitFor(() => expect(createButton).not.toBeDisabled())

    await waitFor(() => getByText("ms"))
    fireEvent.click(getByText("ms"))
    fireEvent.click(createButton)

    await waitFor(() =>
      expect(createIssue).toHaveBeenCalledWith({
        name: "T",
        content: "C",
        projectId: "p",
        templateId: "t1"
      })
    )
    expect(addInstructionToIssue).toHaveBeenCalledWith("i", "i2")
    expect(router.push).toHaveBeenCalledWith("../issues/i")
  })

  it("renders no multiselect when no instructions", async () => {
    ;(getInstructionsByProjectId as jest.Mock).mockResolvedValue([])
    const { queryByText } = render(
      <NewIssueForm templates={templates as any} />
    )
    await waitFor(() =>
      expect(getInstructionsByProjectId).toHaveBeenCalledWith("p")
    )
    expect(queryByText("ms")).not.toBeInTheDocument()
  })
})
