import { render } from "@testing-library/react"
import { SiteFooter } from "../../../components/marketing/site-footer"

describe("SiteFooter", () => {
  it("displays socials and year", () => {
    const { getByText } = render(<SiteFooter />)
    expect(getByText("Twitter")).toBeInTheDocument()
    expect(getByText(/Ephemyral Coder/)).toHaveTextContent(
      new Date().getFullYear().toString()
    )
  })
})
