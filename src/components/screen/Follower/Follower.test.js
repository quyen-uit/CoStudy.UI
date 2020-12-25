import React from 'react';
import Follower from 'components/screen/Follower';
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

describe('Follower', () => {
  test('should render a welcome message with the user name', () => {
    const { getByText } = renderWithProviders(<Follower />, {
      initialState: fakeStore,
    });

    expect(getByText('Follower')).toBeTruthy();
    expect(getByText('Welcome John')).toBeTruthy();
  });
});
