jest.mock('../../../actions/github/auth', () => ({ getAuthenticatedOctokit: jest.fn() }));
jest.mock('../../../actions/github/fetch-codebase', () => ({ fetchWithRetry: jest.fn() }));
import * as utils from '@/lib/utils';

import { fetchFiles } from '../../../actions/github/fetch-files';
import { getAuthenticatedOctokit } from '../../../actions/github/auth';
import { fetchWithRetry } from '../../../actions/github/fetch-codebase';

describe('fetchFiles', () => {
  const mockOctokit = {} as any;

  beforeEach(() => {
    jest.resetAllMocks();
    (getAuthenticatedOctokit as jest.Mock).mockResolvedValue(mockOctokit);
    (fetchWithRetry as jest.Mock).mockResolvedValue({ data: { content: Buffer.from('hello').toString('base64') } });
    jest.spyOn(utils, 'sanitizeFileContent').mockImplementation((c: string) => c);
  });

  it('filters excluded files and returns sanitized content', async () => {
    const files = [
      { name: 'keep.ts', path: 'src/keep.ts', owner: 'o', repo: 'r', ref: 'main' },
      { name: 'image.png', path: 'public/img.png', owner: 'o', repo: 'r', ref: 'main' },
      { name: 'package-lock.json', path: 'package-lock.json', owner: 'o', repo: 'r', ref: 'main' }
    ] as any;

    const result = await fetchFiles(1, files);
    expect(result).toEqual([{ name: 'keep.ts', path: 'src/keep.ts', content: 'hello' }]);
    expect(utils.sanitizeFileContent).toHaveBeenCalledWith('hello');
    expect(fetchWithRetry).toHaveBeenCalledTimes(1);
  });

  it('returns empty result when fetch fails', async () => {
    (fetchWithRetry as jest.Mock).mockRejectedValue(new Error('fail'));
    const files = [{ name: 'keep.ts', path: 'src/keep.ts', owner: 'o', repo: 'r', ref: 'main' }] as any;
    const result = await fetchFiles(1, files);
    expect(result).toEqual([]);
  });
});
