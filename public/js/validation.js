// Global constants
const minPasswordLength = 6;
const minUsernameLength = 3;
const maxUsernameLength = 24;

// Return a trimmed string. If the string is empty and a default was
// passed, return the default instead
const cleanString = (str, fallback=null) => {
  let cleaned = (str ? str.trim() : '');
  if (cleaned.length==0 && fallback!=null) {
    return fallback;
  }
  return cleaned;
}

// Return an integer. If num in NaN, the default will be return (null if no default)
// The min and Max bounds will only be applied to the num, not the default
const cleanInt = (num, fallback=null, min=null, max=null) => {
  let int = parseInt(num);
  if (isNaN(int)) {
    return fallback;
  }
  if (min != null) {
    int = Math.max(int, min);
  }
  if (max != null) {
    int = Math.min(int, max);
  }
  return int;
}

// Return an float. If num in NaN, the default will be return (null if no default)
// The constraints will only be applied to the num, not the default
const cleanFloat = (num, fallback=null, decimalPlaces=null, min=null, max=null) => {
  let float = parseFloat(num);
  if (isNaN(float)) {
    return fallback;
  }
  if (min != null) {
    float = Math.max(float, min);
  }
  if (max != null) {
    float = Math.min(float, max);
  }
  if (decimalPlaces != null) {
    float = parseFloat(float.toFixed(decimalPlaces));
  }
  return float;
}

// Convert a comma-separated string to an array of strings or
// use default if provided and the array has no values
const parseArray = (str, fallback=null) => {
  let array = cleanString(str).split(/\s*,[\s,]*/);
  array = array.reduce((arr, elem)=>{
    if (elem.length>0) arr.push(elem);
    return arr;
  },[]);
  if (cleanedArray.length==0 && fallback!=null) {
    return fallback;
  }
  return array;
}

// Test that a password meets the requirements
// Returns error message on error or null if password is valid
const validatePassword = (str) => {
  let trimmed = cleanString(str);
  if (trimmed.length < minPasswordLength) {
    return `Username must be at least ${minPasswordLength} characters long.`;
  }
  return null;
}

// Test that a username meets the requirements
// Returns error message on error or null if username is valid
const validateUsername = (str) => {
  let trimmed = cleanString(str);
  let len = trimmed.length;
  if (len < minUsernameLength) {
    return `Username must be at least ${minUsernameLength} characters long.`;
  }
  if (len > maxUsernameLength) {
    return `Username must be no more than ${maxUsernameLength} characters long.`;
  }
  let re = "^[-_\\.a-zA-Z0-9]{"+len+"}$";
  if (!trimmed.match(new RegExp(re))) {
    return "Username contains unsupported characters."
  }
  return null;
}

// Test to make sure a string is not all whitespace
// Returns error message on error or null if string has content
const validateNotEmpty = (str) => {
  let trimmed = cleanString(str);
  if (trimmed.length == 0) {
    return "Input can not be empty";
  }
  return null;
}

// Export the functions for use as a module
if (typeof module !== 'undefined') {
  // Constants
  module.exports.minPasswordLength = minPasswordLength;
  module.exports.minUsernameLength = minUsernameLength;
  module.exports.maxUsernameLength = maxUsernameLength;
  // Helper functions
  module.exports.cleanString = cleanString;
  module.exports.cleanInt = cleanInt;
  module.exports.cleanFloat = cleanFloat;
  module.exports.parseArray = parseArray;
  // Validation functions
  module.exports.validatePassword = validatePassword;
  module.exports.validateUsername = validateUsername;
  module.exports.validateNotEmpty = validateNotEmpty;
}
