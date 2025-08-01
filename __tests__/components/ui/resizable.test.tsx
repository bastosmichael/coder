import { render } from '@testing-library/react'
import React from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../../../components/ui/resizable'

jest.mock('react-resizable-panels', () => ({
  PanelGroup: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Panel: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  PanelResizeHandle: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}))

describe('Resizable components', () => {
  it('applies className on ResizablePanelGroup', () => {
    const { container } = render(
      <ResizablePanelGroup className="extra">
        <ResizablePanel>Content</ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(container.firstChild).toHaveClass('extra')
  })

  it('renders handle icon when withHandle', () => {
    const { container } = render(<ResizableHandle withHandle />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render handle icon when withHandle is false', () => {
    const { container } = render(<ResizableHandle />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })
})
