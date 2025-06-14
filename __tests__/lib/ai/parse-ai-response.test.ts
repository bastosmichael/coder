import { parseAIResponse } from '../../../lib/ai/parse-ai-response';

describe('parseAIResponse', () => {
  it('parses files, titles and descriptions correctly', () => {
    const response = `
<file_list>
file1.ts
file2.ts
</file_list>
<file>
  <file_path>file1.ts</file_path>
  <file_content language="ts">
  const a = 1;
  </file_content>
  <file_status>new</file_status>
</file>
<file>
  <file_path>file2.ts</file_path>
  <file_status>deleted</file_status>
</file>
<pr_title>Test PR</pr_title>
<pr_description>Some description</pr_description>`;

    const result = parseAIResponse(response);
    expect(result.fileList).toEqual(['file1.ts', 'file2.ts']);
    expect(result.files).toEqual([
      {
        path: 'file1.ts',
        language: 'ts',
        content: 'const a = 1;\n',
        status: 'new'
      },
      {
        path: 'file2.ts',
        language: '',
        content: '',
        status: 'deleted'
      }
    ]);
    expect(result.prTitle).toBe('Test PR');
    expect(result.prDescription).toBe('Some description');
  });

  it('handles missing sections gracefully', () => {
    const response = `
<file>
  <file_path>file.txt</file_path>
  <file_content language="txt">
  Hello
  </file_content>
  <file_status>modified</file_status>
</file>`

    const result = parseAIResponse(response)
    expect(result.fileList).toEqual([])
    expect(result.files).toEqual([
      {
        path: 'file.txt',
        language: 'txt',
        content: 'Hello\n',
        status: 'modified',
      },
    ])
    expect(result.prTitle).toBe('')
    expect(result.prDescription).toBe('')
  })
});
