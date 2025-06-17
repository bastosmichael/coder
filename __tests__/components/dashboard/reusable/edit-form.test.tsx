import { render } from '@testing-library/react'
import { EditForm } from '../../../../components/dashboard/reusable/edit-form'

describe('EditForm', () => {
  it('renders children inside form', () => {
    const action = jest.fn()
    const { getByText, container } = render(
      <EditForm action={action}><span>Child</span></EditForm>
    )
    expect(container.querySelector('form')).toBeInTheDocument()
    expect(getByText('Child')).toBeInTheDocument()
  })
})
