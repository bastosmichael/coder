import { render } from '@testing-library/react'
import { Badge, badgeVariants } from '../../../components/ui/badge'

describe('Badge', () => {
  it('applies variant classes', () => {
    const { getByText } = render(<Badge variant="secondary">Hi</Badge>)
    const el = getByText('Hi')
    const expected = badgeVariants({ variant: 'secondary' })
    expected.split(' ').forEach(cls => {
      expect(el.className).toContain(cls)
    })
  })
})
