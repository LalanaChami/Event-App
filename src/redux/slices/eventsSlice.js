import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchEventsSuccess: (state, action) => {
      state.loading = false;
      state.events = action.payload;
      state.error = null;
    },
    fetchEventsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    addEventSuccess: (state, action) => {
      state.events.push(action.payload);
    },
    updateEventSuccess: (state, action) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEventSuccess: (state, action) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
    clearEventsError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  fetchEventsStart, 
  fetchEventsSuccess, 
  fetchEventsFailure, 
  setCurrentEvent,
  clearCurrentEvent,
  addEventSuccess,
  updateEventSuccess,
  deleteEventSuccess,
  clearEventsError
} = eventsSlice.actions;

export default eventsSlice.reducer;
