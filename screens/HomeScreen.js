import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import translations from '../backend/translations';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation, route }) {
  const isFocused = useIsFocused();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [dailySpent, setDailySpent] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [objectives, setObjectives] = useState([]);
  const [currency, setCurrency] = useState({ code: 'TND', symbol: 'DT' });
  const [language, setLanguage] = useState('english');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  const t = translations[language] || translations['english'];

  useEffect(() => {
    if (route?.params?.token) {
      setToken(route.params.token);
    }
    if (route?.params?.username) {
      setUsername(route.params.username);
    }
  }, [route?.params]);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const txnsRes = await axios.get('https://YOUR_BACKEND_URL/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const savedTransactions = txnsRes.data || [];

        const objRes = await axios.get('https://YOUR_BACKEND_URL/api/objectives', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const savedObjectives = objRes.data || [];

        setTransactions(savedTransactions);
        calculateStats(savedTransactions);

        if (savedObjectives.length > 0) {
          setObjectives(savedObjectives);
        } else {
          setObjectives([]);
        }

        const profileRes = await axios.get('https://YOUR_BACKEND_URL/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.data) {
          const { language: langData, currency: currencyData } = profileRes.data;
          if (langData) {
            const langKey =
              langData === 'ar' ? 'arabic' : langData === 'fr' ? 'french' : 'english';
            setLanguage(langKey);
          }
          if (currencyData) setCurrency(currencyData);
        }
      } catch (error) {
        console.error('Failed to fetch data from backend:', error);
        Alert.alert(t.error, t.failedToLoadData);
      }
    };
    fetchData();
  }, [isFocused, language, token]);

  const calculateStats = (txns = []) => {
    const totalBalance = txns.reduce((sum, t) => {
      const amount = Number(t?.amount) || 0;
      return sum + (t?.type === 'income' ? amount : -amount);
    }, 0);
    setBalance(totalBalance);
    const today = new Date().toISOString().split('T')[0];
    const todayExpenses = txns
      .filter((t) => t?.type === 'expense' && t?.date?.includes(today))
      .reduce((sum, t) => sum + (Number(t?.amount) || 0), 0);
    setDailySpent(todayExpenses);
    const incomes = txns
      .filter((t) => t?.type === 'income')
      .reduce((sum, t) => sum + (Number(t?.amount) || 0), 0);
    const expenses = txns
      .filter((t) => t?.type === 'expense')
      .reduce((sum, t) => sum + (Number(t?.amount) || 0), 0);
    setMonthlySavings(incomes - expenses);
  };

  const getRecentTransactions = () => {
    return [...transactions]
      .reverse()
      .slice(0, 3)
      .filter((t) => t && typeof t === 'object');
  };

  const formatAmount = (amount) => {
    return (Number(amount) || 0).toFixed(2);
  };

  const renderObjectives = () => {
    return (
      <View style={[styles.card, styles.objectivesCard]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{t.financialGoals}</Text>
          <Pressable onPress={() => navigation.navigate('Objectives')}>
            <Text style={styles.seeAllText}>{t.seeAll}</Text>
          </Pressable>
        </View>
        {objectives.slice(0, 2).map((goal) => (
          <View key={goal._id || goal.id} style={styles.objectiveItem}>
            <View style={styles.objectiveTextContainer}>
              <Text style={styles.objectiveName}>{goal.name}</Text>
              <Text style={styles.objectiveAmount}>
                {formatAmount(goal.current)} / {formatAmount(goal.target)} {currency.symbol}
              </Text>
            </View>
            <View
              style={[
                styles.progressContainer,
                { backgroundColor: '#E8F5E9' },
              ]}
            >
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
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image style={styles.profileImage} />
            <View>
              <Text style={styles.greeting}>{t.greeting},</Text>
              <Text style={styles.username}>{username || 'User'}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, styles.balanceCard]}>
          <Text style={styles.balanceCardTitle}>{t.currentBalance}</Text>
          <Text style={styles.balanceAmount}>
            {formatAmount(balance)} {currency.symbol}
          </Text>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceDetailItem}>
              <Text style={styles.detailLabel}>{t.income}</Text>
              <Text style={[styles.detailValue, styles.incomeValue]}>
                {formatAmount(
                  transactions
                    .filter((t) => t?.type === 'income')
                    .reduce((sum, t) => sum + (Number(t?.amount) || 0), 0)
                )}{' '}
                {currency.symbol}
              </Text>
            </View>
            <View style={styles.balanceDetailItem}>
              <Text style={styles.detailLabel}>{t.expenses}</Text>
              <Text style={[styles.detailValue, styles.expenseValue]}>
                {formatAmount(
                  transactions
                    .filter((t) => t?.type === 'expense')
                    .reduce((sum, t) => sum + (Number(t?.amount) || 0), 0)
                )}{' '}
                {currency.symbol}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.card, styles.statCard]}>
            <Text style={styles.statTitle}>{t.dailyBudget}</Text>
            <Text style={styles.statValue}>50 {currency.symbol}</Text>
            <Text style={styles.statSubtitle}>
              {formatAmount(dailySpent)} {currency.symbol} {t.spentToday}
            </Text>
            <View style={styles.progressContainer}>
              <View
                style={[styles.progressBar, { width: `${Math.min(100, (dailySpent / 50) * 100)}%` }]}
              />
            </View>
          </View>
          <View style={[styles.card, styles.statCard]}>
            <Text style={styles.statTitle}>{t.monthlySavings}</Text>
            <Text style={styles.statValue}>
              {formatAmount(monthlySavings)} {currency.symbol}
            </Text>
            <Text style={styles.statSubtitle}>
              {transactions.length > 0
                ? `${Math.round(
                    (monthlySavings /
                      transactions
                        .filter((t) => t?.type === 'income')
                        .reduce((sum, t) => sum + (Number(t?.amount) || 0), 0)) *
                      100
                  )}% ${t.ofIncome}`
                : `0% ${t.ofIncome}`}
            </Text>
          </View>
        </View>

        <View style={[styles.card, styles.transactionsCard]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{t.recentTransactions}</Text>
            <Pressable onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAllText}>{t.seeAll}</Text>
            </Pressable>
          </View>
          {getRecentTransactions().map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Text style={{ fontSize: 20 }}>
                  {transaction.category === 'food'
                    ? '🛒'
                    : transaction.category === 'transport'
                    ? '🚕'
                    : transaction.category === 'salary'
                    ? '💰'
                    : '💳'}
                </Text>
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionCategory}>
                  {t[transaction.category] || transaction.category}
                </Text>
                <Text style={styles.transactionMerchant}>
                  {transaction.description || t.noDescription}
                </Text>
                <Text style={styles.transactionTime}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === 'income'
                    ? styles.positiveAmount
                    : styles.negativeAmount,
                ]}
              >
                {transaction.type === 'income' ? '+' : '-'}
                {formatAmount(transaction.amount)} {currency.symbol}
              </Text>
            </View>
          ))}
        </View>

        {renderObjectives()}
      </ScrollView>

      <Pressable
        style={styles.fab}
        onPress={() => {
          Alert.alert(t.addNew, t.whatAdd, [
            { text: t.transaction, onPress: () => navigation.navigate('AddTransaction') },
            { text: t.goal, onPress: () => navigation.navigate('AddObjective') },
          ]);
        }}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
          <Text style={styles.navTextActive}>{t.home}</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Objectives')}>
          <Text style={styles.navIcon}>🎯</Text>
          <Text style={styles.navText}>{t.goals}</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => navigation.navigate('Transactions')}>
          <Text style={styles.navIcon}>💳</Text>
          <Text style={styles.navText}>{t.transactions}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F9F5',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#4CAF50',
  },
  greeting: {
    fontSize: 14,
    color: '#6B8E6B',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E4E2E',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceCard: {
    backgroundColor: '#4CAF50',
  },
  balanceCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E8F5E9',
    marginBottom: 15,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceDetailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#E8F5E9',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomeValue: {
    color: '#C8E6C9',
  },
  expenseValue: {
    color: '#FFCDD2',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 50) / 2,
    padding: 15,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B8E6B',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E4E2E',
    marginBottom: 5,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9CAF9C',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E8F5E9',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E4E2E',
  },
  seeAllText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E4E2E',
    marginBottom: 2,
  },
  transactionMerchant: {
    fontSize: 14,
    color: '#6B8E6B',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: '#9CAF9C',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  positiveAmount: {
    color: '#4CAF50',
  },
  negativeAmount: {
    color: '#F44336',
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E4E2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 30,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
    paddingVertical: 12,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 22,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  navIconActive: {
    color: '#4CAF50',
  },
  navText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  navTextActive: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  objectivesCard: {
    marginBottom: 20,
  },
  objectiveItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  objectiveTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  objectiveName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E4E2E',
  },
  objectiveAmount: {
    fontSize: 14,
    color: '#6B8E6B',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});
