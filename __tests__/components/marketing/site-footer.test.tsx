import { render } from "@testing-library/react"
import { SiteFooter } from "../../../components/marketing/site-footer"

describe("SiteFooter", () => {
  it("displays configuration note", () => {
    const { getByText } = render(<SiteFooter />)
    expect(
      getByText("Configure your API access to continue.")
    ).toBeInTheDocument()
  })
})
