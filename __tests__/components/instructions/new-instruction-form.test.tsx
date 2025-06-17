import { fireEvent, render, waitFor } from '@testing-library/react'
import NewInstructionForm from '../../../components/instructions/new-instruction-form'
import { createInstructionRecords } from '../../../db/queries/instructions-queries'

jest.mock('next/navigation', () => ({
  useParams: () => ({ projectId: 'p' }),
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() })
}))

jest.mock('../../../db/queries/instructions-queries', () => ({ createInstructionRecords: jest.fn() }))

describe('NewInstructionForm', () => {
  it('creates instruction and navigates', async () => {
    ;(createInstructionRecords as jest.Mock).mockResolvedValue([{ id: '1' }])
    const { getByPlaceholderText, getByText } = render(<NewInstructionForm />)
    fireEvent.change(getByPlaceholderText('Instruction name'), { target: { value: 'A' } })
    fireEvent.change(getByPlaceholderText('Instruction content...'), { target: { value: 'B' } })
    fireEvent.click(getByText('Create'))
    await waitFor(() => expect(createInstructionRecords).toHaveBeenCalled())
  })
})
