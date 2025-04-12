// Validation utility functions for the Event Organizer App

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!email.trim()) {
    return 'Email is required';
  } else if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  } else if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

// Name validation
export const validateName = (name) => {
  if (!name.trim()) {
    return 'Name is required';
  }
  return null;
};

// Event title validation
export const validateTitle = (title) => {
  if (!title.trim()) {
    return 'Title is required';
  }
  return null;
};

// Event description validation
export const validateDescription = (description) => {
  if (!description.trim()) {
    return 'Description is required';
  }
  return null;
};

// Event date validation
export const validateDate = (date) => {
  if (!date) {
    return 'Date is required';
  }
  return null;
};

// Event location validation
export const validateLocation = (location) => {
  if (!location.trim()) {
    return 'Location is required';
  }
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  } else if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};
