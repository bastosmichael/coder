import { render } from "@testing-library/react"
import { TemplatesList } from "../../../components/templates/template-list"

jest.mock("../../../db/queries/templates-queries", () => ({
  deleteTemplate: jest.fn()
}))

describe("TemplatesList", () => {
  const templates = [
    {
      id: "1",
      name: "T",
      content: "c",
      projectId: "p",
      templatesToInstructions: []
    }
  ]

  it("renders templates", () => {
    const { getByText } = render(
      <TemplatesList
        templatesWithInstructions={templates}
        instructions={[]}
        projectId="p"
      />
    )
    expect(getByText("T")).toBeInTheDocument()
  })

  it("shows message when empty", () => {
    const { getByText } = render(
      <TemplatesList
        templatesWithInstructions={[]}
        instructions={[]}
        projectId="p"
      />
    )
    expect(getByText("No templates found.")).toBeInTheDocument()
  })
})
