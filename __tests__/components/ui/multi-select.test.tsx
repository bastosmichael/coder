import { fireEvent, render } from '@testing-library/react'
import { MultiSelect } from '../../../components/ui/multi-select'

describe('MultiSelect', () => {
  const data = [
    { id: '1', name: 'A' },
    { id: '2', name: 'B' }
  ]

  it('shows placeholder when none selected and toggles selection', () => {
    const onToggle = jest.fn()
    const { getByRole, getByText } = render(
      <MultiSelect label='instruction' data={data} selectedIds={[]} onToggleSelect={onToggle} />
    )

    const button = getByRole('combobox')
    expect(button.textContent).toContain('Select instructions...')

    fireEvent.click(button)
    fireEvent.click(getByText('A'))
    expect(onToggle).toHaveBeenCalledWith(['1'])
  })

  it('displays selected names', () => {
    const { getByRole } = render(
      <MultiSelect label='instruction' data={data} selectedIds={['1']} onToggleSelect={() => {}} />
    )
    expect(getByRole('combobox').textContent).toContain('A')
  })
})
