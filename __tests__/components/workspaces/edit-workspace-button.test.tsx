import { fireEvent, render } from "@testing-library/react"
import { EditWorkspaceButton } from "../../../components/workspaces/edit-workspace-button"

const mockPush = jest.fn()

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }))
import { useRouter } from "next/navigation"

describe("EditWorkspaceButton", () => {
  it("navigates to edit page on click", () => {
    const router = useRouter() as any
    const { getByText } = render(<EditWorkspaceButton workspaceId="w1" />)
    fireEvent.click(getByText("Workspace Settings"))
    expect(router.push).toHaveBeenCalledWith("/w1/edit")
  })
})
