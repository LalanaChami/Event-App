import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { loginUser } from '../firebase/auth';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  
  const dispatch = useDispatch();

  const validateInputs = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError(null);
    setPasswordError(null);
    
    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { user, error } = await loginUser(email, password);
      
      if (error) {
        setError(error);
      } else if (user) {
        dispatch(loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
        }));
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Event Organizer</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          <View style={styles.formContainer}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={emailError}
            />
            
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={passwordError}
            />
            
            <Button
              title={loading ? "Signing in..." : "Sign In"}
              onPress={handleLogin}
              disabled={loading}
              style={styles.button}
            />
            
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightMint,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SIZES.margin * 2,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h1,
    color: COLORS.deepBlue,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.h3,
    color: COLORS.steelBlue,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    marginTop: SIZES.margin,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.margin * 1.5,
  },
  footerText: {
    ...FONTS.regular,
    fontSize: SIZES.body4,
    color: COLORS.black,
    marginRight: SIZES.base,
  },
  signupText: {
    ...FONTS.bold,
    fontSize: SIZES.body4,
    color: COLORS.deepBlue,
  },
  errorContainer: {
    backgroundColor: COLORS.error + '20', // 20% opacity
    padding: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
  },
  errorText: {
    ...FONTS.medium,
    fontSize: SIZES.body4,
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default LoginScreen;
