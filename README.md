## Installation

```bash
$ yarn install
```

## Скрипты package.json

| Скрипт                      | Описание                                                                                   |
|-----------------------------|-------------------------------------------------------------------------------------------|
| `yarn build`                | Сборка проекта NestJS                                                                     |
| `yarn format`               | Форматирование кода с помощью Prettier                                                    |
| `yarn start`                | Запуск приложения в обычном режиме                                                        |
| `yarn start:auth:dev`       | Запуск сервиса Auth в режиме разработки с hot-reload                                      |
| `yarn start:api-gateway:dev`| Запуск сервиса API Gateway в режиме разработки с hot-reload                               |
| `yarn start:smart-link:dev` | Запуск сервиса Smart Link в режиме разработки с hot-reload                                |
| `yarn start:debug`          | Запуск приложения в режиме отладки                                                        |
| `yarn start:prod`           | Запуск собранного приложения (production)                                                 |
| `yarn db-migration:create <name>` | Создание новой миграции с помощью sequelize-cli                                 |
| `yarn db-migrate`           | Применение миграций к базе данных                                                         |
| `yarn lint`                 | Запуск ESLint с автоисправлением                                                          |
| `yarn test`                 | Запуск unit-тестов                                                                        |
| `yarn test:watch`           | Запуск unit-тестов в watch-режиме                                                        |
| `yarn test:cov`             | Запуск покрытия unit-тестов                                                               |
| `yarn test:debug`           | Запуск unit-тестов в режиме отладки                                                       |

## Сборка Docker-образа

1. Соберите проект:
   ```bash
   yarn build
   ```

2. Соберите Docker-образ:
   ```bash
   docker build -t smart-link .
   ```

3. Запустите контейнер:
   ```bash
   docker run -p 3000:3000 --env-file .env smart-link
   ```
