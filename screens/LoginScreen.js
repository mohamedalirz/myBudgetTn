import React, { useState } from 'react';
import {
  View, Text, Image, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://mybudgettn-1.onrender.com/api/auth'; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleAuth = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedUsername = username.trim();

    if (!trimmedEmail || (!isLogin && !trimmedPassword) || (!isLogin && !trimmedUsername)) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      let url = '';
      let payload = {};

      if (forgotPasswordMode) {
        url = `${API_URL}/forgot-password`;
        payload = { email: trimmedEmail };
      } else if (isLogin) {
        url = `${API_URL}/login`;
        payload = { email: trimmedEmail, password: trimmedPassword };
      } else {
        url = `${API_URL}/register`;
        payload = { email: trimmedEmail, password: trimmedPassword, username: trimmedUsername };
      }

      const res = await axios.post(url, payload);

      if (res.data) {
        if (forgotPasswordMode) {
          Alert.alert('Success', 'Password reset email sent!');
          setForgotPasswordMode(false);
        } else {
          Alert.alert('Success', isLogin ? 'Logged in!' : 'Registered successfully!');
          navigation.replace('Home', { username: res.data.user?.username || trimmedUsername });
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.loginLogo}>
            <Image source={require("../assets/logo.png")} style={styles.logoApp} />
            <View style={styles.headText}>
              <Text style={styles.h1}>MyBudgetTN</Text>
              <Text style={styles.p}>Manage your finances effortlessly!</Text>
            </View>
          </View>

          <View style={styles.form}>
            {!isLogin && !forgotPasswordMode && (
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                editable={!loading}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
            {!forgotPasswordMode && (
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            )}

            <Pressable
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>
                  {forgotPasswordMode
                    ? 'Reset Password'
                    : isLogin
                    ? 'Login'
                    : 'Sign Up'}
                </Text>
              )}
            </Pressable>

            {!forgotPasswordMode && (
              <Pressable onPress={() => !loading && setIsLogin(!isLogin)}>
                <Text style={styles.toggleText}>
                  {isLogin ? "No account? Sign up here" : "Already have an account? Login"}
                </Text>
              </Pressable>
            )}

            {isLogin && !forgotPasswordMode && (
              <Pressable onPress={() => !loading && setForgotPasswordMode(true)}>
                <Text style={styles.toggleText}>Forgot Password?</Text>
              </Pressable>
            )}

            {forgotPasswordMode && (
              <Pressable onPress={() => !loading && setForgotPasswordMode(false)}>
                <Text style={styles.toggleText}>Back to Login</Text>
              </Pressable>
            )}
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
    width: 200,
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
