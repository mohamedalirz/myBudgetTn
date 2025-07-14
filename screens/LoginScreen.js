import React, { useState } from 'react';
import { 
  View, Text, Image, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { saveUser, loadUser } from '../backend/storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');  // New username state
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // toggle between login and sign-up
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleAuth = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedUsername = username.trim();

    if (!trimmedEmail || !trimmedPassword || (!isLogin && !trimmedUsername)) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const existingUser = await loadUser();

      if (isLogin) {
        // Login
        if (existingUser && existingUser.email === trimmedEmail && existingUser.password === trimmedPassword) {
          Alert.alert('Success', 'Logged in successfully');
          navigation.replace('Home', { username: existingUser.username }); // pass username to Home screen
        } else {
          Alert.alert('Error', 'Invalid email or password');
        }
      } else {
        // Sign up
        if (existingUser) {
          Alert.alert('Error', 'User already exists');
        } else {
          await saveUser({ email: trimmedEmail, username: trimmedUsername, password: trimmedPassword });
          Alert.alert('Success', 'User registered successfully. You can now login.');
          setIsLogin(true);
          setPassword('');
          setUsername('');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // adjust offset if needed
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loginLogo}>
            <Image source={require("../assets/logo.png")} style={styles.logoApp} />
            <View style={styles.headText}>
              <Text style={styles.h1}>MyBudgetTN</Text>
              <Text style={styles.p}>Manage your finances effortlessly!</Text>
            </View>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                editable={!loading}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />

            <Pressable
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
              )}
            </Pressable>

            <Pressable onPress={() => !loading && setIsLogin(!isLogin)}>
              <Text style={styles.toggleText}>
                {isLogin ? 'No account? Sign up here' : 'Already have an account? Login'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    flexGrow: 1,
    justifyContent: "space-between",
    backgroundColor: '#fff',
  },
  logoApp: {
    height: 150,
    width: 150,
  },
  loginLogo: {
    alignItems: "center",
  },
  headText: {
    gap: 10,
    alignItems: 'center',
  },
  h1: {
    fontSize: 30,
    fontWeight: '600',
    color: "green",
    textAlign: "center",
  },
  p: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
  },
  form: {
    gap: 20,
    alignItems: "center",
  },
  input: {
    borderColor: "green",
    borderRadius: 50,
    width: "100%",
    height: 50,
    color: "green",
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  btn: {
    backgroundColor: 'green',
    padding: 15,
    width: 150,
    alignItems: "center",
    borderRadius: 30,
  },
  btnText: {
    color: 'white',
    fontSize: 18,
  },
  toggleText: {
    marginTop: 10,
    color: '#4CAF50',
    textDecorationLine: 'underline',
  }
});