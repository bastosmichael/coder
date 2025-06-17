import { render } from "@testing-library/react"
import AnimatedGridPattern from "../../../components/magicui/animated-grid-pattern"

describe("AnimatedGridPattern", () => {
  it("renders the correct number of squares", () => {
    const { container } = render(
      <AnimatedGridPattern numSquares={3} width={10} height={10} />
    )
    // one background rect plus numSquares animated squares
    expect(container.querySelectorAll("rect").length).toBe(4)
  })
})
