import { fireEvent, render, waitFor } from "@testing-library/react"
import EditTemplateForm from "../../../components/templates/edit-template-form"

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() })
}))
import { useRouter } from "next/navigation"

jest.mock("../../../db/queries/templates-queries", () => ({
  updateTemplate: jest.fn()
}))
import { updateTemplate } from "../../../db/queries/templates-queries"

jest.mock("../../../components/templates/template-select", () => ({
  TemplateSelect: () => <div>Select</div>
}))

describe("EditTemplateForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const template = {
    id: "t1",
    name: "T",
    content: "C",
    projectId: "p",
    templatesToInstructions: []
  }

  it("updates template and navigates", async () => {
    const router = useRouter() as any
    const instructions = []
    const { getByPlaceholderText, getByText } = render(
      <EditTemplateForm
        instructions={instructions}
        templateWithInstructions={template as any}
      />
    )
    fireEvent.change(getByPlaceholderText("Template name"), {
      target: { value: "U" }
    })
    fireEvent.change(getByPlaceholderText("Template content..."), {
      target: { value: "V" }
    })
    fireEvent.click(getByText("Save"))
    await waitFor(() => expect(updateTemplate).toHaveBeenCalled())
    expect(router.push).toHaveBeenCalledWith("../t1")
    expect(router.refresh).toHaveBeenCalled()
  })
})
