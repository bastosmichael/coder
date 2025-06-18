import { render } from '@testing-library/react'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../../../components/ui/tooltip'

jest.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children }: any) => <div data-testid="provider">{children}</div>,
  Root: ({ children }: any) => <div data-testid="root">{children}</div>,
  Trigger: ({ children }: any) => <button data-testid="trigger">{children}</button>,
  Content: React.forwardRef((props: any, ref) => <div ref={ref} data-testid="content" {...props} />)
}))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('Tooltip component', () => {
  it('renders provider and content', () => {
    const { getByTestId } = render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent className="extra" />
        </Tooltip>
      </TooltipProvider>
    )
    expect(getByTestId('provider')).toBeInTheDocument()
    expect(getByTestId('content').className).toContain('extra')
  })
})
