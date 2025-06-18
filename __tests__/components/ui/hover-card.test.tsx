import React from 'react'
import { render } from '@testing-library/react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../../components/ui/hover-card'

jest.mock('@radix-ui/react-hover-card', () => ({
  Root: ({ children }: any) => <div data-testid="root">{children}</div>,
  Trigger: ({ children }: any) => <button data-testid="trigger">{children}</button>,
  Content: React.forwardRef((props: any, ref) => <div ref={ref} data-testid="content" {...props} />)
}))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('HoverCard', () => {
  it('renders trigger and content', () => {
    const { getByTestId } = render(
      <HoverCard>
        <HoverCardTrigger>Open</HoverCardTrigger>
        <HoverCardContent className="extra" />
      </HoverCard>
    )
    expect(getByTestId('trigger')).toBeInTheDocument()
    expect(getByTestId('content').className).toContain('extra')
  })
})
