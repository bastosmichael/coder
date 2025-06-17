import { fireEvent, render } from "@testing-library/react"
import { SiteHeader } from "../../../components/marketing/site-header"

describe("SiteHeader", () => {
  it("toggles mobile menu", () => {
    const { getAllByText, container } = render(<SiteHeader />)
    const buttons = getAllByText("Toggle menu")
    const nav = container.querySelector("nav")!
    expect(nav.className).toContain("pointer-events-none")
    fireEvent.click(buttons[0])
    expect(nav.className).not.toContain("pointer-events-none")
    fireEvent.click(getAllByText("Toggle menu")[1])
    expect(nav.className).toContain("pointer-events-none")
  })
})
