import React from 'react'
import { render } from '@testing-library/react'
import { Toast, ToastProvider } from '../../../components/ui/toast'

describe('Toast component', () => {
  it('renders with destructive variant', () => {
    const { getByText } = render(
      <ToastProvider>
        <Toast variant="destructive" defaultOpen>
          hi
        </Toast>
      </ToastProvider>
    )
    const toast = getByText('hi').parentElement
    expect(toast).toHaveClass('destructive')
  })
})
