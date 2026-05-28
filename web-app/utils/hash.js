import { sha256 } from 'js-sha256';

/**
 * Generate a SHA-256 hash for student degree data.
 * @param {Object} data - Student data object
 * @returns {string} - The hex string of the SHA-256 hash
 */
export function generateHash(data) {
  // Sort keys to ensure consistent order
  const sortedKeys = Object.keys(data).sort();
  const sortedData = {};
  
  sortedKeys.forEach(key => {
    sortedData[key] = data[key];
  });

  const jsonString = JSON.stringify(sortedData);
  return sha256(jsonString);
}
