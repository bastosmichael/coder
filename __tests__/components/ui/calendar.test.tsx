import { render } from '@testing-library/react'
import { Calendar } from '../../../components/ui/calendar'

jest.mock('react-day-picker', () => ({
  DayPicker: (props: any) => <div data-testid="daypicker" {...props} />
}))

jest.mock('../../../components/ui/button', () => ({
  buttonVariants: () => 'btn',
}))

describe('Calendar component', () => {
  it('renders with default props', () => {
    const { getByTestId } = render(<Calendar />)
    expect(getByTestId('daypicker')).toBeInTheDocument()
  })

  it('passes custom class and props', () => {
    const { getByTestId } = render(
      <Calendar showOutsideDays={false} className="custom" />
    )
    const dayPicker = getByTestId('daypicker')
    expect(dayPicker.getAttribute('class')).toContain('custom')
    // React omits boolean attributes when false
    expect(dayPicker.getAttribute('showOutsideDays')).toBeNull()
  })
})
