// Mock AI helpers to avoid importing real OpenAI clients
jest.mock('../../../actions/ai/generate-openai-response', () => ({
  generateOpenAIResponse: jest.fn()
}))
jest.mock('../../../actions/ai/generate-anthropic-response', () => ({
  generateAnthropicResponse: jest.fn()
}))
jest.mock('../../../actions/ai/generate-grok-response', () => ({
  generateGrokResponse: jest.fn()
}))
jest.mock('../../../actions/github/delete-pr', () => ({ deleteGitHubPR: jest.fn() }))
jest.mock('../../../actions/github/embed-target-branch', () => ({ embedTargetBranch: jest.fn() }))
jest.mock('../../../actions/github/generate-pr', () => ({ generatePR: jest.fn() }))
jest.mock('../../../actions/retrieval/get-similar-files', () => ({
  getMostSimilarEmbeddedFiles: jest.fn()
}))
// mock markdown plugins which are ESM modules
jest.mock('remark-gfm', () => () => {})
jest.mock('remark-math', () => () => {})
jest.mock('react-markdown', () => ({ __esModule: true, default: () => null }))

import {
  sanitizeAndConvertXMLToMarkdown,
  updateMessageWithSanitization
} from '../../../components/issues/issue-view'
import { parseStringPromise } from 'xml2js'
import { updateIssueMessage } from '../../../db/queries'

type Message = { id: string; content: string }

jest.mock('xml2js', () => ({ parseStringPromise: jest.fn() }))
jest.mock('../../../db/queries', () => ({ updateIssueMessage: jest.fn() }))

const mockedParse = parseStringPromise as jest.Mock
const mockedUpdate = updateIssueMessage as jest.Mock

beforeAll(() => {
  process.env.OPENAI_API_KEY = 'test-key'
})

describe('issue-view utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('converts xml to markdown', async () => {
    mockedParse.mockResolvedValue({ root: [{ section: ['Hello'] }] })
    const result = await sanitizeAndConvertXMLToMarkdown('<xml/>')
    expect(result.trim()).toBe('# root\n\n## section\n\nHello')
  })

  it('returns original xml on parse error', async () => {
    mockedParse.mockRejectedValue(new Error('fail'))
    const xml = '<broken>'
    const result = await sanitizeAndConvertXMLToMarkdown(xml)
    expect(result).toBe(xml)
  })

  it('updates issue message with sanitized markdown', async () => {
    mockedParse.mockResolvedValue({ root: [{ content: ['Hi'] }] })
    let messages: Message[] = [{ id: '1', content: 'old' }]
    const setMessages = (cb: (prev: Message[]) => Message[]) => {
      messages = cb(messages)
    }
    await updateMessageWithSanitization('1', '<xml/>', setMessages)
    expect(mockedUpdate).toHaveBeenCalledWith('1', { content: '# root\n\n## content\n\nHi\n\n' })
    expect(messages[0].content.trim()).toBe('# root\n\n## content\n\nHi')
  })
})
