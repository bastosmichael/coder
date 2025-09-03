import React from 'react'
import { render } from '@testing-library/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../../../components/ui/dialog'

jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, ...props }: any) => <div data-testid="root" {...props}>{children}</div>,
  Trigger: ({ children, ...props }: any) => <button data-testid="trigger" {...props}>{children}</button>,
  Portal: ({ children }: any) => <div data-testid="portal">{children}</div>,
  Overlay: React.forwardRef((props: any, ref) => <div ref={ref} data-testid="overlay" {...props} />),
  Content: React.forwardRef((props: any, ref) => <div ref={ref} data-testid="content" {...props} />),
  Close: ({ children, ...props }: any) => <button data-testid="close" {...props}>{children}</button>,
  Title: React.forwardRef((props: any, ref) => <h2 ref={ref} data-testid="title" {...props} />),
  Description: React.forwardRef((props: any, ref) => <p ref={ref} data-testid="description" {...props} />),
}))

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('Dialog components', () => {
  it('renders trigger and content with overlay', () => {
    const { getByTestId } = render(
      <Dialog>
        <DialogTrigger>open</DialogTrigger>
        <DialogContent>body</DialogContent>
      </Dialog>
    )
    expect(getByTestId('trigger')).toBeInTheDocument()
    expect(getByTestId('content')).toBeInTheDocument()
    expect(getByTestId('overlay')).toBeInTheDocument()
  })

  it('renders title and description', () => {
    const { getByTestId } = render(
      <>
        <DialogTitle>title</DialogTitle>
        <DialogDescription>desc</DialogDescription>
      </>
    )
    expect(getByTestId('title')).toHaveTextContent('title')
    expect(getByTestId('description')).toHaveTextContent('desc')
  })
})
