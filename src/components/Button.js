import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const Button = ({ 
  title, 
  onPress, 
  type = 'primary', 
  disabled = false,
  style = {}
}) => {
  const buttonStyles = [
    styles.button,
    type === 'primary' && styles.primaryButton,
    type === 'secondary' && styles.secondaryButton,
    type === 'outline' && styles.outlineButton,
    type === 'danger' && styles.dangerButton,
    disabled && styles.disabledButton,
    style
  ];

  const textStyles = [
    styles.text,
    type === 'primary' && styles.primaryText,
    type === 'secondary' && styles.secondaryText,
    type === 'outline' && styles.outlineText,
    type === 'danger' && styles.dangerText,
    disabled && styles.disabledText
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding / 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: COLORS.deepBlue,
  },
  secondaryButton: {
    backgroundColor: COLORS.steelBlue,
  },
  outlineButton: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.deepBlue,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  text: {
    ...FONTS.medium,
    fontSize: SIZES.h3,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.deepBlue,
  },
  dangerText: {
    color: COLORS.white,
  },
  disabledText: {
    color: COLORS.lightGray,
  },
});

export default Button;
