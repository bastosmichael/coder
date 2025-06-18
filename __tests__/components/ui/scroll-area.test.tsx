import React from 'react'
import { render } from '@testing-library/react'
import { ScrollArea, ScrollBar } from '../../../components/ui/scroll-area'

jest.mock('@radix-ui/react-scroll-area', () => ({
  Root: React.forwardRef((props: any, ref) => <div ref={ref} data-testid="root" {...props} />),
  Viewport: (props: any) => <div data-testid="viewport" {...props} />,
  Corner: (props: any) => <div data-testid="corner" {...props} />,
  ScrollAreaScrollbar: React.forwardRef((props: any, ref) => <div ref={ref} data-testid="scrollbar" {...props} />),
  ScrollAreaThumb: (props: any) => <div data-testid="thumb" {...props} />
}))

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('ScrollArea components', () => {
  it('renders ScrollArea with children and viewport', () => {
    const { getByTestId } = render(
      <ScrollArea>
        <span>child</span>
      </ScrollArea>
    )
    expect(getByTestId('root')).toBeInTheDocument()
    expect(getByTestId('viewport')).toBeInTheDocument()
    expect(getByTestId('corner')).toBeInTheDocument()
  })

  it('ScrollBar renders orientation classes', () => {
    const { getByTestId } = render(<ScrollBar orientation="horizontal" />)
    const bar = getByTestId('scrollbar')
    expect(bar.className).toContain('flex-col')
  })
})
