import { fireEvent, render } from "@testing-library/react"
import { InstructionTemplateView } from "../../../../components/dashboard/reusable/instruction-template-view"

jest.mock("next/navigation", () => ({ useRouter: () => ({ push: jest.fn() }) }))
import { useRouter } from "next/navigation"

describe("InstructionTemplateView", () => {
  it("displays content and handles delete", async () => {
    const onDelete = jest.fn()
    const router = useRouter() as any
    const { getByText } = render(
      <InstructionTemplateView
        item={{ id: "1", name: "A", content: "B", projectId: "p" }}
        type="instruction"
        onDelete={onDelete}
        attachedInstructions={[{ id: "i", name: "I", content: "IC" }]}
      />
    )

    expect(getByText("A")).toBeInTheDocument()
    fireEvent.click(getByText("Edit"))
    expect(router.push).toHaveBeenCalledWith("./1/edit")
    fireEvent.click(getByText("Delete"))
    fireEvent.click(getByText("Delete"))
    expect(onDelete).toHaveBeenCalledWith("1")
  })
})
