import React from "react"
import { render, fireEvent } from "@testing-library/react"
import {
  MessageCodeBlock,
  generateRandomString
} from "../../../components/instructions/message-codeblock"
import { useCopyToClipboard } from "../../../components/instructions/use-copy-to-clipboard"

jest.mock("../../../components/instructions/use-copy-to-clipboard")

describe("MessageCodeBlock", () => {
  beforeEach(() => {
    ;(useCopyToClipboard as jest.Mock).mockReturnValue({
      isCopied: false,
      copyToClipboard: jest.fn()
    })
  })

  it("calls copyToClipboard when copy button clicked", () => {
    const { container } = render(
      <MessageCodeBlock language="js" value="code" />
    )
    const mock = (useCopyToClipboard as jest.Mock).mock.results[0].value
    const buttons = container.querySelectorAll("button")
    fireEvent.click(buttons[1])
    expect(mock.copyToClipboard).toHaveBeenCalledWith("code")
  })

  it("downloads file when download button clicked", () => {
    window.prompt = jest.fn(() => "file.js")
    const link: any = document.createElement("a")
    jest.spyOn(document, "createElement").mockReturnValue(link)
    const clickSpy = jest.spyOn(link, "click")
    jest.spyOn(window.URL, "createObjectURL").mockReturnValue("blob:url")
    jest.spyOn(window.URL, "revokeObjectURL").mockImplementation(() => {})
    const append = jest.spyOn(document.body, "appendChild")
    const remove = jest.spyOn(document.body, "removeChild")

    const { container } = render(
      <MessageCodeBlock language="js" value="code" />
    )
    const buttons = container.querySelectorAll("button")
    fireEvent.click(buttons[0])

    expect(window.prompt).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    expect(append).toHaveBeenCalledWith(link)
    expect(remove).toHaveBeenCalledWith(link)
  })
})

describe("generateRandomString", () => {
  it("generates a string of given length", () => {
    const str = generateRandomString(5)
    expect(str).toHaveLength(5)
    expect(str).toMatch(/^[A-Z0-9]+$/)
  })

  it("generates lowercase when requested", () => {
    const str = generateRandomString(5, true)
    expect(str).toMatch(/^[a-z0-9]+$/)
  })
})
