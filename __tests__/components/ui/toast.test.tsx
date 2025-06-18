import React from 'react'
import { render, screen } from '@testing-library/react'
import { Toast, ToastProvider, ToastViewport } from '../../../components/ui/toast'

describe('Toast component', () => {
  it('renders with destructive variant', async () => {
    render(
      <ToastProvider>
        <Toast variant="destructive" defaultOpen>
          hi
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
    const toast = await screen.findByText('hi')
    expect(toast).toHaveClass('destructive')
  })
})
