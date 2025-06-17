import React from "react"
import { render } from "@testing-library/react"
import { MessageMarkdown } from "../../../components/instructions/message-markdown"

jest.mock("remark-gfm", () => () => null)

jest.mock("../../../components/instructions/message-codeblock", () => ({
  MessageCodeBlock: jest.fn(() => <div data-testid="codeblock" />)
}))

jest.mock("../../../components/instructions/message-markdown-memoized", () => ({
  MessageMarkdownMemoized: ({ children, ...props }: any) => (
    <div data-testid="memo" {...props}>
      {children}
    </div>
  )
}))

describe("MessageMarkdown", () => {
  it("renders inline code and paragraphs", () => {
    const { container, queryByTestId } = render(
      <MessageMarkdown content={"Use `npm start`"} />
    )
    const code = container.querySelector("code")
    expect(code).toHaveTextContent("npm start")
    expect(queryByTestId("codeblock")).toBeNull()
  })

  it("renders code block using MessageCodeBlock", () => {
    const md = '```javascript\nconsole.log("hi")\n```'
    const { getByTestId } = render(<MessageMarkdown content={md} />)
    expect(getByTestId("codeblock")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { getByTestId } = render(
      <MessageMarkdown content="text" className="custom" />
    )
    expect(getByTestId("memo")).toHaveClass("custom")
  })
})
