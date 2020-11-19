import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import Conversation from 'components/screen/Conversation';
import UserController from 'controllers/UserController';
import strings from 'localization';
import { renderWithProviders } from 'test-utils/render';

jest.mock('controllers/UserController', () => ({
  logout: jest.fn(() => {
    return Promise.resolve();
  }),
}));

describe('Conversation', () => {
  test('should render the title and logout button', () => {
    const { getByText } = renderWithProviders(<Conversation />);
    const ConversationTitle = getByText(strings.Conversation);
    const logoutButton = getByText(strings.logout);

    expect(ConversationTitle).toBeTruthy();
    expect(logoutButton).toBeTruthy();
  });

  test('should logout the user', async () => {
    const { getByText } = renderWithProviders(<Conversation />);
    const logoutButton = getByText(strings.logout);

    fireEvent.press(logoutButton);

    expect(UserController.logout).toHaveBeenCalledTimes(1);
  });
});
