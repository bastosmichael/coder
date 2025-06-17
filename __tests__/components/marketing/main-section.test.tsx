import { render } from "@testing-library/react"
import MainSection from "../../../components/marketing/main-section"

describe("MainSection", () => {
  it("renders call to action", () => {
    const { getByText } = render(<MainSection />)
    expect(getByText(/Accelerate Your Development/)).toBeInTheDocument()
    const link = getByText("Connect GitHub").closest("a")
    expect(link?.getAttribute("href")).toBe("/onboarding")
  })
})
