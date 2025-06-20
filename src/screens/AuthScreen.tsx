import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '../context/AuthContext';
import Colors from '../constants/colors';
import { CommonStyles, Typography, Spacing, BorderRadius } from '../constants/styles';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Анимации
  const slideAnimation = new Animated.Value(0);
  const fadeAnimation = new Animated.Value(0);
  const scaleAnimation = new Animated.Value(0.8);

  useEffect(() => {
    // Анимация появления
    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, введите email');
      return false;
    }
    
    if (!email.includes('@')) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректный email');
      return false;
    }
    
    if (password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
      return false;
    }
    
    if (!isLogin) {
      if (!name.trim()) {
        Alert.alert('Ошибка', 'Пожалуйста, введите ваше имя');
        return false;
      }
      
      if (password !== confirmPassword) {
        Alert.alert('Ошибка', 'Пароли не совпадают');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Что-то пошло не так. Попробуйте еще раз.');
    }
  };

  const showTermsOfService = () => {
    Alert.alert(
      'Условия использования',
      'Добро пожаловать в CogniTrack! Наше приложение создано для вашего эмоционального благополучия. Мы заботимся о конфиденциальности ваших данных и обязуемся обеспечить безопасную среду для отслеживания настроения.',
      [{ text: 'Понятно', style: 'default' }]
    );
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      'Политика конфиденциальности',
      'Ваши эмоциональные данные остаются конфиденциальными. Мы не передаем информацию третьим лицам и используем её только для улучшения вашего опыта в приложении.',
      [{ text: 'Понятно', style: 'default' }]
    );
  };

  const toggleMode = () => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.gradients.warm[0], Colors.gradients.warm[1]]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header с иконкой сердца */}
            <Animated.View
              style={[
                styles.header,
                {
                  opacity: fadeAnimation,
                  transform: [
                    {
                      translateY: slideAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={[Colors.secondary, Colors.primaryLight]}
                  style={styles.logoGradient}
                >
                  <MaterialIcons name="favorite" size={40} color={Colors.backgroundCard} />
                </LinearGradient>
              </View>
              
              <Text style={[Typography.heading1, styles.appTitle]}>CogniTrack</Text>
              <Text style={[Typography.bodyLarge, styles.subtitle]}>
                Ваш спутник в мире эмоций
              </Text>
            </Animated.View>

            {/* Форма */}
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnimation,
                  transform: [{ scale: scaleAnimation }],
                },
              ]}
            >
              <View style={styles.formCard}>
                <Text style={[Typography.heading2, styles.formTitle]}>
                  {isLogin ? 'Добро пожаловать обратно' : 'Присоединяйтесь к нам'}
                </Text>
                <Text style={[Typography.bodyMedium, styles.formSubtitle]}>
                  {isLogin
                    ? 'Рады видеть вас снова! Войдите, чтобы продолжить ваше путешествие'
                    : 'Начните заботиться о своём эмоциональном здоровье уже сегодня'}
                </Text>

                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Ваше имя</Text>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'name' && styles.inputFocused,
                      ]}
                      placeholder="Как к вам обращаться?"
                      placeholderTextColor={Colors.textLight}
                      value={name}
                      onChangeText={setName}
                      onFocus={() => setFocusedInput('name')}
                      onBlur={() => setFocusedInput(null)}
                      autoCapitalize="words"
                    />
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === 'email' && styles.inputFocused,
                    ]}
                    placeholder="your@email.com"
                    placeholderTextColor={Colors.textLight}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Пароль</Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === 'password' && styles.inputFocused,
                    ]}
                    placeholder="Минимум 6 символов"
                    placeholderTextColor={Colors.textLight}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry
                  />
                </View>

                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Подтвердите пароль</Text>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'confirmPassword' && styles.inputFocused,
                      ]}
                      placeholder="Повторите пароль"
                      placeholderTextColor={Colors.textLight}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onFocus={() => setFocusedInput('confirmPassword')}
                      onBlur={() => setFocusedInput(null)}
                      secureTextEntry
                    />
                  </View>
                )}

                {/* Кнопка входа/регистрации */}
                <Pressable
                  style={[styles.submitButton, loading && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.primaryDark]}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={[Typography.buttonText, styles.buttonText]}>
                      {loading
                        ? 'Загрузка...'
                        : isLogin
                        ? 'Войти в аккаунт'
                        : 'Создать аккаунт'}
                    </Text>
                  </LinearGradient>
                </Pressable>

                {/* Переключатель режима */}
                <Pressable style={styles.switchButton} onPress={toggleMode}>
                  <Text style={[Typography.bodyMedium, styles.switchText]}>
                    {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
                    <Text style={styles.switchLinkText}>
                      {isLogin ? 'Зарегистрироваться' : 'Войти'}
                    </Text>
                  </Text>
                </Pressable>
              </View>
            </Animated.View>

            {/* Условия использования */}
            <Animated.View
              style={[
                styles.footer,
                {
                  opacity: fadeAnimation,
                },
              ]}
            >
              <Text style={[Typography.bodySmall, styles.footerText]}>
                Продолжая, вы соглашаетесь с нашими{' '}
                <Text style={styles.linkText} onPress={showTermsOfService}>
                  Условиями использования
                </Text>
                {' '}и{' '}
                <Text style={styles.linkText} onPress={showPrivacyPolicy}>
                  Политикой конфиденциальности
                </Text>
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center' as const,
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  appTitle: {
    color: Colors.backgroundCard,
    textAlign: 'center' as const,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.backgroundCard,
    textAlign: 'center' as const,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center' as const,
  },
  formCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 15,
  },
  formTitle: {
    textAlign: 'center' as const,
    marginBottom: Spacing.sm,
    color: Colors.text,
  },
  formSubtitle: {
    textAlign: 'center' as const,
    marginBottom: Spacing.xl,
    color: Colors.textSecondary,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.warm,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundCard,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButton: {
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden' as const,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  switchButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center' as const,
  },
  switchText: {
    textAlign: 'center' as const,
    color: Colors.textSecondary,
  },
  switchLinkText: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  footerText: {
    textAlign: 'center' as const,
    color: Colors.backgroundCard,
    opacity: 0.8,
    lineHeight: 20,
  },
  linkText: {
    color: Colors.backgroundCard,
    fontWeight: '600' as const,
    textDecorationLine: 'underline' as const,
  },
}); 