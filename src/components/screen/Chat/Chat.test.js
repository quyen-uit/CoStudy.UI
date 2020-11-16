import React from 'react';
import Chat from 'components/screen/Chat';
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

describe('Chat', () => {
  test('should render a welcome message with the user name', () => {
    const { getByText } = renderWithProviders(<Chat />, {
      initialState: fakeStore,
    });

    expect(getByText('Chat')).toBeTruthy();
    expect(getByText('Welcome John')).toBeTruthy();
  });
});
