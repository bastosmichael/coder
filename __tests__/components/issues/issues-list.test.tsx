import { fireEvent, render } from "@testing-library/react"
import { IssuesList } from "../../../components/issues/issues-list"

jest.mock("../../../db/queries/issues-queries", () => ({
  deleteIssue: jest.fn(),
  updateIssuesFromGitHub: jest.fn()
}))
import { deleteIssue, updateIssuesFromGitHub } from "../../../db/queries/issues-queries"

const router = { refresh: jest.fn() }
jest.mock("next/navigation", () => ({ useRouter: () => router }))

describe("IssuesList", () => {
  beforeEach(() => jest.clearAllMocks())

  const issues = [{ id: "1", name: "Issue", content: "", projectId: "p" }]

  it("renders items and deletes", () => {
    const { getByText, getAllByRole } = render(
      <IssuesList issues={issues as any} projectId="p" />
    )
    expect(getByText("Issue")).toBeInTheDocument()
    fireEvent.click(getAllByRole("button")[2])
    fireEvent.click(getByText("Delete"))
    expect(deleteIssue).toHaveBeenCalledWith("1")
  })

  it("shows empty message", () => {
    const { getByText } = render(<IssuesList issues={[]} projectId="p" />)
    expect(getByText("No issues found.")).toBeInTheDocument()
  })

  it("updates issues", () => {
    const { getByRole } = render(
      <IssuesList issues={issues as any} projectId="p" />
    )
    fireEvent.click(getByRole("button", { name: "Refresh issues" }))
    expect(updateIssuesFromGitHub).toHaveBeenCalledWith("p")
  })
})
