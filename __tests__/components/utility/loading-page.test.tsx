import { render } from '@testing-library/react'
import { LoadingPage } from '../../../components/utility/loading-page'

describe('LoadingPage', () => {
  it('renders loader', () => {
    const { container } = render(<LoadingPage size={10} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
