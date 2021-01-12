import React from 'react';
import Create from 'components/screen/Create';
import { renderWithProviders } from 'test-utils/render';

const fakeStore = {
  user: {
    id: 1,
    name: 'John',
    email: 'john.doe@example.com',
  },
  error: {},
  status: {},
};

describe('Create', () => {
  test('should render a welcome message with the user name', () => {
    const { getByText } = renderWithProviders(<Create />, {
      initialState: fakeStore,
    });

    expect(getByText('Create')).toBeTruthy();
    expect(getByText('Welcome John')).toBeTruthy();
  });
});
