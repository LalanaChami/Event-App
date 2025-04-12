import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsStart, fetchEventsSuccess, fetchEventsFailure, setCurrentEvent } from '../redux/slices/eventsSlice';
import { getUserEvents } from '../firebase/firestore';
import { logoutUser } from '../firebase/auth';
import { logoutSuccess } from '../redux/slices/authSlice';
import EventCard from '../components/EventCard';
import Button from '../components/Button';
import { COLORS, FONTS, SIZES } from '../utils/theme';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { events, loading, error } = useSelector(state => state.events);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    if (!user) return;
    
    dispatch(fetchEventsStart());
    try {
      const { events, error } = await getUserEvents(user.uid);
      if (error) {
        dispatch(fetchEventsFailure(error));
      } else {
        dispatch(fetchEventsSuccess(events));
      }
    } catch (err) {
      dispatch(fetchEventsFailure('Failed to load events'));
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logoutSuccess());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleEventPress = (event) => {
    dispatch(setCurrentEvent(event));
    navigation.navigate('EventDetails', { eventId: event.id });
  };

  const handleAddEvent = () => {
    navigation.navigate('CreateEvent');
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No events found</Text>
      <Text style={styles.emptySubText}>Create your first event by tapping the button below</Text>
      <Button 
        title="Create Event" 
        onPress={handleAddEvent} 
        style={styles.createButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Events</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Retry" 
            onPress={loadEvents} 
            type="secondary"
            style={styles.retryButton}
          />
        </View>
      )}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.deepBlue} />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              title={item.title}
              description={item.description}
              date={item.date}
              location={item.location}
              imageUri={item.imageUrl}
              onPress={() => handleEventPress(item)}
              style={styles.eventCard}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      <TouchableOpacity 
        style={styles.fabButton}
        onPress={handleAddEvent}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.deepBlue,
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 1.5,
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: SIZES.h2,
    color: COLORS.white,
  },
  logoutButton: {
    padding: SIZES.base,
  },
  logoutText: {
    ...FONTS.medium,
    fontSize: SIZES.body4,
    color: COLORS.lightMint,
  },
  listContent: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 3, // Extra space for FAB
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
  createButton: {
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
  fabButton: {
    position: 'absolute',
    bottom: SIZES.margin * 1.5,
    right: SIZES.margin * 1.5,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.deepBlue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    ...FONTS.bold,
    fontSize: 30,
    color: COLORS.white,
  },
});

export default DashboardScreen;
