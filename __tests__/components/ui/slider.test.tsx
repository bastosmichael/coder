import React from 'react'
import { render } from '@testing-library/react'
import { Slider } from '../../../components/ui/slider'

jest.mock('@radix-ui/react-slider', () => ({
  Root: ({ children, ...props }: any) => <div data-testid="root" {...props}>{children}</div>,
  Track: ({ children, ...props }: any) => <div data-testid="track" {...props}>{children}</div>,
  Range: (props: any) => <div data-testid="range" {...props} />,
  Thumb: (props: any) => <div data-testid="thumb" {...props} />
}))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('Slider', () => {
  it('renders track, range and thumb', () => {
    const { getByTestId } = render(<Slider />)
    expect(getByTestId('track')).toBeInTheDocument()
    expect(getByTestId('range')).toBeInTheDocument()
    expect(getByTestId('thumb')).toBeInTheDocument()
  })
})
