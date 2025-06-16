import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { CRUDForm } from '../../../../components/dashboard/reusable/crud-form'

jest.mock('next/navigation', () => ({ useRouter: () => ({ back: jest.fn() }) }))

describe('CRUDForm', () => {
  it('calls onSubmit with form data when valid', async () => {
    const onSubmit = jest.fn(() => Promise.resolve())
    const { getByPlaceholderText, getByText } = render(
      <CRUDForm itemName="Item" buttonText="Save" onSubmit={onSubmit} />
    )

    fireEvent.change(getByPlaceholderText('Item name'), { target: { value: 'A' } })
    fireEvent.change(getByPlaceholderText('Item content...'), { target: { value: 'B' } })
    fireEvent.click(getByText('Save'))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
  })

  it('does not submit when form invalid', () => {
    const onSubmit = jest.fn()
    const { getByText } = render(
      <CRUDForm itemName="Item" buttonText="Save" onSubmit={onSubmit} />
    )
    fireEvent.click(getByText('Save'))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
