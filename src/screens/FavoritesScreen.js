import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavoritesStart, fetchFavoritesSuccess, fetchFavoritesFailure, removeFavoriteSuccess } from '../redux/slices/favoritesSlice';
import { getUserFavorites, removeFromFavorites } from '../firebase/firestore';
import EventCard from '../components/EventCard';
import Button from '../components/Button';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const FavoritesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { favorites, loading, error } = useSelector(state => state.favorites);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    if (!user) return;
    
    dispatch(fetchFavoritesStart());
    try {
      const { favorites, error } = await getUserFavorites(user.uid);
      if (error) {
        dispatch(fetchFavoritesFailure(error));
      } else {
        dispatch(fetchFavoritesSuccess(favorites));
      }
    } catch (err) {
      dispatch(fetchFavoritesFailure('Failed to load favorites'));
      console.error(err);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  };

  const handleRemoveFavorite = (favoriteId) => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this event from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { success, error } = await removeFromFavorites(favoriteId);
              if (error) {
                Alert.alert('Error', error);
              } else if (success) {
                dispatch(removeFavoriteSuccess(favoriteId));
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to remove from favorites');
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No favorite events</Text>
      <Text style={styles.emptySubText}>Events you mark as favorites will appear here</Text>
      <Button 
        title="Browse Events" 
        onPress={() => navigation.navigate('Dashboard')} 
        style={styles.browseButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Retry" 
            onPress={loadFavorites} 
            type="secondary"
            style={styles.retryButton}
          />
        </View>
      )}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.deepBlue} />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              title={item.event.title}
              description={item.event.description}
              date={item.event.date}
              location={item.event.location}
              imageUri={item.event.imageUrl}
              isFavorite={true}
              onPress={() => handleEventPress(item.event)}
              onFavoritePress={() => handleRemoveFavorite(item.id)}
              style={styles.eventCard}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    backgroundColor: COLORS.deepBlue,
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 1.5,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.white,
  },
  listContent: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  eventCard: {
    marginBottom: SIZES.margin,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding * 2,
  },
  emptyText: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.deepBlue,
    marginBottom: SIZES.base,
  },
  emptySubText: {
    ...FONTS.regular,
    fontSize: SIZES.body4,
    color: COLORS.steelBlue,
    textAlign: 'center',
    marginBottom: SIZES.margin * 1.5,
  },
  browseButton: {
    width: '60%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    color: COLORS.steelBlue,
    marginTop: SIZES.margin,
  },
  errorContainer: {
    backgroundColor: COLORS.error + '20', // 20% opacity
    padding: SIZES.padding,
    margin: SIZES.margin,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  errorText: {
    ...FONTS.medium,
    fontSize: SIZES.body4,
    color: COLORS.error,
    marginBottom: SIZES.margin,
    textAlign: 'center',
  },
  retryButton: {
    width: '50%',
  },
});

export default FavoritesScreen;
