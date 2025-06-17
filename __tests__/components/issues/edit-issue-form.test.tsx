import { fireEvent, render, waitFor } from "@testing-library/react"
import { EditIssueForm } from "../../../components/issues/edit-issue-form"

jest.mock("../../../db/queries/instructions-queries", () => ({
  getInstructionsByProjectId: jest.fn()
}))
jest.mock("../../../db/queries/issues-to-instructions-queries", () => ({
  addInstructionToIssue: jest.fn(),
  getInstructionsForIssue: jest.fn(),
  removeInstructionFromIssue: jest.fn()
}))
jest.mock("../../../db/queries/issues-queries", () => ({
  updateIssue: jest.fn()
}))
jest.mock("../../../components/ui/multi-select", () => ({
  MultiSelect: ({ onToggleSelect, label }: any) => (
    <button onClick={() => onToggleSelect(["i2"]) }>{label}</button>
  )
}))
jest.mock("next/navigation", () => ({
  useParams: () => ({ workspaceId: "w", projectId: "p" }),
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() })
}))
import { useRouter } from "next/navigation"
import { getInstructionsByProjectId } from "../../../db/queries/instructions-queries"
import {
  addInstructionToIssue,
  getInstructionsForIssue,
  removeInstructionFromIssue
} from "../../../db/queries/issues-to-instructions-queries"
import { updateIssue } from "../../../db/queries/issues-queries"

describe("EditIssueForm", () => {
  const issue = { id: "i", name: "A", content: "B", projectId: "p" } as any

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("updates issue and instruction relations", async () => {
    ;(getInstructionsByProjectId as jest.Mock).mockResolvedValue([
      { id: "i1", name: "N" }
    ])
    ;(getInstructionsForIssue as jest.Mock).mockResolvedValue([
      { instruction: { id: "i1" } }
    ])
    const router = useRouter() as any
    const { getByText, getByPlaceholderText } = render(
      <EditIssueForm issue={issue} />
    )

    await waitFor(() =>
      expect(getInstructionsByProjectId).toHaveBeenCalledWith("p")
    )

    await waitFor(() => getByText("Instruction"))
    fireEvent.click(getByText("Instruction"))
    fireEvent.change(getByPlaceholderText("Issue name"), {
      target: { value: "New" }
    })
    fireEvent.change(getByPlaceholderText("Issue content..."), {
      target: { value: "Body" }
    })
    fireEvent.click(getByText("Save"))

    await waitFor(() =>
      expect(updateIssue).toHaveBeenCalledWith("i", {
        name: "New",
        content: "Body"
      })
    )
    expect(addInstructionToIssue).toHaveBeenCalledWith("i", "i2")
    expect(removeInstructionFromIssue).toHaveBeenCalledWith("i", "i1")
    expect(router.push).toHaveBeenCalledWith("/w/p/issues/i")
  })

  it("handles no instructions gracefully", async () => {
    ;(getInstructionsByProjectId as jest.Mock).mockResolvedValue([])
    ;(getInstructionsForIssue as jest.Mock).mockResolvedValue([])
    const { queryByText } = render(<EditIssueForm issue={issue} />)
    await waitFor(() =>
      expect(getInstructionsByProjectId).toHaveBeenCalledWith("p")
    )
    expect(queryByText("Instruction")).not.toBeInTheDocument()
  })
})
