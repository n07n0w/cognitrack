import { StyleSheet } from 'react-native';
import Colors from './colors';

export const CommonStyles = StyleSheet.create({
  // Контейнеры
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Карточки с мягкими тенями
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  
  softCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  
  // Кнопки
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  secondaryButton: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  
  softButton: {
    backgroundColor: Colors.backgroundSoft,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Текст
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 36,
  },
  
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 24,
  },
  
  body: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  
  caption: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  
  warmText: {
    fontSize: 16,
    color: Colors.textWarm,
    fontWeight: '500',
  },
  
  // Поля ввода
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  
  inputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Разделители
  section: {
    marginBottom: 32,
  },
  
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 20,
  },
  
  // Специальные элементы
  emotionBubble: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 12,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Анимированные элементы
  floatingCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 24,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
});

export const Typography = {
  heading1: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.text,
    lineHeight: 40,
  },
  
  heading2: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 32,
  },
  
  heading3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    lineHeight: 28,
  },
  
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  
  bodyMedium: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textLight,
    lineHeight: 20,
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.buttonText,
  },
  
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  
  warm: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.textWarm,
    lineHeight: 24,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,
};

export default CommonStyles; 