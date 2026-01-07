import { render, screen } from "@testing-library/react"
import MarketingPage from "../../app/(marketing)/page"

jest.mock("../../db/queries/app-config-queries", () => ({
  getAppConfigByUserId: jest.fn()
}))

describe("MarketingPage", () => {
  it("renders the config form", async () => {
    const Page = await MarketingPage()
    render(Page as React.ReactElement)
    expect(screen.getByText("Connect your APIs")).toBeInTheDocument()
    expect(screen.getByLabelText("OpenAI API key")).toBeInTheDocument()
  })
})
