import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native'
import { loadData } from '../backend/storage'
import translations from '../backend/translations'

export default function AddObjectiveScreen({ navigation }) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [current, setCurrent] = useState('')
  const [language, setLanguage] = useState('english')

  const t = translations[language] || translations['english']

  useEffect(() => {
    const loadLanguage = async () => {
      const languageData = await loadData('language')
      if (languageData) {
        const langKey =
          languageData === 'ar'
            ? 'arabic'
            : languageData === 'fr'
            ? 'french'
            : 'english'
        setLanguage(langKey)
      }
    }
    loadLanguage()
  }, [])

  const handleSave = async () => {
    if (!name || !target) {
      Alert.alert(t.error, t['Please fill all required fields'] || 'Please fill all required fields')
      return
    }

    try {
      const response = await fetch('https://your-backend-api.com/api/objectives', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          target: parseFloat(target),
          current: parseFloat(current) || 0,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save objective')
      }

      navigation.goBack()
    } catch (error) {
      Alert.alert(t.error, t['Failed to save objective'] || 'Failed to save objective')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.addNew} {t.goal}</Text>
      <Text style={styles.label}>{t.goal} {t.name || 'Name'}*</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={t.vacation || 'Vacation'}
      />
      <Text style={styles.label}>{t.targetAmount || 'Target Amount'} (DT)*</Text>
      <TextInput
        style={styles.input}
        value={target}
        onChangeText={setTarget}
        placeholder="3000"
        keyboardType="numeric"
      />
      <Text style={styles.label}>{t.currentAmount || 'Current Amount'} (DT)</Text>
      <TextInput
        style={styles.input}
        value={current}
        onChangeText={setCurrent}
        placeholder="500"
        keyboardType="numeric"
      />
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t.save || 'Save Goal'}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F9F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E4E2E',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#6B8E6B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8F5E9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
