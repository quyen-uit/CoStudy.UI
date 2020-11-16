import React from 'react';
import ListPost from 'components/screen/ListPost';
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

describe('ListPost', () => {
  test('should render a welcome message with the user name', () => {
    const { getByText } = renderWithProviders(<ListPost />, {
      initialState: fakeStore,
    });

    expect(getByText('ListPost')).toBeTruthy();
    expect(getByText('Welcome John')).toBeTruthy();
  });
});
