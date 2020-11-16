import React from 'react';
import NewsFeed from 'components/screen/NewsFeed';
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

describe('NewsFeed', () => {
  test('should render a welcome message with the user name', () => {
    const { getByText } = renderWithProviders(<NewsFeed />, {
      initialState: fakeStore,
    });

    expect(getByText('NewsFeed')).toBeTruthy();
    expect(getByText('Welcome John')).toBeTruthy();
  });
});
