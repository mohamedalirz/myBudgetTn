import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native'
import { loadData } from '../backend/storage'
import translations from '../backend/translations'

export default function TransactionsScreen({ navigation }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState('english')

  const t = translations[language] || translations.english

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const response = await fetch('https://mybudgettn-1.onrender.com/api/transactions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()

        const lang = await loadData('language')
        if (lang === 'ar') setLanguage('arabic')
        else if (lang === 'fr') setLanguage('french')
        else setLanguage('english')

        setTransactions(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load transactions:', error)
        setTransactions([])
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [navigation])

  const renderTransaction = ({ item }) => {
    const amount = parseFloat(item.amount) || 0
    const isIncome = item.type === 'income'
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionCategory}>
            {item.category?.charAt(0)?.toUpperCase() + item.category?.slice(1)}
          </Text>
          <Text style={styles.transactionDescription}>
            {item.description || t.noDescription}
          </Text>
          <Text style={styles.transactionDate}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        <Text style={[styles.transactionAmount, isIncome ? styles.income : styles.expense]}>
          {isIncome ? '+' : '-'}{amount.toFixed(2)} DT
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{t.allTransactions}</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? (
        <Text style={styles.loadingText}>{t.loading}</Text>
      ) : transactions.length === 0 ? (
        <Text style={styles.emptyText}>{t.noTransactions}</Text>
      ) : (
        <FlatList
          data={transactions.sort((a, b) => new Date(b.date) - new Date(a.date))}
          renderItem={renderTransaction}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    fontSize: 24,
    color: '#4CAF50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E7D32',
  },
  listContent: {
    padding: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 3,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#616161',
    marginBottom: 3,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  income: {
    color: '#2E7D32',
  },
  expense: {
    color: '#C62828',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#9E9E9E',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#9E9E9E',
    fontSize: 16,
  },
})
