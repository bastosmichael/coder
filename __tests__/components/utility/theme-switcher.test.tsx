import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeSwitcher } from '../../../components/utility/theme-switcher';
import { useTheme } from 'next-themes';

jest.mock('next-themes', () => ({
  useTheme: jest.fn()
}));

describe('ThemeSwitcher', () => {
  it('toggles between light and dark themes', () => {
    const setTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({ theme: 'light', setTheme });
    const { getByRole } = render(<ThemeSwitcher />);
    fireEvent.click(getByRole('button'));
    expect(setTheme).toHaveBeenCalledWith('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
