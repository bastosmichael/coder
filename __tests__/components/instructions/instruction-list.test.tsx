import { render } from '@testing-library/react'
import { InstructionsList } from '../../../components/instructions/instruction-list'

jest.mock('../../../db/queries/instructions-queries', () => ({ deleteInstruction: jest.fn() }))

describe('InstructionsList', () => {
  it('renders list of instructions', () => {
    const instructions = [{ id: '1', name: 'A', content: 'c' } as any]
    const { getByText } = render(<InstructionsList instructions={instructions} />)
    expect(getByText('A')).toBeInTheDocument()
  })

  it('shows empty message when no instructions', () => {
    const { getByText } = render(<InstructionsList instructions={[]} />)
    expect(getByText('No instructions found.')).toBeInTheDocument()
  })
})
