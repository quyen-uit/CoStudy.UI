import { NavigationContainer } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthNavigator from 'navigation/AuthNavigator';
import AppNavigator from 'navigation/AppNavigator';
import { getUser } from 'selectors/UserSelectors';
import { actionTypes, update } from 'actions/UserActions';

function Navigation({ theme }) {
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  return (
    <NavigationContainer theme={theme}>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

Navigation.propTypes = {
  theme: PropTypes.object.isRequired,
};

export default Navigation;
