import React from 'react'
import { render } from '@testing-library/react'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '../../../components/ui/input-otp'

// mock input-otp library
jest.mock('input-otp', () => {
  const React = require('react')
  const slots = [{ char: 'A', hasFakeCaret: true, isActive: true }]
  return {
    __esModule: true,
    OTPInput: React.forwardRef((props: any, ref) => (
      <div ref={ref} data-testid="otp" {...props} />
    )),
    OTPInputContext: React.createContext({ slots })
  }
})

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('InputOTP components', () => {
  it('renders InputOTP container', () => {
    const { getByTestId } = render(<InputOTP data-testid="otp" />)
    expect(getByTestId('otp')).toBeInTheDocument()
  })

  it('renders InputOTPSlot with char and caret', () => {
    const { container, getByText } = render(<InputOTPSlot index={0} />)
    expect(getByText('A')).toBeInTheDocument()
    expect(container.querySelector('.animate-caret-blink')).toBeInTheDocument()
  })

  it('InputOTPSeparator has role separator', () => {
    const { getByRole } = render(<InputOTPSeparator />)
    expect(getByRole('separator')).toBeInTheDocument()
  })

  it('InputOTPGroup forwards class names', () => {
    const { container } = render(<InputOTPGroup className="extra" />)
    expect(container.firstChild).toHaveClass('extra')
  })
})
