import { render, waitFor } from "@testing-library/react"
import { IssueCreation } from "../../../components/issues/issue-creation"

jest.mock("../../../db/queries/templates-queries", () => ({
  getTemplatesWithInstructionsByProjectId: jest.fn()
}))
import { getTemplatesWithInstructionsByProjectId } from "../../../db/queries/templates-queries"

jest.mock("../../../components/issues/new-issue-form", () => ({
  NewIssueForm: ({ templates }: any) => <div>{templates.length}</div>
}))

describe("IssueCreation", () => {
  it("fetches templates and renders form", async () => {
    ;(getTemplatesWithInstructionsByProjectId as jest.Mock).mockResolvedValue([
      { id: "t" }
    ])
    const { findByText } = render(await IssueCreation({ projectId: "p" }))
    await waitFor(() =>
      expect(getTemplatesWithInstructionsByProjectId).toHaveBeenCalledWith("p")
    )
    expect(await findByText("1")).toBeInTheDocument()
  })
})
