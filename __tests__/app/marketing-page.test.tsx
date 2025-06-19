import { render, screen } from '@testing-library/react'
import MarketingPage from '../../app/(marketing)/page'


jest.mock('../../components/marketing/main-section', () => ({
  __esModule: true,
  default: () => <div>main section</div>
}))

describe('MarketingPage', () => {
  it('renders the main section', async () => {
    const Page = await MarketingPage()
    render(Page as React.ReactElement)
    expect(screen.getByText('main section')).toBeInTheDocument()
  })
})
