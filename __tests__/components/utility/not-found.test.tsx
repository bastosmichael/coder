import React from 'react';
import { render } from '@testing-library/react';
import { NotFound } from '../../../components/utility/not-found';

describe('NotFound component', () => {
  it('displays provided message', () => {
    const { getByText } = render(<NotFound message="Missing" />);
    expect(getByText('Missing')).toBeInTheDocument();
  });
});
