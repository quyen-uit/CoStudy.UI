import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import Post from 'components/screen/Post';
import UserController from 'controllers/UserController';
import strings from 'localization';
import { renderWithProviders } from 'test-utils/render';

jest.mock('controllers/UserController', () => ({
  logout: jest.fn(() => {
    return Promise.resolve();
  }),
}));

describe('Post', () => {
  test('should render the title and logout button', () => {
    const { getByText } = renderWithProviders(<Post />);
    const PostTitle = getByText(strings.Post);
    const logoutButton = getByText(strings.logout);

    expect(PostTitle).toBeTruthy();
    expect(logoutButton).toBeTruthy();
  });

  test('should logout the user', async () => {
    const { getByText } = renderWithProviders(<Post />);
    const logoutButton = getByText(strings.logout);

    fireEvent.press(logoutButton);

    expect(UserController.logout).toHaveBeenCalledTimes(1);
  });
});
