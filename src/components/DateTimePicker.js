import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const DateTimePicker = ({
  label,
  value,
  onPress,
  error = null,
  style = {}
}) => {
  // Format the date for display
  const formattedDate = value ? new Date(value).toLocaleDateString() : 'Select date';
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        style={[styles.pickerContainer, error && styles.pickerError]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {formattedDate}
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.steelBlue,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    backgroundColor: COLORS.white,
    minHeight: 50,
    justifyContent: 'center',
  },
  pickerError: {
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

export default DateTimePicker;
