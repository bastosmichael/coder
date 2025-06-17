import { fireEvent, render, waitFor } from '@testing-library/react'
import EditInstructionForm from '../../../components/instructions/edit-instruction-form'
import { updateInstruction } from '../../../db/queries/instructions-queries'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }))
jest.mock('../../../db/queries/instructions-queries', () => ({ updateInstruction: jest.fn() }))

describe('EditInstructionForm', () => {
  const instruction = { id: '1', name: 'Name', content: 'Content' } as any

  it('updates instruction and navigates', async () => {
    const { getByPlaceholderText, getByText } = render(
      <EditInstructionForm instruction={instruction} />
    )
    fireEvent.change(getByPlaceholderText('Instruction name'), { target: { value: 'New' } })
    fireEvent.change(getByPlaceholderText('Instruction content...'), { target: { value: 'Body' } })
    fireEvent.click(getByText('Save'))

    await waitFor(() => expect(updateInstruction).toHaveBeenCalled())
  })
})
