import { render } from '@testing-library/react'
import MarketingLayout from '../../app/(marketing)/layout'

jest.mock('../../components/marketing/site-header', () => ({ SiteHeader: () => <header>header</header> }))
jest.mock('../../components/marketing/site-footer', () => ({ SiteFooter: () => <footer>footer</footer> }))

describe('MarketingLayout', () => {
  it('renders header, footer and children', async () => {
    const Layout = await MarketingLayout({ children: <div>child</div> })
    const { getByText } = render(Layout as any)
    expect(getByText('header')).toBeInTheDocument()
    expect(getByText('footer')).toBeInTheDocument()
    expect(getByText('child')).toBeInTheDocument()
  })
})
