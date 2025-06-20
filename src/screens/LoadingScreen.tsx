import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import Colors from '../constants/colors';
import { Typography, Spacing } from '../constants/styles';

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
  const heartScale = useRef(new Animated.Value(1)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Анимация появления
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Анимация пульсации сердца
    const pulseHeart = () => {
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => pulseHeart());
    };

    // Анимация волны
    const pulseWave = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    pulseHeart();
    pulseWave();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={[Colors.gradients.warm[0], Colors.gradients.warm[1]]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnimation,
            },
          ]}
        >
          {/* Пульсирующие круги фона */}
          <Animated.View
            style={[
              styles.pulseCircle,
              styles.pulseCircle1,
              {
                transform: [
                  {
                    scale: pulseAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.4],
                    }),
                  },
                ],
                opacity: pulseAnimation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.1, 0.3, 0.1],
                }),
              },
            ]}
          />
          
          <Animated.View
            style={[
              styles.pulseCircle,
              styles.pulseCircle2,
              {
                transform: [
                  {
                    scale: pulseAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1.2, 0.6],
                    }),
                  },
                ],
                opacity: pulseAnimation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.15, 0.25, 0.15],
                }),
              },
            ]}
          />

          {/* Логотип с сердцем */}
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.heartContainer,
                {
                  transform: [{ scale: heartScale }],
                },
              ]}
            >
              <LinearGradient
                colors={[Colors.secondary, Colors.primaryLight]}
                style={styles.heartGradient}
              >
                <MaterialIcons name="favorite" size={50} color={Colors.backgroundCard} />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Название приложения */}
          <Text style={[Typography.heading1, styles.appTitle]}>
            CogniTrack
          </Text>

          {/* Подзаголовок */}
          <Text style={[Typography.bodyLarge, styles.subtitle]}>
            Заботясь о вашем эмоциональном здоровье
          </Text>

          {/* Индикатор загрузки */}
          <View style={styles.loadingContainer}>
            <Animated.View
              style={[
                styles.loadingDot,
                {
                  transform: [
                    {
                      scale: pulseAnimation.interpolate({
                        inputRange: [0, 0.33, 0.66, 1],
                        outputRange: [1, 1.5, 1, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.loadingDot,
                {
                  transform: [
                    {
                      scale: pulseAnimation.interpolate({
                        inputRange: [0, 0.33, 0.66, 1],
                        outputRange: [1, 1, 1.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.loadingDot,
                {
                  transform: [
                    {
                      scale: pulseAnimation.interpolate({
                        inputRange: [0, 0.33, 0.66, 1],
                        outputRange: [1, 1, 1, 1.5],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>

          {/* Мотивирующий текст */}
          <Text style={[Typography.bodyMedium, styles.motivationText]}>
            Подготавливаем для вас пространство заботы...
          </Text>
        </Animated.View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  pulseCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: Colors.backgroundCard,
  },
  pulseCircle1: {
    top: '20%',
  },
  pulseCircle2: {
    bottom: '20%',
  },
  logoContainer: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  heartContainer: {
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  heartGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    color: Colors.backgroundCard,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontSize: 36,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.backgroundCard,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: Spacing.xxl,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.backgroundCard,
    marginHorizontal: 6,
    opacity: 0.7,
  },
  motivationText: {
    color: Colors.backgroundCard,
    textAlign: 'center',
    opacity: 0.8,
    fontStyle: 'italic',
  },
}); 