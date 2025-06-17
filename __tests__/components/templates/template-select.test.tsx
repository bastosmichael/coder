import { fireEvent, render, waitFor } from '@testing-library/react'
import { TemplateSelect } from '../../../components/templates/template-select'

const updateTemplateInstructions = jest.fn()
jest.mock('../../../components/templates/handle-save', () => ({
  updateTemplateInstructions: (...args: any[]) => updateTemplateInstructions(...args)
}))

describe('TemplateSelect', () => {
  beforeEach(() => {
    updateTemplateInstructions.mockReset()
  })

  const instructions = [
    { id: 'i1', name: 'One' },
    { id: 'i2', name: 'Two' }
  ]
  const template = {
    id: 't1',
    projectId: 'p1',
    name: 'temp',
    content: 'c',
    templatesToInstructions: [
      { templateId: 't1', instructionId: 'i1', instruction: instructions[0] }
    ]
  }

  it('renders selected instructions and updates on select', async () => {
    const { getByRole, getByText } = render(
      <TemplateSelect instructions={instructions} templateWithInstructions={template} />
    )

    expect(getByRole('combobox')).toHaveTextContent('One')

    fireEvent.click(getByRole('combobox'))
    fireEvent.click(getByText('Two'))
    await waitFor(() =>
      expect(updateTemplateInstructions).toHaveBeenCalledWith('t1', ['i1', 'i2'])
    )
  })
})
