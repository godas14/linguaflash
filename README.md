# 🇪🇸 LinguaFlash

Мобильное приложение для изучения испанского языка с русскими переводами.

## Особенности

- 🃏 **Умные карточки** — Spaced repetition алгоритм (SM-2)
- 🎮 **Геймификация** — XP, уровни, streak, достижения
- 📚 **5 режимов обучения** — Flashcards, Quiz, Type, Listening, Matching
- 📱 **Web-first** — Работает на любом устройстве
- 🚀 **500 слов** — A1-A2 уровень для MVP

## Технологии

- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **State:** Zustand
- **Deploy:** Vercel

## Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build
```

## Структура проекта

```
linguaflash/
├── .planning/          # GSD документация
│   ├── PROJECT.md      # Видение проекта
│   ├── REQUIREMENTS.md # Детальные требования
│   ├── ROADMAP.md      # План разработки (7 фаз)
│   └── STATE.md        # Текущее состояние
├── src/
│   ├── pages/          # Страницы приложения
│   ├── components/     # React компоненты
│   ├── lib/            # Утилиты (Supabase клиент)
│   └── stores/         # Zustand stores
└── public/             # Статические файлы
```

## Roadmap

- [x] **Phase 1:** Project Setup (текущая)
- [ ] **Phase 2:** Authentication System
- [ ] **Phase 3:** Content Foundation (500 cards)
- [ ] **Phase 4:** Classic Flashcards Mode
- [ ] **Phase 5:** Spaced Repetition Algorithm
- [ ] **Phase 6:** Quiz & Type Modes
- [ ] **Phase 7:** Gamification & Polish

**MVP Timeline:** 8.5 дней

## Статус

🚧 **В разработке** — Phase 1 завершена, переход к Phase 2

---

Создано с помощью GSD (Get Shit Done) workflow
