import { render, screen } from '@testing-library/react'
import MarketingPage from '../../app/(marketing)/page'

jest.mock('../../components/magicui/animated-grid-pattern', () => ({
  AnimatedGridPattern: () => <div data-testid="grid" />
}))

jest.mock('../../components/marketing/main-section', () => ({
  __esModule: true,
  default: () => <div>main section</div>
}))

describe('MarketingPage', () => {
  it('renders grid and main section', async () => {
    const Page = await MarketingPage()
    render(Page as React.ReactElement)
    expect(screen.getByTestId('grid')).toBeInTheDocument()
    expect(screen.getByText('main section')).toBeInTheDocument()
  })
})
