import React from "react"
import { render, waitFor } from "@testing-library/react"
import AnimatedGridPattern from "../../../components/magicui/animated-grid-pattern"

describe("AnimatedGridPattern extra", () => {
  const OriginalRO = global.ResizeObserver
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {})
    global.ResizeObserver = class {
      private cb: any
      constructor(cb: any) {
        this.cb = cb
      }
      observe() {
        this.cb([{ contentRect: { width: 100, height: 100 } }])
      }
      unobserve() {}
      disconnect() {}
    }
  })

  afterEach(() => {
    global.ResizeObserver = OriginalRO
    ;(console.error as jest.Mock).mockRestore()
  })

  it("updates squares when numSquares changes", async () => {
    const { container, rerender } = render(
      <AnimatedGridPattern numSquares={2} width={10} height={10} />
    )
    await waitFor(() => expect(container.querySelectorAll("rect").length).toBe(3))

    rerender(<AnimatedGridPattern numSquares={4} width={10} height={10} />)
    await waitFor(() => expect(container.querySelectorAll("rect").length).toBe(5))
  })
})
