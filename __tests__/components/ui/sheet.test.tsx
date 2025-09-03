import React from 'react'
import { render } from '@testing-library/react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger
} from '../../../components/ui/sheet'

jest.mock('@radix-ui/react-dialog', () => {
  const React = require('react')
  return {
    Root: ({ children, ...props }: any) => <div data-testid="root" {...props}>{children}</div>,
    Trigger: ({ children, ...props }: any) => <button data-testid="trigger" {...props}>{children}</button>,
    Close: ({ children, ...props }: any) => <button data-testid="close" {...props}>{children}</button>,
    Portal: ({ children }: any) => <div data-testid="portal">{children}</div>,
    Overlay: React.forwardRef((props: any, ref) => <div ref={ref} data-testid="overlay" {...props} />),
    Content: React.forwardRef((props: any, ref) => <div ref={ref} data-testid="content" {...props} />),
    Title: React.forwardRef((props: any, ref) => <h2 ref={ref} data-testid="title" {...props} />),
    Description: React.forwardRef((props: any, ref) => <p ref={ref} data-testid="description" {...props} />)
  }
})

jest.mock('class-variance-authority', () => ({
  cva: () => () => 'variant'
}))

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('Sheet components', () => {
  it('renders trigger and content with default side', () => {
    const { getByTestId } = render(
      <Sheet>
        <SheetTrigger>open</SheetTrigger>
        <SheetContent>body</SheetContent>
      </Sheet>
    )
    expect(getByTestId('trigger')).toBeInTheDocument()
    expect(getByTestId('content').className).toContain('variant')
  })

  it('applies left side variant', () => {
    const { getByTestId } = render(<SheetContent side="left" className="extra" />)
    expect(getByTestId('content').className).toContain('variant')
    expect(getByTestId('content').className).toContain('extra')
  })

  it('renders header, title and footer', () => {
    const { getByText } = render(
      <>
        <SheetHeader>head</SheetHeader>
        <SheetTitle>title</SheetTitle>
        <SheetFooter>foot</SheetFooter>
      </>
    )
    expect(getByText('head')).toBeInTheDocument()
    expect(getByText('title')).toBeInTheDocument()
    expect(getByText('foot')).toBeInTheDocument()
  })
})
