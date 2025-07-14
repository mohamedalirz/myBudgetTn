import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, value) => {
  try {
    console.log(`Saving key "${key}" with value:`, value);
    await AsyncStorage.setItem(`@FinanceApp:${key}`, JSON.stringify(value));
    console.log(`Successfully saved ${key}`);
    return true;
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
};

export const loadData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(`@FinanceApp:${key}`);
    const parsed = value ? JSON.parse(value) : null;
    console.log(`Loaded "${key}":`, parsed);
    return parsed;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return null;
  }
};

export const saveLanguage = async (lang) => {
  console.log('Saving language:', lang);
  return await saveData('language', lang);
};

export const saveCurrency = async (currency) => {
  console.log('Saving currency:', currency);
  return await saveData('currency', currency);
};

export const loadLanguage = async () => {
  console.log('Loading language...');
  const lang = await loadData('language');
  return lang || 'en';
};

export const loadCurrency = async () => {
  console.log('Loading currency...');
  const currency = await loadData('currency');
  return currency || { code: 'TND', symbol: 'DT' };
};

export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user:', e);
  }
};

export const loadUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to load user:', e);
    return null;
  }
};