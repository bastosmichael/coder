import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('../../components/profiles/profile-creator', () => ({
  ProfileCreator: () => <div>creator</div>
}));

jest.mock('../../db/queries/profiles-queries', () => ({
  getProfileByUserId: jest.fn()
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}));

import OnboardingPage from '../../app/(auth)/onboarding/page';
import { getProfileByUserId } from '../../db/queries/profiles-queries';
import { redirect } from 'next/navigation';

describe('OnboardingPage', () => {
  it('shows profile creator when profile missing', async () => {
    (getProfileByUserId as jest.Mock).mockResolvedValue(null);
    const page = await OnboardingPage();
    render(page as React.ReactElement);
    expect(screen.getByText('creator')).toBeInTheDocument();
  });

  it('redirects when profile exists', async () => {
    (getProfileByUserId as jest.Mock).mockResolvedValue({ id: 'p' });
    (redirect as jest.Mock).mockReturnValue('redir');
    const result = await OnboardingPage();
    expect(redirect).toHaveBeenCalledWith('/workspaces');
    expect(result).toBe('redir');
  });
});
