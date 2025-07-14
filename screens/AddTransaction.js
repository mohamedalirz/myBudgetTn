import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { loadData, saveData } from '../backend/storage';
import translations from '../backend/translations';

const AddTransaction = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [language, setLanguage] = useState('english');

  const t = translations[language] || translations['english'];

  useEffect(() => {
    const loadLang = async () => {
      const lang = await loadData('language');
      if (lang === 'ar') setLanguage('arabic');
      else if (lang === 'fr') setLanguage('french');
      else setLanguage('english');
    };
    loadLang();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert(t.error, t.load_error);
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      amount: numericAmount,
      description,
      category,
      date: date.toISOString(),
      type: transactionType,
    };

    try {
      const existingTransactions = (await loadData('transactions')) || [];
      existingTransactions.push(newTransaction);
      await saveData('transactions', existingTransactions);
      navigation.goBack();
    } catch (error) {
      Alert.alert(t.error, t.load_error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>←</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{t.addNew}</Text>
            <View style={{ width: 30 }} />
          </View>
          <View style={styles.typeSelector}>
            <Pressable
              style={[styles.typeButton, transactionType === 'expense' && styles.typeButtonActive]}
              onPress={() => setTransactionType('expense')}
            >
              <Text style={[styles.typeButtonText, transactionType === 'expense' && styles.typeButtonTextActive]}>
                {t.expenses}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.typeButton, transactionType === 'income' && styles.typeButtonActive]}
              onPress={() => setTransactionType('income')}
            >
              <Text style={[styles.typeButtonText, transactionType === 'income' && styles.typeButtonTextActive]}>
                {t.income}
              </Text>
            </Pressable>
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>DT</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#9E9E9E"
              autoFocus
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t.recentTransactions}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.noDescription}
              value={description}
              onChangeText={setDescription}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t.transaction}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
                dropdownIconColor="#4CAF50"
              >
                <Picker.Item label={t.food} value="food" />
                <Picker.Item label={t.transport} value="transport" />
                <Picker.Item label="Shopping" value="shopping" />
                <Picker.Item label="Bills" value="bills" />
                <Picker.Item label={t.salary} value="salary" />
                <Picker.Item label={t.other} value="other" />
              </Picker>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
          <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={!amount}>
            <Text style={styles.submitButtonText}>{t.transaction}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    fontSize: 24,
    color: '#4CAF50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#4CAF50',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#757575',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 12,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '600',
    color: '#212121',
    paddingVertical: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#616161',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#212121',
  },
  pickerContainer: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#212121',
  },
  dateInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#212121',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    elevation: 2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddTransaction;
