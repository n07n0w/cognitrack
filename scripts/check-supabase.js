const { createClient } = require('@supabase/supabase-js');

/**
 * Проверка базы данных Supabase
 * Использует SUPABASE_URL и SUPABASE_ANON_KEY из переменных окружения
 */
async function checkSupabaseDatabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Отсутствуют переменные окружения:');
    console.error('   SUPABASE_URL:', supabaseUrl ? '✅ установлена' : '❌ не найдена');
    console.error('   SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ установлена' : '❌ не найдена');
    process.exit(1);
  }

  console.log('🔍 Проверка базы данных Supabase...');
  console.log('📍 URL:', supabaseUrl);

  try {
    // Создаем клиент Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Проверяем подключение и таблицы
    const tables = ['emotions', 'activities', 'mood_entries', 'gratitude_entries', 'mood_entry_activities'];
    
    console.log('\n📊 Проверка таблиц:');
    
    for (const tableName of tables) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error(`❌ Таблица ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ Таблица ${tableName}: ${count} записей`);
        }
      } catch (err) {
        console.error(`❌ Ошибка при проверке таблицы ${tableName}:`, err.message);
      }
    }

    // Проверяем референсные данные
    console.log('\n🔍 Проверка данных:');
    
    const { data: emotions, error: emotionsError } = await supabase
      .from('emotions')
      .select('*');
    
    if (emotionsError) {
      console.error('❌ Ошибка при получении эмоций:', emotionsError.message);
    } else {
      console.log(`✅ Эмоции: ${emotions.length} записей`);
      if (emotions.length > 0) {
        console.log('   Примеры:', emotions.slice(0, 3).map(e => `${e.emoji} ${e.label}`).join(', '));
      }
    }

    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select('*');
    
    if (activitiesError) {
      console.error('❌ Ошибка при получении активностей:', activitiesError.message);
    } else {
      console.log(`✅ Активности: ${activities.length} записей`);
      if (activities.length > 0) {
        console.log('   Примеры:', activities.slice(0, 3).map(a => `${a.icon} ${a.name}`).join(', '));
      }
    }

    // Проверяем записи настроения
    const { data: moodEntries, error: moodError } = await supabase
      .from('mood_entries')
      .select('*')
      .limit(5);
    
    if (moodError) {
      console.error('❌ Ошибка при получении записей настроения:', moodError.message);
    } else {
      console.log(`✅ Записи настроения: ${moodEntries.length} записей (показано до 5)`);
    }

    console.log('\n🎉 Проверка базы данных завершена!');
    
    // Проверяем есть ли данные для начала работы
    if (emotions.length === 0 || activities.length === 0) {
      console.log('\n⚠️ Рекомендация: Запустите workflow "Setup Supabase Database" для создания начальных данных');
    } else {
      console.log('\n✅ База данных готова к работе!');
    }

  } catch (error) {
    console.error('❌ Ошибка подключения к Supabase:', error.message);
    process.exit(1);
  }
}

// Запуск проверки
checkSupabaseDatabase(); 