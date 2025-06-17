import { fireEvent, render } from '@testing-library/react'
import { Integration } from '../../../components/integrations/integration'
import { Loader2 } from 'lucide-react'

jest.mock('lucide-react', () => ({ Loader2: () => <svg data-testid="loader" /> }))

describe('Integration', () => {
  it('shows loader when connecting', () => {
    const { getByTestId } = render(
      <Integration name="GitHub" icon={<div />} isConnecting={true} isConnected={false} disabled={false} onClick={() => {}} />
    )
    expect(getByTestId('loader')).toBeInTheDocument()
  })

  it('shows connect text and handles click', () => {
    const onClick = jest.fn()
    const { getByText } = render(
      <Integration name="GitHub" icon={<div />} isConnecting={false} isConnected={false} disabled={false} onClick={onClick} />
    )
    fireEvent.click(getByText('Connect'))
    expect(onClick).toHaveBeenCalled()
  })

  it('shows connected text', () => {
    const { getByText } = render(
      <Integration name="GitHub" icon={<div />} isConnecting={false} isConnected={true} disabled={false} onClick={() => {}} />
    )
    expect(getByText('Connected')).toBeInTheDocument()
  })
})
