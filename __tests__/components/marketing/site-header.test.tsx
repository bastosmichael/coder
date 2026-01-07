import { render } from "@testing-library/react"
import { SiteHeader } from "../../../components/marketing/site-header"

describe("SiteHeader", () => {
  it("shows onboarding link", () => {
    const { getByText } = render(<SiteHeader />)
    const link = getByText("Go to onboarding").closest("a")
    expect(link?.getAttribute("href")).toBe("/onboarding")
  })
})
