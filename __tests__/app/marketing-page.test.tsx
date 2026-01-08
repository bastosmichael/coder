import { render, screen } from "@testing-library/react"

jest.mock("react-dom", () => {
  const actual = jest.requireActual("react-dom")

  return {
    ...actual,
    useFormState: () => [{ message: "", status: "success" }, jest.fn()]
  }
})

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

jest.mock("../../db/queries/app-config-queries", () => ({
  getAppConfigByUserId: jest.fn()
}))

describe("MarketingPage", () => {
  it("renders the config form", async () => {
    const { default: MarketingPage } = await import("../../app/(marketing)/page")
    const Page = await MarketingPage()
    render(Page as React.ReactElement)
    expect(screen.getByText("Connect your APIs")).toBeInTheDocument()
    expect(screen.getByLabelText("OpenAI API key")).toBeInTheDocument()
  })
})
