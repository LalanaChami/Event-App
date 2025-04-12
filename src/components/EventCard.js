import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const EventCard = ({
  title,
  description,
  date,
  location,
  imageUri,
  isFavorite = false,
  onPress,
  onFavoritePress,
  style = {}
}) => {
  // Format the date for display
  const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date';
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailText}>{formattedDate}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailText} numberOfLines={1}>{location || 'No location'}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]} 
          onPress={onFavoritePress}
        >
          <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>★</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 120,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 100,
    height: 120,
    backgroundColor: COLORS.lightGray,
  },
  infoContainer: {
    flex: 1,
    padding: SIZES.base * 2,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.deepBlue,
    marginBottom: 4,
  },
  description: {
    ...FONTS.regular,
    fontSize: SIZES.body4,
    color: COLORS.black,
    marginBottom: 8,
  },
  detailsContainer: {
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  detailLabel: {
    ...FONTS.medium,
    fontSize: SIZES.body5,
    color: COLORS.steelBlue,
    marginRight: 4,
  },
  detailText: {
    ...FONTS.regular,
    fontSize: SIZES.body5,
    color: COLORS.black,
    flex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: COLORS.mint,
  },
  favoriteIcon: {
    fontSize: 18,
    color: COLORS.gray,
  },
  favoriteIconActive: {
    color: COLORS.deepBlue,
  },
});

export default EventCard;
