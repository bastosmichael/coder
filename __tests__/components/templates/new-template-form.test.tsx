import { fireEvent, render, waitFor } from "@testing-library/react"
import NewTemplateForm from "../../../components/templates/new-template-form"

jest.mock("next/navigation", () => ({
  useParams: () => ({ projectId: "p" }),
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() })
}))
import { useRouter } from "next/navigation"

jest.mock("../../../db/queries/templates-queries", () => ({
  createTemplateRecords: jest.fn()
}))
import { createTemplateRecords } from "../../../db/queries/templates-queries"

jest.mock("../../../db/queries/templates-to-instructions-queries", () => ({
  addInstructionToTemplate: jest.fn()
}))
import { addInstructionToTemplate } from "../../../db/queries/templates-to-instructions-queries"

jest.mock("../../../components/ui/multi-select", () => ({
  MultiSelect: ({ onToggleSelect }: any) => (
    <button onClick={() => onToggleSelect(["i1"])}>select</button>
  )
}))

describe("NewTemplateForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("creates template and attaches instructions", async () => {
    ;(createTemplateRecords as jest.Mock).mockResolvedValue([{ id: "t1" }])
    const router = useRouter() as any
    const instructions = [{ id: "i1", name: "I" }]
    const { getByText, getByPlaceholderText } = render(
      <NewTemplateForm instructions={instructions as any} />
    )

    fireEvent.click(getByText("select"))
    fireEvent.change(getByPlaceholderText("Template name"), {
      target: { value: "T" }
    })
    fireEvent.change(getByPlaceholderText("Template content..."), {
      target: { value: "C" }
    })
    fireEvent.click(getByText("Create"))

    await waitFor(() => expect(createTemplateRecords).toHaveBeenCalled())
    expect(addInstructionToTemplate).toHaveBeenCalledWith("t1", "i1")
    expect(router.push).toHaveBeenCalledWith("../templates/t1")
  })
})
