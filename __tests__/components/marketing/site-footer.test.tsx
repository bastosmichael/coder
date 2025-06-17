import { render } from "@testing-library/react"
import { SiteFooter } from "../../../components/marketing/site-footer"

describe("SiteFooter", () => {
  it("displays socials and year", () => {
    const { getByText, container } = render(<SiteFooter />)
    expect(getByText("Twitter")).toBeInTheDocument()
    expect(container.textContent).toContain(
      new Date().getFullYear().toString()
    )
  })
})
