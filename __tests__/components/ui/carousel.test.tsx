import { fireEvent, render } from '@testing-library/react'
import { Carousel, CarouselContent, CarouselItem } from '../../../components/ui/carousel'

const scrollPrev = jest.fn()
const scrollNext = jest.fn()

const api = {
  canScrollPrev: () => true,
  canScrollNext: () => true,
  on: jest.fn(),
  off: jest.fn(),
  scrollPrev,
  scrollNext
}

jest.mock('embla-carousel-react', () => () => [jest.fn(), api])

jest.mock('../../../components/ui/button', () => ({ Button: (props: any) => <button {...props} /> }))

jest.mock('../../../lib/utils', () => ({ cn: (...classes: string[]) => classes.filter(Boolean).join(' ') }))

describe('Carousel', () => {
  it('calls scroll functions on arrow keys', () => {
    const { getByRole } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
    )
    const region = getByRole('region')
    fireEvent.keyDown(region, { key: 'ArrowLeft' })
    fireEvent.keyDown(region, { key: 'ArrowRight' })
    expect(scrollPrev).toHaveBeenCalled()
    expect(scrollNext).toHaveBeenCalled()
  })
})
