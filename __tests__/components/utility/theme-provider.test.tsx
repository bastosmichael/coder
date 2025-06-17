import React from "react"
import { render } from "@testing-library/react"
import { ThemeProvider } from "../../../components/utility/theme-provider"

jest.mock("next-themes", () => ({
  ThemeProvider: ({ children, ...props }: any) => (
    <div data-testid="next-theme" {...props}>
      {children}
    </div>
  )
}))

describe("ThemeProvider", () => {
  it("renders children inside NextThemesProvider", () => {
    const { getByTestId } = render(
      <ThemeProvider attribute="class">
        <span data-testid="child">A</span>
      </ThemeProvider>
    )
    expect(getByTestId("next-theme")).toContainElement(getByTestId("child"))
  })
})
