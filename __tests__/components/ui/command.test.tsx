import React from 'react'
import { render } from '@testing-library/react'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from '../../../components/ui/command'

jest.mock('@radix-ui/react-dialog', () => {
  const Overlay = React.forwardRef((props: any, ref) => (
    <div ref={ref} data-testid="overlay" {...props} />
  ))
  Overlay.displayName = 'Overlay'

  return {
    Root: ({ children, ...props }: any) => (
      <div data-testid="dialog" {...props}>{children}</div>
    ),
    Trigger: ({ children, ...props }: any) => (
      <button data-testid="trigger" {...props}>{children}</button>
    ),
    Close: ({ children, ...props }: any) => (
      <button data-testid="close" {...props}>{children}</button>
    ),
    Portal: ({ children }: any) => <div data-testid="portal">{children}</div>,
    Overlay,
    Content: React.forwardRef((props: any, ref) => (
      <div ref={ref} data-testid="dialog-content" {...props} />
    )),
    Title: React.forwardRef((props: any, ref) => (
      <h2 ref={ref} data-testid="title" {...props} />
    )),
    Description: React.forwardRef((props: any, ref) => (
      <p ref={ref} data-testid="description" {...props} />
    ))
  }
})

jest.mock('cmdk', () => {
  const Command = React.forwardRef((props: any, ref) => (
    <div ref={ref} data-testid="command" {...props} />
  ))
  const Input = React.forwardRef((props: any, ref) => (
    <input ref={ref} data-testid="input" {...props} />
  ))
  const List = React.forwardRef((props: any, ref) => (
    <div ref={ref} data-testid="list" {...props} />
  ))
  const Empty = React.forwardRef((props: any, ref) => (
    <div ref={ref} data-testid="empty" {...props} />
  ))
  const Group = React.forwardRef((props: any, ref) => (
    <div ref={ref} data-testid="group" {...props} />
  ))
  const Separator = React.forwardRef((props: any, ref) => (
    <div ref={ref} data-testid="separator" {...props} />
  ))
  const Item = React.forwardRef((props: any, ref) => (
    <div ref={ref} data-testid="item" {...props} />
  ))

  // mimic cmdk attaching subcomponents to Command
  Object.assign(Command, { Input, List, Empty, Group, Separator, Item })

  return { Command }
})

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('Command components', () => {
  it('renders dialog with children', () => {
    const { getByTestId } = render(
      <CommandDialog open>
        <span>Content</span>
      </CommandDialog>
    )
    expect(getByTestId('dialog')).toBeInTheDocument()
    expect(getByTestId('dialog-content')).toBeInTheDocument()
  })

  it('renders input and list items', () => {
    const { getByTestId, getByText } = render(
      <Command>
        <CommandInput placeholder="search" />
        <CommandList>
          <CommandItem>One</CommandItem>
        </CommandList>
      </Command>
    )
    expect(getByTestId('input')).toHaveAttribute('placeholder', 'search')
    expect(getByText('One')).toBeInTheDocument()
  })

  it('applies class to shortcut', () => {
    const { getByText } = render(<CommandShortcut className="extra">A</CommandShortcut>)
    expect(getByText('A').className).toContain('extra')
  })
})
