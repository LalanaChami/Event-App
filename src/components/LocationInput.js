import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const LocationInput = ({
  label,
  value,
  onPress,
  error = null,
  style = {}
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        style={[styles.inputContainer, error && styles.inputError]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value || 'Select location'}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.margin,
  },
  label: {
    ...FONTS.medium,
    fontSize: SIZES.body4,
    color: COLORS.deepBlue,
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.steelBlue,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    backgroundColor: COLORS.white,
    minHeight: 50,
    justifyContent: 'center',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  valueText: {
    fontSize: SIZES.body3,
    color: COLORS.black,
  },
  placeholderText: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
  },
  errorText: {
    ...FONTS.regular,
    fontSize: SIZES.body5,
    color: COLORS.error,
    marginTop: 4,
  }
});

export default LocationInput;
