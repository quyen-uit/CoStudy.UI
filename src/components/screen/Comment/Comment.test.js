import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import Comment from 'components/screen/Comment';
import UserController from 'controllers/UserController';
import strings from 'localization';
import { renderWithProviders } from 'test-utils/render';

jest.mock('controllers/UserController', () => ({
  logout: jest.fn(() => {
    return Promise.resolve();
  }),
}));

describe('Comment', () => {
  test('should render the title and logout button', () => {
    const { getByText } = renderWithProviders(<Comment />);
    const CommentTitle = getByText(strings.Comment);
    const logoutButton = getByText(strings.logout);

    expect(CommentTitle).toBeTruthy();
    expect(logoutButton).toBeTruthy();
  });

  test('should logout the user', async () => {
    const { getByText } = renderWithProviders(<Comment />);
    const logoutButton = getByText(strings.logout);

    fireEvent.press(logoutButton);

    expect(UserController.logout).toHaveBeenCalledTimes(1);
  });
});
