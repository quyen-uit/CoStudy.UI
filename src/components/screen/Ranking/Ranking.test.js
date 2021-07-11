import React from 'react';
import Ranking from 'components/screen/Ranking';
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

describe('Ranking', () => {
  test('should render a welcome message with the user name', () => {
    const { getByText } = renderWithProviders(<Ranking />, {
      initialState: fakeStore,
    });

    expect(getByText('Ranking')).toBeTruthy();
    expect(getByText('Welcome John')).toBeTruthy();
  });
});
