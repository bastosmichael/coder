import { fireEvent, render } from "@testing-library/react"
import { InstructionTemplateView } from "../../../../components/dashboard/reusable/instruction-template-view"

const push = jest.fn()

jest.mock("next/navigation", () => ({ useRouter: () => ({ push }) }))

jest.mock("../../../../components/instructions/message-markdown", () => ({
  MessageMarkdown: ({ content }: any) => <div>{content}</div>
}))
import { useRouter } from "next/navigation"

describe("InstructionTemplateView", () => {
  it("displays content and handles delete", async () => {
    const onDelete = jest.fn()
    const router = useRouter() as any
    const { getByText, getAllByText } = render(
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
    fireEvent.click(getAllByText("Delete")[1])
    expect(onDelete).toHaveBeenCalledWith("1")
  })
})
