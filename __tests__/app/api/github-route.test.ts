import { GET } from '../../../app/api/auth/callback/github/route';

jest.mock('../../../db/queries/projects-queries', () => ({
  getProjectById: jest.fn(),
  updateProject: jest.fn()
}));

jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));

jest.mock('next/navigation', () => ({ redirect: jest.fn() }));

import { getProjectById, updateProject } from '../../../db/queries/projects-queries';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const makeReq = (params: Record<string, string>) =>
  ({ url: 'http://test?' + new URLSearchParams(params).toString() } as Request);

describe('github callback route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when params missing', async () => {
    const res = (await GET(makeReq({}))) as Response;
    expect(res.status).toBe(400);
  });

  it('updates project and redirects', async () => {
    (getProjectById as jest.Mock).mockResolvedValue({ id: '1', workspaceId: 'w' });
    (redirect as jest.Mock).mockReturnValue('r');
    const result = await GET(
      makeReq({
        installation_id: '5',
        state: encodeURIComponent(JSON.stringify({ projectId: '1' }))
      })
    );
    expect(getProjectById).toHaveBeenCalledWith('1');
    expect(updateProject).toHaveBeenCalledWith('1', { githubInstallationId: 5 });
    expect(revalidatePath).toHaveBeenCalledWith(`/`);
    expect(redirect).toHaveBeenCalledWith(`/w/1/settings`);
    expect(result).toBe('r');
  });
});
