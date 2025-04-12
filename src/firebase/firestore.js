import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Collection name
const EVENTS_COLLECTION = 'events';
const FAVORITES_COLLECTION = 'favorites';

// Add a new event
export const addEvent = async (eventData, userId) => {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...eventData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Update an existing event
export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp()
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all events for a user
export const getUserEvents = async (userId) => {
  try {
    const q = query(collection(db, EVENTS_COLLECTION), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return { events, error: null };
  } catch (error) {
    return { events: [], error: error.message };
  }
};

// Get a single event by ID
export const getEventById = async (eventId) => {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { event: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { event: null, error: "Event not found" };
    }
  } catch (error) {
    return { event: null, error: error.message };
  }
};

// Add event to favorites
export const addToFavorites = async (userId, eventId) => {
  try {
    const docRef = await addDoc(collection(db, FAVORITES_COLLECTION), {
      userId,
      eventId,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Remove event from favorites
export const removeFromFavorites = async (favoriteId) => {
  try {
    await deleteDoc(doc(db, FAVORITES_COLLECTION, favoriteId));
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all favorite events for a user
export const getUserFavorites = async (userId) => {
  try {
    const q = query(collection(db, FAVORITES_COLLECTION), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const favorites = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const favoriteData = docSnapshot.data();
      const eventDoc = await getDoc(doc(db, EVENTS_COLLECTION, favoriteData.eventId));
      
      if (eventDoc.exists()) {
        favorites.push({
          id: docSnapshot.id,
          eventId: favoriteData.eventId,
          event: { id: eventDoc.id, ...eventDoc.data() }
        });
      }
    }
    
    return { favorites, error: null };
  } catch (error) {
    return { favorites: [], error: error.message };
  }
};

// Check if an event is in user's favorites
export const isEventFavorite = async (userId, eventId) => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION), 
      where("userId", "==", userId),
      where("eventId", "==", eventId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Return the favorite document ID
      return { isFavorite: true, favoriteId: querySnapshot.docs[0].id, error: null };
    }
    
    return { isFavorite: false, favoriteId: null, error: null };
  } catch (error) {
    return { isFavorite: false, favoriteId: null, error: error.message };
  }
};
