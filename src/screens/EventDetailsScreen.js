import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEventSuccess } from '../redux/slices/eventsSlice';
import { addFavoriteSuccess, removeFavoriteSuccess } from '../redux/slices/favoritesSlice';
import { getEventById, deleteEvent, addToFavorites, removeFromFavorites, isEventFavorite } from '../firebase/firestore';
import Button from '../components/Button';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const EventDetailsScreen = ({ navigation, route }) => {
  const { eventId } = route.params;
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { currentEvent } = useSelector(state => state.events);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Check if we already have the event in Redux store
        if (currentEvent && currentEvent.id === eventId) {
          setEvent(currentEvent);
        } else {
          // Fetch event from Firestore
          const { event: fetchedEvent, error } = await getEventById(eventId);
          if (error) {
            setError(error);
          } else {
            setEvent(fetchedEvent);
          }
        }
        
        // Check if event is in favorites
        const { isFavorite: isFav, favoriteId: favId } = await isEventFavorite(user.uid, eventId);
        setIsFavorite(isFav);
        setFavoriteId(favId);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, currentEvent, user.uid]);

  const handleEdit = () => {
    navigation.navigate('EditEvent', { eventId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this event? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { success, error } = await deleteEvent(eventId);
              if (error) {
                Alert.alert('Error', error);
              } else if (success) {
                dispatch(deleteEventSuccess(eventId));
                navigation.goBack();
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to delete event');
              console.error(err);
            }
          }
        }
      ]
    );
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Remove from favorites
        const { success, error } = await removeFromFavorites(favoriteId);
        if (error) {
          Alert.alert('Error', error);
        } else if (success) {
          setIsFavorite(false);
          setFavoriteId(null);
          dispatch(removeFavoriteSuccess(favoriteId));
        }
      } else {
        // Add to favorites
        const { id, error } = await addToFavorites(user.uid, eventId);
        if (error) {
          Alert.alert('Error', error);
        } else {
          setIsFavorite(true);
          setFavoriteId(id);
          dispatch(addFavoriteSuccess({ id, eventId, event }));
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update favorites');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.deepBlue} />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          title="Go Back" 
          onPress={() => navigation.goBack()} 
          style={styles.errorButton}
        />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => navigation.goBack()} 
          style={styles.errorButton}
        />
      </SafeAreaView>
    );
  }

  // Format the date for display
  const formattedDate = event.date ? new Date(event.date).toLocaleDateString() : 'No date';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{event.title}</Text>
        </View>
        
        {event.imageUrl ? (
          <Image source={{ uri: event.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No image available</Text>
          </View>
        )}
        
        <View style={styles.contentContainer}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailText}>{formattedDate}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailText}>{event.location || 'No location'}</Text>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{event.description}</Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              onPress={handleToggleFavorite}
              type={isFavorite ? "secondary" : "outline"}
              style={styles.favoriteButton}
            />
            
            {event.userId === user.uid && (
              <View style={styles.ownerButtonsContainer}>
                <Button
                  title="Edit"
                  onPress={handleEdit}
                  type="primary"
                  style={styles.editButton}
                />
                
                <Button
                  title="Delete"
                  onPress={handleDelete}
                  type="danger"
                  style={styles.deleteButton}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  scrollContainer: {
    flexGrow: 1,
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
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    color: COLORS.gray,
  },
  contentContainer: {
    padding: SIZES.padding,
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: SIZES.base,
  },
  detailLabel: {
    ...FONTS.bold,
    fontSize: SIZES.body3,
    color: COLORS.deepBlue,
    width: 80,
  },
  detailText: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.black,
    flex: 1,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h3,
    color: COLORS.deepBlue,
    marginBottom: SIZES.base,
  },
  description: {
    ...FONTS.regular,
    fontSize: SIZES.body3,
    color: COLORS.black,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: SIZES.margin,
  },
  favoriteButton: {
    marginBottom: SIZES.margin,
  },
  ownerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: SIZES.base,
  },
  deleteButton: {
    flex: 1,
    marginLeft: SIZES.base,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  loadingText: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    color: COLORS.steelBlue,
    marginTop: SIZES.margin,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.lightGray,
  },
  errorText: {
    ...FONTS.medium,
    fontSize: SIZES.body3,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SIZES.margin,
  },
  errorButton: {
    width: '50%',
  },
});

export default EventDetailsScreen;
