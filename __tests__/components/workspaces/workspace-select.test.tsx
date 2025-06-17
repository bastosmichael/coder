import { fireEvent, render, waitFor } from "@testing-library/react"
import { WorkspaceSelect } from "../../../components/workspaces/workspace-select"

jest.mock("../../../db/queries/projects-queries", () => ({
  getMostRecentIssueWithinProjects: jest.fn()
}))
import { getMostRecentIssueWithinProjects } from "../../../db/queries/projects-queries"

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useParams: () => ({ workspaceId: "w1" })
}))
import { useRouter } from "next/navigation"

const workspaces = [
  { id: "w1", name: "A" },
  { id: "w2", name: "B" }
]

describe("WorkspaceSelect", () => {
  beforeEach(() => jest.clearAllMocks())

  it("renders and selects workspace with recent issue", async () => {
    ;(getMostRecentIssueWithinProjects as jest.Mock).mockResolvedValue({
      projectId: "p1"
    })
    const router = useRouter() as any
    const { getByRole, getByText } = render(
      <WorkspaceSelect workspaces={workspaces as any} />
    )
    fireEvent.click(getByRole("combobox"))
    fireEvent.click(getByText("B"))
    await waitFor(() =>
      expect(getMostRecentIssueWithinProjects).toHaveBeenCalledWith("w2")
    )
    expect(router.push).toHaveBeenCalledWith("/w2/p1/issues")
  })

  it("navigates to workspace when no recent issue", async () => {
    ;(getMostRecentIssueWithinProjects as jest.Mock).mockResolvedValue(null)
    const router = useRouter() as any
    const { getByRole, getByText } = render(
      <WorkspaceSelect workspaces={workspaces as any} />
    )
    fireEvent.click(getByRole("combobox"))
    fireEvent.click(getByText("B"))
    await waitFor(() =>
      expect(getMostRecentIssueWithinProjects).toHaveBeenCalledWith("w2")
    )
    expect(router.push).toHaveBeenCalledWith("/w2")
  })
})
