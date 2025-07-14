import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import translations from '../backend/translations'

export default function ObjectivesScreen({ navigation }) {
  const [objectives, setObjectives] = useState([])
  const [language, setLanguage] = useState('english')
  const isFocused = useIsFocused()

  const t = translations[language] || translations['english']

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        setLanguage('english')
      }, 500)
    }
  }, [isFocused])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (navigation.getState().routes.some(r => r.name === 'EditObjective')) {
        const route = navigation.getState().routes.find(r => r.name === 'EditObjective')
        const updatedGoal = route.params?.updatedGoal
        if (updatedGoal) {
          setObjectives(prev => {
            const idx = prev.findIndex(g => g.id === updatedGoal.id)
            if (idx >= 0) {
              const copy = [...prev]
              copy[idx] = updatedGoal
              return copy
            } else {
              return [...prev, updatedGoal]
            }
          })
          navigation.setParams({ updatedGoal: null })
        }
      }
    })
    return unsubscribe
  }, [navigation])

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {objectives.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
            {t.noGoals || 'No financial goals yet.'}
          </Text>
        )}
        {objectives.map((goal) => (
          <Pressable 
            key={goal.id} 
            style={styles.goalCard}
            onPress={() => navigation.navigate('EditObjective', { goal })}
          >
            <Text style={styles.goalName}>{goal.name}</Text>
            <Text style={styles.goalAmount}>
              {goal.current.toFixed(2)} / {goal.target.toFixed(2)} DT
            </Text>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(100, (goal.current / goal.target) * 100)}%`,
                    backgroundColor: goal.current >= goal.target ? '#4CAF50' : '#FFA000',
                  },
                ]}
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AddObjective', {
          onAdd: (newGoal) => {
            setObjectives(prev => [...prev, newGoal])
            navigation.goBack()
          }
        })}
      >
        <Text style={styles.addButtonText}>+ {t.addGoal || 'Add Goal'}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E4E2E',
    marginBottom: 5,
  },
  goalAmount: {
    fontSize: 16,
    color: '#6B8E6B',
    marginBottom: 10,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
