import React from 'react'
import { render } from '@testing-library/react'
import { MessageMarkdownMemoized } from '../../../components/instructions/message-markdown-memoized'

jest.mock('react-markdown', () => ({ __esModule: true, default: jest.fn(() => <div data-testid="md" />) }))

const ReactMarkdown = require('react-markdown').default as jest.Mock

describe('MessageMarkdownMemoized', () => {
  it('wraps ReactMarkdown in a div with className', () => {
    const { container, getByTestId } = render(
      <MessageMarkdownMemoized className="c">text</MessageMarkdownMemoized>
    )
    expect(getByTestId('md')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('c')
  })

  it('memoizes ReactMarkdown component', () => {
    const { rerender } = render(<MessageMarkdownMemoized>hi</MessageMarkdownMemoized>)
    expect(ReactMarkdown).toHaveBeenCalledTimes(1)
    rerender(<MessageMarkdownMemoized>hi</MessageMarkdownMemoized>)
    expect(ReactMarkdown).toHaveBeenCalledTimes(1)
  })
})
