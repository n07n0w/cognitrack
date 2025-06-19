# 🛠️ Руководство по проверке базы данных Supabase

## ✅ Проверка выполнена с использованием Context7

Используя документацию Supabase через Context7, была создана система проверки базы данных:

### 🔧 Что сделано:

1. **✅ Убраны все кроны из GitHub Actions**
   - Удален `schedule` из `db-check.yml`
   - Оставлен только `workflow_dispatch` (мануальный запуск)

2. **✅ Создан скрипт проверки БД** (`scripts/check-supabase.js`)
   - Использует `@supabase/supabase-js` клиент
   - Проверяет подключение к Supabase
   - Анализирует структуру таблиц
   - Показывает количество записей в каждой таблице

3. **✅ Добавлен npm script** 
   - `npm run check-db` для локальной проверки

## 🚀 Как проверить базу данных Supabase:

### Способ 1: Локально
```bash
# Установите переменные окружения:
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key-here"

# Запустите проверку:
npm run check-db
```

### Способ 2: Через GitHub Actions
1. Перейдите в **Actions** в GitHub репозитории
2. Выберите **"Database Health Check"**
3. Нажмите **"Run workflow"**
4. Посмотрите результат в логах

## 📊 Что проверяется:

### Таблицы:
- ✅ `emotions` - справочник эмоций
- ✅ `activities` - справочник активностей  
- ✅ `mood_entries` - записи настроения
- ✅ `gratitude_entries` - записи благодарности
- ✅ `mood_entry_activities` - связи записей и активностей

### Данные:
- 📈 Количество записей в каждой таблице
- 🔗 Проверка доступности API Supabase
- 🎯 Примеры данных (эмоции и активности)

## 🔧 Пример вывода:

```
🔍 Проверка базы данных Supabase...
📍 URL: https://your-project.supabase.co

📊 Проверка таблиц:
✅ Таблица emotions: 9 записей
✅ Таблица activities: 9 записей
✅ Таблица mood_entries: 12 записей
✅ Таблица gratitude_entries: 5 записей
✅ Таблица mood_entry_activities: 8 записей

🔍 Проверка данных:
✅ Эмоции: 9 записей
   Примеры: 😃 Joy, 🙏 Grateful, 😌 Peaceful
✅ Активности: 9 записей
   Примеры: 🏃 Exercise, 🧘 Meditation, 📚 Reading

🎉 Проверка базы данных завершена!
✅ База данных готова к работе!
```

## ⚠️ Если база данных не настроена:

1. **Создайте таблицы** через GitHub Actions:
   - Actions → "Setup Supabase Database" 
   - Введите "confirm"
   - Запустите workflow

2. **Или настройте вручную** в Supabase Dashboard:
   - Скопируйте SQL из `src/db/schema.sql`
   - Выполните в SQL Editor
   - Добавьте данные из `src/constants/moodData.ts`

## 🔐 Необходимые переменные:

```bash
# Обязательные:
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Для GitHub Actions (Secrets):
# Settings → Secrets and variables → Actions
```

---

**Результат**: Полная система проверки базы данных Supabase без автоматических расписаний, основанная на лучших практиках из Context7 документации! 🎉 