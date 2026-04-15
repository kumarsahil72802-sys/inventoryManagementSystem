/**
 * Simple validation helper for common patterns
 */

// Email regex pattern
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone regex (simple 10 digit or standard international)
export const phoneRegex = /^\+?[0-9]{10,15}$/;

/**
 * Validates an email string
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return emailRegex.test(email);
};

/**
 * Validates a phone string
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  return phoneRegex.test(phone);
};

/**
 * Checks if a value is a valid non-negative number
 * @param {any} value 
 * @returns {boolean}
 */
export const isValidNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};
