# CogniTrack - Enhanced Mood Tracking App

A comprehensive mood tracking application built with React Native, Expo, and TypeScript.

## 🔧 Code Improvements Summary

### Performance Optimizations
- ✅ Added `react-native-screens` optimization
- ✅ Implemented `useCallback` and `useMemo` for performance
- ✅ Added proper component memoization
- ✅ Optimized navigation with proper screen handling

### TypeScript & Type Safety  
- ✅ Added comprehensive navigation typing
- ✅ Enhanced component type definitions
- ✅ Proper error handling with types
- ✅ Improved code reliability and maintainability

### State Management
- ✅ Implemented React Context with useReducer
- ✅ Centralized mood data management
- ✅ Added proper error states and loading indicators
- ✅ Enhanced data flow architecture

### UI/UX Enhancements
- ✅ Improved EmotionEntryScreen with better validation
- ✅ Enhanced PerformanceScreen with real analytics
- ✅ Redesigned ProfileScreen with tabs and settings
- ✅ Added MoodEntryCard component for better data display
- ✅ Implemented better visual feedback and interactions

### Code Quality
- ✅ Better component architecture
- ✅ Improved error handling
- ✅ Enhanced accessibility
- ✅ Added proper TypeScript interfaces

## 🚀 Installation

```bash
npm install
```

### 📊 Database Setup & Check

1. Configure environment variables:
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

2. Check database connection:
```bash
npm run check-db
```

3. Setup database (via GitHub Actions):
   - Go to **Actions** → **"Setup Supabase Database"**
   - Enter "confirm" and run workflow

4. Start development:
```bash
npm start
```

### 🔐 Authentication System

Приложение теперь начинается с экрана входа/регистрации:

1. **Первый запуск**: Экран регистрации/входа
2. **Демо-аккаунт**: Используйте любой email и пароль (мин. 6 символов)
3. **Соглашения**: Встроенные ссылки на политику конфиденциальности
4. **Автоматический вход**: Состояние сохраняется между сессиями

Для выхода из аккаунта: **Профиль** → **Аккаунт** → **Выйти из аккаунта**

## 📱 Features
- 🔐 **User authentication** with login/registration
- 📝 **Mood tracking** with intensity levels
- 📊 **Activity correlation** analysis  
- 🙏 **Gratitude journaling**
- 📈 **Analytics and insights**
- 💾 **Data export** capabilities
- 🔒 **Privacy controls** and agreements
- 👤 **User profile** management

## 🛠 Tech Stack
- React Native + Expo
- TypeScript
- React Navigation
- AsyncStorage
- Context API 