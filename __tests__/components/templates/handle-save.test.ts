import { updateTemplateInstructions } from "../../../components/templates/handle-save"

jest.mock("../../../db/queries/templates-to-instructions-queries", () => {
  const addInstructionToTemplate = jest.fn()
  const getInstructionsForTemplate = jest.fn()
  const removeInstructionFromTemplate = jest.fn()
  return {
    __esModule: true,
    addInstructionToTemplate,
    getInstructionsForTemplate,
    removeInstructionFromTemplate
  }
})

import {
  addInstructionToTemplate,
  getInstructionsForTemplate,
  removeInstructionFromTemplate
} from "../../../db/queries/templates-to-instructions-queries"

describe("updateTemplateInstructions", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("adds and removes instructions correctly", async () => {
    ;(getInstructionsForTemplate as jest.Mock).mockResolvedValue([
      { instructionId: "1" },
      { instructionId: "2" }
    ])
    const result = await updateTemplateInstructions("t1", ["2", "3"])
    expect(removeInstructionFromTemplate).toHaveBeenCalledWith("t1", "1")
    expect(addInstructionToTemplate).toHaveBeenCalledWith("t1", "3")
    expect(result).toEqual({ success: true })
  })

  it("returns failure on error", async () => {
    ;(getInstructionsForTemplate as jest.Mock).mockRejectedValue(
      new Error("fail")
    )
    const spy = jest.spyOn(console, "error").mockImplementation(() => {})
    const result = await updateTemplateInstructions("t1", ["1"])
    expect(result).toEqual({
      success: false,
      error: "Failed to update template instructions"
    })
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
