# 🚀 LinguaFlash — Quick Start Guide

**Last Updated:** 2026-05-23 07:28 UTC  
**Current Phase:** Phase 4 Complete ✅

---

## Быстрый старт

### 1. Запуск сервисов

```bash
cd /Users/ips14macmini/linguaflash

# Запустить Supabase (если остановлен)
npx supabase start

# Запустить dev сервер
npm run dev
```

### 2. Доступ к приложению

- **Frontend:** http://localhost:5174
- **Supabase Studio:** http://127.0.0.1:54323
- **API:** http://127.0.0.1:54321

### 3. Тестовый сценарий

1. Зарегистрируйтесь: http://localhost:5174/register
2. Войдите в систему
3. Перейдите в "Колоды" → выберите любую колоду
4. Нажмите "Начать изучение"
5. Изучите 20 карточек
6. Посмотрите итоги сессии

---

## Что работает сейчас

### ✅ Реализовано (Phase 1-4)

- [x] Регистрация и авторизация
- [x] 5 колод с 500 карточками (испанский-русский)
- [x] Режим изучения Flashcards
- [x] 3D flip-анимация карточек
- [x] Система самооценки (4 уровня)
- [x] SM-2 алгоритм интервального повторения
- [x] Отслеживание прогресса по каждой карточке
- [x] Начисление XP и уровней
- [x] История сессий
- [x] Статистика по колодам

### 🔄 В разработке (Phase 5)

- [ ] Умный выбор карточек (приоритет просроченным)
- [ ] Виджет "Карточки на сегодня" в Dashboard
- [ ] Отслеживание streak (серий)
- [ ] Графики прогресса

---

## Структура проекта

```
linguaflash/
├── src/
│   ├── components/
│   │   └── Flashcard.tsx          # 3D flip карточка
│   ├── pages/
│   │   ├── HomePage.tsx           # Главная страница
│   │   ├── LoginPage.tsx          # Вход
│   │   ├── RegisterPage.tsx       # Регистрация
│   │   ├── DashboardPage.tsx      # Дашборд пользователя
│   │   ├── DecksPage.tsx          # Список колод
│   │   ├── DeckDetailPage.tsx     # Детали колоды
│   │   ├── StudySessionPage.tsx   # Сессия изучения
│   │   └── ProfilePage.tsx        # Профиль пользователя
│   ├── stores/
│   │   └── authStore.ts           # Zustand store для auth
│   ├── lib/
│   │   └── supabase.ts            # Supabase клиент
│   ├── App.tsx                    # Роутинг
│   └── main.tsx                   # Entry point
├── supabase/
│   └── migrations/                # SQL миграции
└── .planning/                     # Документация
```

---

## База данных

### Таблицы

1. **auth.users** — пользователи (Supabase Auth)
2. **profiles** — профили пользователей (XP, level, streak)
3. **decks** — колоды карточек (5 штук)
4. **cards** — карточки (500 штук)
5. **user_card_progress** — прогресс по карточкам
6. **study_sessions** — история сессий

### Проверка данных

```sql
-- Количество колод
SELECT COUNT(*) FROM decks;  -- 5

-- Количество карточек
SELECT COUNT(*) FROM cards;  -- 500

-- Пользователи
SELECT username, xp, level FROM profiles;

-- Прогресс пользователя
SELECT * FROM user_card_progress WHERE user_id = 'xxx';

-- Сессии
SELECT * FROM study_sessions WHERE user_id = 'xxx';
```

---

## Полезные команды

### Разработка

```bash
# Запустить dev сервер
npm run dev

# Собрать для продакшена
npm run build

# Предпросмотр продакшен-сборки
npm run preview
```

### Supabase

```bash
# Статус сервисов
npx supabase status

# Остановить Supabase
npx supabase stop

# Запустить Supabase
npx supabase start

# Сбросить БД (удалит все данные!)
npx supabase db reset

# Открыть Studio
npx supabase studio
```

### Git

```bash
# Статус
git status

# Коммит
git add .
git commit -m "feat: Phase 4 complete"

# Пуш
git push origin main
```

---

## Troubleshooting

### Проблема: Dev сервер не запускается

```bash
# Проверить, занят ли порт
lsof -i :5174

# Убить процесс
kill -9 <PID>

# Запустить снова
npm run dev
```

### Проблема: Supabase не работает

```bash
# Проверить статус
npx supabase status

# Перезапустить
npx supabase stop
npx supabase start
```

### Проблема: Нет карточек в колоде

```bash
# Проверить в Studio
# http://127.0.0.1:54323
# Table Editor → cards → должно быть 500 записей

# Если пусто, пересоздать БД
npx supabase db reset
```

---

## Roadmap

### Завершено (4/7 фаз)

- ✅ Phase 1: Project Setup
- ✅ Phase 2: Authentication
- ✅ Phase 3: Content (500 cards)
- ✅ Phase 4: Flashcards Mode

### В планах (3/7 фаз)

- 🔄 Phase 5: SR Algorithm (1 день)
- ⏳ Phase 6: Quiz & Type Modes (1.5 дня)
- ⏳ Phase 7: Gamification (1.5 дня)

**До MVP:** ~4 дня

---

## Контакты и ссылки

- **GitHub:** https://github.com/godas14/linguaflash
- **Документация:** `/Users/ips14macmini/linguaflash/.planning/`
- **Dev Server:** http://localhost:5174
- **Supabase Studio:** http://127.0.0.1:54323

---

## Следующие шаги

1. **Протестировать Phase 4:**
   - Зарегистрироваться
   - Изучить несколько карточек
   - Проверить начисление XP
   - Проверить сохранение прогресса

2. **Начать Phase 5:**
   - Реализовать умный выбор карточек
   - Добавить виджет "Карточки на сегодня"
   - Внедрить streak tracking

3. **Опционально:**
   - Добавить клавиатурные сокращения
   - Улучшить мобильную версию
   - Добавить звуковые эффекты

---

**Статус:** ✅ Phase 4 готова к использованию!  
**Следующая фаза:** Phase 5 — Spaced Repetition Optimization
