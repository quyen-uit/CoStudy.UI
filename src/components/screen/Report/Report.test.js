import React from 'react';
import Report from 'components/screen/Report';
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

describe('Report', () => {
  test('should render a welcome message with the user name', () => {
    const { getByText } = renderWithProviders(<Report />, {
      initialState: fakeStore,
    });

    expect(getByText('Report')).toBeTruthy();
    expect(getByText('Welcome John')).toBeTruthy();
  });
});
