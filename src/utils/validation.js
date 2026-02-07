/**
 * Email Validation
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone Number Validation
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if it's 10 or 11 digits
  return cleaned.length >= 10 && cleaned.length <= 11;
};

/**
 * Password Validation
 */
export const isValidPassword = (password) => {
  if (!password) return false;
  // At least 8 characters
  return password.length >= 8;
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 'weak', score: 0 };
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Contains lowercase
  if (/[a-z]/.test(password)) score += 1;
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) score += 1;
  
  // Contains number
  if (/[0-9]/.test(password)) score += 1;
  
  // Contains special character
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score <= 2) return { strength: 'weak', score };
  if (score <= 4) return { strength: 'medium', score };
  return { strength: 'strong', score };
};

/**
 * Name Validation
 */
export const isValidName = (name) => {
  if (!name) return false;
  // At least 2 characters, only letters and spaces
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name.trim());
};

/**
 * Number Validation
 */
export const isValidNumber = (value) => {
  if (value === '' || value === null || value === undefined) return false;
  return !isNaN(value) && isFinite(value);
};

export const isPositiveNumber = (value) => {
  return isValidNumber(value) && Number(value) > 0;
};

export const isValidPercentage = (value) => {
  return isValidNumber(value) && Number(value) >= 0 && Number(value) <= 100;
};

/**
 * Date Validation
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) > new Date();
};

export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  return new Date(date) < new Date();
};

export const isDateInRange = (date, minDate, maxDate) => {
  if (!isValidDate(date)) return false;
  const d = new Date(date);
  const min = minDate ? new Date(minDate) : null;
  const max = maxDate ? new Date(maxDate) : null;
  
  if (min && d < min) return false;
  if (max && d > max) return false;
  return true;
};

/**
 * Roll Number Validation
 */
export const isValidRollNumber = (rollNo) => {
  if (!rollNo) return false;
  // Alphanumeric, 2-20 characters
  const rollNoRegex = /^[a-zA-Z0-9]{2,20}$/;
  return rollNoRegex.test(rollNo.trim());
};

/**
 * CNIC Validation (Pakistani National ID)
 */
export const isValidCNIC = (cnic) => {
  if (!cnic) return false;
  // Remove dashes and spaces
  const cleaned = cnic.replace(/[-\s]/g, '');
  // Must be 13 digits
  return /^\d{13}$/.test(cleaned);
};

/**
 * Age Validation
 */
export const calculateAge = (dateOfBirth) => {
  if (!isValidDate(dateOfBirth)) return null;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const isValidAge = (dateOfBirth, minAge = 5, maxAge = 100) => {
  const age = calculateAge(dateOfBirth);
  if (age === null) return false;
  return age >= minAge && age <= maxAge;
};

/**
 * URL Validation
 */
export const isValidURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Required Field Validation
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Form Validation Helper
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = formData[field];
    
    // Check required
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = fieldRules.requiredMessage || `${field} is required`;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!isRequired(value)) return;
    
    // Check email
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = fieldRules.emailMessage || 'Invalid email address';
      return;
    }
    
    // Check phone
    if (fieldRules.phone && !isValidPhone(value)) {
      errors[field] = fieldRules.phoneMessage || 'Invalid phone number';
      return;
    }
    
    // Check min length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `Minimum ${fieldRules.minLength} characters required`;
      return;
    }
    
    // Check max length
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `Maximum ${fieldRules.maxLength} characters allowed`;
      return;
    }
    
    // Check custom validation
    if (fieldRules.custom && !fieldRules.custom(value)) {
      errors[field] = fieldRules.customMessage || 'Invalid value';
      return;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize Input
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '');
};