import { fireEvent, render } from "@testing-library/react"
import { IssuesList } from "../../../components/issues/issues-list"

jest.mock("../../../db/queries/issues-queries", () => ({
  deleteIssue: jest.fn()
}))
import { deleteIssue } from "../../../db/queries/issues-queries"

describe("IssuesList", () => {
  beforeEach(() => jest.clearAllMocks())

  const issues = [{ id: "1", name: "Issue", content: "", projectId: "p" }]

  it("renders items and deletes", () => {
    const { getByText } = render(<IssuesList issues={issues as any} />)
    expect(getByText("Issue")).toBeInTheDocument()
    fireEvent.click(getByText("Delete"))
    expect(deleteIssue).toHaveBeenCalledWith("1")
  })

  it("shows empty message", () => {
    const { getByText } = render(<IssuesList issues={[]} />)
    expect(getByText("No issues found.")).toBeInTheDocument()
  })
})
