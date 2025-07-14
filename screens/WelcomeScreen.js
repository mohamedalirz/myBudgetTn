import React, { useState } from 'react';
import {
  View, Image, Text, Pressable, StyleSheet,
  Modal, TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { saveCurrency, saveLanguage } from '../backend/storage';

export default function WelcomeScreen({ navigation }) {
  // ✅ Use standard language codes
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('TND');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'en', name: 'English' }
  ];

  const currencies = [
    { code: 'TND', name: 'Dinar Tunisien', symbol: 'DT' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' }
  ];

  const getFlagEmoji = (langCode) => {
    switch (langCode) {
      case 'fr': return '🇫🇷';
      case 'ar': return '🇹🇳';
      case 'en': return '🇬🇧';
      default: return '🌐';
    }
  };

  const handlePress = async () => {
    console.log('Pressed Start — saving preferences...');
    try {
      await saveLanguage(language);
      await saveCurrency(currencies.find(c => c.code === currency));
      console.log('Saved language and currency');
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logowlc}
        source={require("../assets/ChatGPT Image 9 juil. 2025, 18_07_22.png")}
      />

      <View style={styles.settingsContainer}>
        <Pressable
          style={styles.optionButton}
          onPress={() => setShowLanguageModal(true)}
        >
          <Text style={styles.optionText}>
            {getFlagEmoji(language)} {languages.find(l => l.code === language)?.name}
          </Text>
        </Pressable>

        <Pressable
          style={styles.optionButton}
          onPress={() => setShowCurrencyModal(true)}
        >
          <Text style={styles.optionText}>
            {currencies.find(c => c.code === currency)?.symbol} {currencies.find(c => c.code === currency)?.name}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.btn} onPress={handlePress}>
        <Text style={styles.btnText}>
          {
            language === 'fr' ? 'Commencer' :
            language === 'ar' ? 'ابدأ' :
            'Start'
          }
        </Text>
      </Pressable>

      {/* Language Modal */}
      <Modal visible={showLanguageModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            {languages.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={styles.modalOption}
                onPress={() => {
                  setLanguage(lang.code);
                  setShowLanguageModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  {getFlagEmoji(lang.code)} {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Currency Modal */}
      <Modal visible={showCurrencyModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            {currencies.map(curr => (
              <TouchableOpacity
                key={curr.code}
                style={styles.modalOption}
                onPress={() => {
                  setCurrency(curr.code);
                  setShowCurrencyModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  {curr.symbol} - {curr.name}
                </Text>
              </TouchableOpacity>
            ))}
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setShowCurrencyModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: '#fff',
    padding: 40,
  },
  logowlc: {
    height: 350,
    width: 350,
    resizeMode: 'contain',
  },
  btn: {
    backgroundColor: 'green',
    padding: 20,
    width: 200,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 40,
  },
  btnText: {
    color: 'white',
    fontSize: 25,
    fontWeight: '500',
  },
  settingsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    width: '80%',
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 18,
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'green',
    fontSize: 18,
    fontWeight: '500',
  },
});
