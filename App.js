import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AddTransaction from './screens/AddTransaction';
import TransactionsScreen from './screens/TransactionsScreen';
import AddObjectiveScreen from './screens/AddObjectiveScreen';
import ObjectivesScreen from './screens/ObjectivesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Welcome Screen - Entry point */}
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Login Screen */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Main App Screens */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
          initialParams={{
            // Default parameters if not provided via navigation
            language: 'en',
            currency: { code: 'TND', symbol: 'DT' }
          }}
        />
        
        {/* Transaction Management */}
        <Stack.Screen 
          name="AddTransaction" 
          component={AddTransaction} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Transactions" 
          component={TransactionsScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Goals Management */}
        <Stack.Screen 
          name="AddObjective" 
          component={AddObjectiveScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="EditObjective" 
          component={AddObjectiveScreen} 
          options={{ headerShown: false }}
          initialParams={{ isEditMode: true }}
        />
        <Stack.Screen 
          name="Objectives" 
          component={ObjectivesScreen} 
          options={{ headerShown: true }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}