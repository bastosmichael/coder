import React from "react"
import { render } from "@testing-library/react"
import { Instruction } from "../../../components/instructions/instruction"
import { deleteInstruction } from "../../../db/queries/instructions-queries"

jest.mock("../../../db/queries/instructions-queries", () => ({
  deleteInstruction: jest.fn()
}))

jest.mock(
  "../../../components/dashboard/reusable/instruction-template-view",
  () => ({
    InstructionTemplateView: (props: any) => (
      <div data-testid="view">{JSON.stringify(props)}</div>
    )
  })
)

describe("Instruction component", () => {
  it("passes props to InstructionTemplateView", () => {
    const instruction = { id: "1", name: "A" } as any
    const { getByTestId } = render(<Instruction instruction={instruction} />)
    const data = getByTestId("view").textContent
    expect(data).toContain('"type":"instruction"')
    expect(data).toContain('"id":"1"')
  })
})
