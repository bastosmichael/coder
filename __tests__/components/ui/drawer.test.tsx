import React from 'react'
import { render } from '@testing-library/react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerOverlay
} from '../../../components/ui/drawer'

jest.mock('vaul', () => {
  const React = require('react')
  return {
    Drawer: {
      Root: (props: any) => <div data-testid="root" {...props} />,
      Trigger: (props: any) => <button data-testid="trigger" {...props} />,
      Portal: ({ children }: any) => <div data-testid="portal">{children}</div>,
      Close: (props: any) => <button data-testid="close" {...props} />,
      Overlay: React.forwardRef((props: any, ref) => <div ref={ref} data-testid="overlay" {...props} />),
      Content: React.forwardRef((props: any, ref) => <div ref={ref} data-testid="content" {...props} />),
      Title: React.forwardRef((props: any, ref) => <h1 ref={ref} {...props} />),
      Description: React.forwardRef((props: any, ref) => <p ref={ref} {...props} />)
    }
  }
})

describe('Drawer component', () => {
  it('renders root with props', () => {
    const { getByTestId } = render(<Drawer open />)
    expect(getByTestId('root')).toHaveAttribute('open','')
  })

  it('renders overlay inside portal', () => {
    const { getByTestId } = render(
      <DrawerContent>Inner</DrawerContent>
    )
    expect(getByTestId('overlay')).toBeInTheDocument()
    expect(getByTestId('content')).toBeInTheDocument()
  })

  it('renders header and footer', () => {
    const { getByText } = render(
      <div>
        <DrawerHeader>Header</DrawerHeader>
        <DrawerFooter>Footer</DrawerFooter>
      </div>
    )
    expect(getByText('Header')).toBeInTheDocument()
    expect(getByText('Footer')).toBeInTheDocument()
  })
})
