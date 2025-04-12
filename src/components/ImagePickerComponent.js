import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const ImagePickerComponent = ({
  label,
  imageUri,
  onPress,
  error = null,
  style = {}
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity 
        style={[styles.pickerContainer, error && styles.pickerError]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Tap to select an image</Text>
          </View>
        )}
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
    backgroundColor: COLORS.lightGray,
    height: 200,
    overflow: 'hidden',
  },
  pickerError: {
    borderColor: COLORS.error,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...FONTS.regular,
    fontSize: SIZES.body4,
    color: COLORS.gray,
  },
  errorText: {
    ...FONTS.regular,
    fontSize: SIZES.body5,
    color: COLORS.error,
    marginTop: 4,
  }
});

export default ImagePickerComponent;
