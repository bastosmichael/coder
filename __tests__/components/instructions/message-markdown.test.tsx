import React from "react"
import { render } from "@testing-library/react"
import { MessageMarkdown } from "../../../components/instructions/message-markdown"

jest.mock("remark-gfm", () => () => null)
jest.mock("remark-math", () => () => null)

jest.mock("../../../components/instructions/message-codeblock", () => ({
  MessageCodeBlock: jest.fn(() => <div data-testid="codeblock" />)
}))

jest.mock("../../../components/instructions/message-markdown-memoized", () => {
  const React = require("react")
  return {
    MessageMarkdownMemoized: ({ children, components, className }: any) => {
      const Code = components?.code
      let content
      if (typeof children === "string" && children.startsWith("```")) {
        const [first, ...rest] = children.split("\n")
        const lang = first.replace(/```/, "")
        const code = rest.join("\n").replace(/```$/, "")
        content = (
          <Code className={`language-${lang}`}>{code + "\n"}</Code>
        )
      } else if (typeof children === "string") {
        const match = /`([^`]+)`/.exec(children)
        if (match) {
          content = (
            <p className="mb-2 last:mb-0">
              {children.replace(/`([^`]+)`/, "")}
              <code>{match[1]}</code>
            </p>
          )
        } else {
          content = <p className="mb-2 last:mb-0">{children}</p>
        }
      } else {
        content = children
      }
      return (
        <div data-testid="memo" className={className}>
          {content}
        </div>
      )
    }
  }
})

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
