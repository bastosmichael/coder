import { render } from '@testing-library/react'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'

jest.mock('@radix-ui/react-avatar', () => ({
  Root: (props: any) => <div {...props} />,
  Image: (props: any) => <img {...props} />,
  Fallback: (props: any) => <div {...props} />
}))

describe('Avatar', () => {
  it('renders image and fallback', () => {
    const { getByAltText, getByText } = render(
      <Avatar>
        <AvatarImage src="avatar.png" alt="A" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    expect(getByAltText('A')).toBeInTheDocument()
    expect(getByText('AB')).toBeInTheDocument()
  })
})

