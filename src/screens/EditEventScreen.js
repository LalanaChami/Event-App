import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateEventSuccess } from '../redux/slices/eventsSlice';
import { getEventById, updateEvent } from '../firebase/firestore';
import Input from '../components/Input';
import Button from '../components/Button';
import DateTimePicker from '../components/DateTimePicker';
import LocationInput from '../components/LocationInput';
import ImagePickerComponent from '../components/ImagePickerComponent';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import * as ImagePicker from 'expo-image-picker';

const EditEventScreen = ({ navigation, route }) => {
  const { eventId } = route.params;
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { currentEvent } = useSelector(state => state.events);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [titleError, setTitleError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [dateError, setDateError] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (currentEvent && currentEvent.id === eventId) {
        // Use the event from Redux store if available
        setTitle(currentEvent.title);
        setDescription(currentEvent.description);
        setDate(currentEvent.date);
        setLocation(currentEvent.location);
        setImageUri(currentEvent.imageUrl);
        setInitialLoading(false);
      } else {
        // Fetch the event details from Firestore
        try {
          const { event, error } = await getEventById(eventId);
          if (error) {
            Alert.alert('Error', error);
            navigation.goBack();
          } else if (event) {
            setTitle(event.title);
            setDescription(event.description);
            setDate(event.date);
            setLocation(event.location);
            setImageUri(event.imageUrl);
          }
        } catch (err) {
          Alert.alert('Error', 'Failed to load event details');
          console.error(err);
          navigation.goBack();
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchEventDetails();
  }, [eventId, currentEvent]);

  const validateInputs = () => {
    let isValid = true;
    
    // Reset errors
    setTitleError(null);
    setDescriptionError(null);
    setDateError(null);
    setLocationError(null);
    
    // Title validation
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    }
    
    // Description validation
    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    }
    
    // Date validation
    if (!date) {
      setDateError('Date is required');
      isValid = false;
    }
    
    // Location validation
    if (!location.trim()) {
      setLocationError('Location is required');
      isValid = false;
    }
    
    return isValid;
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant camera roll permissions to upload an image.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleDateSelect = () => {
    // In a real app, this would open a date picker
    // For this example, we'll just set a date if not already set
    if (!date) {
      setDate(new Date().toISOString());
    }
  };

  const handleLocationSelect = () => {
    // In a real app, this would open a location picker
    // For this example, we'll just set a location if not already set
    if (!location) {
      setLocation('New York, NY');
    }
  };

  const handleUpdateEvent = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const eventData = {
        title,
        description,
        date,
        location,
        imageUrl: imageUri,
        updatedAt: new Date().toISOString(),
      };
      
      const { success, error } = await updateEvent(eventId, eventData);
      
      if (error) {
        Alert.alert('Error', error);
      } else if (success) {
        dispatch(updateEventSuccess({ id: eventId, ...eventData }));
        Alert.alert('Success', 'Event updated successfully!', [
          { text: 'OK', onPress: () => {
            navigation.goBack()
            navigation.goBack()
          } }
        ]);
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading event details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Event</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Input
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Enter event title"
              error={titleError}
            />
            
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter event description"
              multiline
              numberOfLines={4}
              error={descriptionError}
            />
            
            <DateTimePicker
              label="Date"
              value={date}
              onPress={handleDateSelect}
              error={dateError}
            />
            
            {/* <LocationInput
              label="Location"
              value={location}
              onPress={handleLocationSelect}
              error={locationError}
            /> */}

            <Input
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="Enter event location"
              error={locationError}
            />
            
            <ImagePickerComponent
              label="Image (Optional)"
              imageUri={imageUri}
              onPress={handlePickImage}
            />
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => navigation.goBack()}
                type="outline"
                style={styles.cancelButton}
              />
              
              <Button
                title={loading ? "Updating..." : "Update Event"}
                onPress={handleUpdateEvent}
                disabled={loading}
                style={styles.updateButton}
              />
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
    backgroundColor: COLORS.lightGray,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  formContainer: {
    padding: SIZES.padding,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.margin,
  },
  cancelButton: {
    flex: 1,
    marginRight: SIZES.base,
  },
  updateButton: {
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
  },
});

export default EditEventScreen;
