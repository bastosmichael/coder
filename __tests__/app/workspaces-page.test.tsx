import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('../../db/queries/workspaces-queries', () => ({
  getWorkspacesByUserId: jest.fn(),
  createWorkspace: jest.fn()
}));

jest.mock('../../db/queries/projects-queries', () => ({
  createProject: jest.fn()
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => <a href={href}>{children}</a>
}));

import WorkspacesPage from '../../app/workspaces/page';
import { getWorkspacesByUserId } from '../../db/queries/workspaces-queries';

describe('WorkspacesPage', () => {
  it('shows empty message when no workspaces', async () => {
    (getWorkspacesByUserId as jest.Mock).mockResolvedValue([]);
    const page = await WorkspacesPage();
    render(page as React.ReactElement);
    expect(screen.getByText('No workspaces')).toBeInTheDocument();
  });

  it('lists existing workspaces', async () => {
    (getWorkspacesByUserId as jest.Mock).mockResolvedValue([{ id: '1', name: 'A' }]);
    const page = await WorkspacesPage();
    render(page as React.ReactElement);
    expect(screen.getByText('Select an Organization')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'A' });
    expect(link).toHaveAttribute('href', '/1/edit');
  });
});
