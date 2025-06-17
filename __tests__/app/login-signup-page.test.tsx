import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('@clerk/nextjs', () => ({
  SignIn: () => <div>sign in</div>,
  SignUp: () => <div>sign up</div>
}));

import LoginPage from '../app/(auth)/login/[[...login]]/page';
import SignUpPage from '../app/(auth)/signup/[[...signup]]/page';

describe('auth pages', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_APP_MODE;
  });

  it('renders SignIn when mode is not simple', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'full';
    render(<LoginPage />);
    expect(screen.getByText('sign in')).toBeInTheDocument();
  });

  it('returns null when in simple mode', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'simple';
    const { container } = render(<LoginPage />);
    expect(container.firstChild).toBeNull();
  });

  it('renders SignUp when mode is not simple', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'full';
    render(<SignUpPage />);
    expect(screen.getByText('sign up')).toBeInTheDocument();
  });

  it('returns null for sign up when in simple mode', () => {
    process.env.NEXT_PUBLIC_APP_MODE = 'simple';
    const { container } = render(<SignUpPage />);
    expect(container.firstChild).toBeNull();
  });
});
