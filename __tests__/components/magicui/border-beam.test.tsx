import { render } from '@testing-library/react'
import { BorderBeam } from '../../../components/magicui/border-beam'

describe('BorderBeam', () => {
  it('applies css variables from props', () => {
    const { container } = render(
      <BorderBeam size={100} duration={10} anchor={80} borderWidth={2} colorFrom="#111" colorTo="#222" delay={2} className="test" />
    )
    const div = container.firstChild as HTMLElement
    expect(div.className).toContain('test')
    expect(div.style.getPropertyValue('--size')).toBe('100')
    expect(div.style.getPropertyValue('--duration')).toBe('10')
    expect(div.style.getPropertyValue('--anchor')).toBe('80')
    expect(div.style.getPropertyValue('--border-width')).toBe('2')
    expect(div.style.getPropertyValue('--color-from')).toBe('#111')
    expect(div.style.getPropertyValue('--color-to')).toBe('#222')
    expect(div.style.getPropertyValue('--delay')).toBe('-2s')
  })
})
