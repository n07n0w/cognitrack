# 🚀 GitHub Actions Workflows

Этот проект использует **только бесплатные GitHub runners** для обеспечения доступности CI/CD процессов.

## 📋 Доступные Workflows

### 1. `build.yml` - Сборка приложения
- **Trigger**: Push в main, Pull Request
- **Runner**: `ubuntu-latest` (бесплатный)
- **Назначение**: Сборка Android APK через Expo EAS
- **Особенности**:
  - iOS сборка отключена (требует платный macOS runner)
  - Кэширование npm и Gradle зависимостей
  - TypeScript проверки и линтинг
  - Использует Supabase переменные окружения

### 2. `db-setup.yml` - Настройка базы данных Supabase ⭐
- **Trigger**: Только мануальный запуск (`workflow_dispatch`)
- **Runner**: `ubuntu-latest` (бесплатный)
- **Назначение**: Создание структуры БД в Supabase
- **Переменные**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

#### Как запустить настройку БД:
1. Перейдите во вкладку **Actions** в GitHub
2. Выберите **"Setup Supabase Database"**
3. Нажмите **"Run workflow"**
4. Введите **"confirm"** в поле подтверждения
5. Опционально: установите **force_recreate** для пересоздания таблиц

### 3. `db-check.yml` - Проверка состояния БД
- **Trigger**: Только мануально
- **Runner**: `ubuntu-latest` (бесплатный)
- **Назначение**: Проверка состояния базы данных по требованию
- **Переменные**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

## 🔐 Требуемые GitHub Secrets

Для работы workflows необходимо настроить следующие секреты в настройках репозитория:

```bash
# Expo/EAS
EXPO_TOKEN=your_expo_token

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Только для EAS билдов

# Google OAuth (опционально)
GOOGLE_WEB_CLIENT_ID=your_web_client_id
GOOGLE_IOS_CLIENT_ID=your_ios_client_id
GOOGLE_ANDROID_CLIENT_ID=your_android_client_id
```

## 💰 Использование бесплатных ресурсов

### ✅ Бесплатные runners:
- `ubuntu-latest` - используется во всех workflows
- 2000 минут/месяц для приватных репозиториев
- Безлимитно для публичных репозиториев

### ❌ Платные runners (не используются):
- `macos-latest` - требуется для iOS сборок
- `windows-latest` - не требуется для React Native

## 🛠️ Техническая архитектура

### Кэширование для оптимизации:
- **npm зависимости**: `~/.npm`, `node_modules`
- **Gradle**: `~/.gradle/caches`, `~/.gradle/wrapper`, `android/.gradle`

### Используемые Actions:
- `actions/checkout@v4` - получение кода
- `actions/setup-node@v4` - настройка Node.js 20
- `actions/cache@v4` - кэширование зависимостей
- `actions/github-script@v7` - создание issues при ошибках

## 🗄️ База данных Supabase

### Структура таблиц:
- `emotions` - справочник эмоций
- `activities` - справочник активностей  
- `mood_entries` - записи настроения
- `mood_entry_activities` - связь записей и активностей
- `gratitude_entries` - записи благодарности

### Процесс настройки:
1. Проверка подключения к Supabase
2. Создание таблиц по схеме `src/db/schema.sql`
3. Наполнение справочными данными из `src/constants/moodData.js`
4. Верификация доступности таблиц

## 🔍 Проверка базы данных

- **Мануальная проверка** состояния БД через GitHub Actions
- **Локальная проверка** через `npm run check-db`
- **Автоматическое создание issues** при ошибках в GitHub Actions
- **Детальное логирование** всех операций

## 🚨 Устранение неполадок

### Если workflow падает:
1. Проверьте настройку GitHub Secrets
2. Убедитесь, что Supabase проект активен
3. Проверьте права доступа для ANON_KEY
4. Просмотрите логи workflow для деталей

### Если БД недоступна:
1. Запустите `db-setup.yml` мануально
2. Проверьте статус Supabase проекта
3. Обновите ключи доступа при необходимости

---

**📱 CogniTrack** - приложение для отслеживания настроения с автоматизированной CI/CD системой на основе бесплатных GitHub runners и Supabase. 