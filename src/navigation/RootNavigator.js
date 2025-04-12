import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { loginSuccess, logoutSuccess } from '../redux/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const RootNavigator = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch(loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
        }));
      } else {
        // User is signed out
        dispatch(logoutSuccess());
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isAuthenticated && user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
