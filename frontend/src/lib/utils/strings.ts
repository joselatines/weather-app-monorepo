export const validateCityName = (city: string): {
  isValid: boolean;
  error: string;
} => {
  const trimmed = city.trim();
  
  if (trimmed.length < 2) {
    return { isValid: false, error: "City name too short (min 2 characters)" };
  }

  if (trimmed.length > 85) {
    return { isValid: false, error: "City name too long (max 85 characters)" };
  }

  if (!/^[a-zA-Z\u00C0-\u017F\s\-'.]+$/.test(trimmed)) {
    return { 
      isValid: false, 
      error: "Only letters, spaces, hyphens, periods and apostrophes allowed"
    };
  }

  return { isValid: true, error: "" };
};