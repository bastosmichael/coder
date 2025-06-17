import { render } from "@testing-library/react"
import { Template } from "../../../components/templates/template"

jest.mock(
  "../../../components/dashboard/reusable/instruction-template-view",
  () => ({
    InstructionTemplateView: jest.fn(() => <div>ITV</div>)
  })
)
import { InstructionTemplateView } from "../../../components/dashboard/reusable/instruction-template-view"

jest.mock("../../../db/queries/templates-queries", () => ({
  deleteTemplate: jest.fn()
}))

describe("Template component", () => {
  it("passes attached instructions", () => {
    const template = {
      id: "t1",
      name: "T",
      content: "C",
      projectId: "p",
      templatesToInstructions: [
        {
          templateId: "t1",
          instructionId: "i1",
          instruction: { id: "i1", name: "I", content: "IC" }
        }
      ]
    }
    const { getByText } = render(<Template template={template as any} />)
    expect(getByText("ITV")).toBeInTheDocument()
    const props = (InstructionTemplateView as jest.Mock).mock.calls[0][0]
    expect(props.attachedInstructions).toEqual([
      { id: "i1", name: "I", content: "IC" }
    ])
  })
})
