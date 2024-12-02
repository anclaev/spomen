## DDD layers

### API

- API-контракты/реализация
- Доступ к микросервису(-ам)
- Access to microservice(-s)

### App(-lication)

- Команды и обработчики команд
- Запросы

### Domain

- Aggregate root
- Контракты репозитория

### Infrastructure

- Реализация р*еп*озитория
- Доступ к Prisma
- Используемое из Application layer:
  - Logging, crypto, ...
