import React from 'react';
import Notify from 'components/screen/Notify';
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

describe('Notify', () => {
  test('should render a welcome message with the user name', () => {
    const { getByText } = renderWithProviders(<Notify />, {
      initialState: fakeStore,
    });

    expect(getByText('Notify')).toBeTruthy();
    expect(getByText('Welcome John')).toBeTruthy();
  });
});
