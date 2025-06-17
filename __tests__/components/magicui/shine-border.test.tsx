import React from "react"
import { render } from "@testing-library/react"
import ShineBorder from "../../../components/magicui/shine-border"

describe("ShineBorder", () => {
  it("renders children", () => {
    const { getByText } = render(<ShineBorder>Hi</ShineBorder>)
    expect(getByText("Hi")).toBeInTheDocument()
  })

  it("applies custom styles and className", () => {
    const { container } = render(
      <ShineBorder
        borderRadius={5}
        borderWidth={2}
        duration={10}
        color="red"
        className="custom"
      >
        A
      </ShineBorder>
    )
    const outer = container.firstChild as HTMLElement
    expect(outer).toHaveClass("custom")
    expect(outer).toHaveStyle("--border-radius: 5px")
    const inner = outer.firstChild as HTMLElement
    expect(inner).toHaveStyle("--border-width: 2px")
    expect(inner).toHaveStyle("--shine-pulse-duration: 10s")
  })
})
