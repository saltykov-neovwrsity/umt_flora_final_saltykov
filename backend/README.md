# Flora Backend

Серверна частина full-stack проєкту Flora, побудована на базі Express та Sequelize (PostgreSQL).

## Особливості архітектури
- **Express.js** — веб-фреймворк для розробки REST API.
- **Sequelize ORM** — взаємодія з базою даних PostgreSQL (з локальним SQLite-фолбеком для розробки).
- **PostgreSQL** — хмарна база даних на Render.
- **Cloudinary** — хмарне сховище для постійного збереження зображень букетів.
- **Multer** — мідлвар для тимчасового завантаження файлів на сервер перед відправкою у Cloudinary.
- **Joi** — валідація вхідних даних (тіла запитів).
- **Swagger UI** — інтерактивна документація API.

---

## Інструкція з локального запуску

### 1. Перейдіть до папки бекенду та встановіть залежності:
```bash
cd backend
npm install
```

### 2. Створіть та налаштуйте файл `.env`:
Скопіюйте файл `.env.example` у новий файл `.env` та вкажіть параметри підключення до PostgreSQL та Cloudinary:
```env
PORT=3001
DATABASE_URL=ваш_рядок_підключення_до_postgres_на_render

# Дані Cloudinary
CLOUDINARY_CLOUD_NAME=ваш_cloud_name
CLOUDINARY_API_KEY=ваш_api_key
CLOUDINARY_API_SECRET=ваш_api_secret
```

*Примітка: Якщо `DATABASE_URL` не вказано, додаток автоматично перейде на роботу з локальною базою даних SQLite (`dev.sqlite`), яка створиться сама.*

### 3. Запустіть сервер:
- **У режимі розробки (nodemon):**
  ```bash
  npm run dev
  ```
- **У звичайному режимі (production):**
  ```bash
  npm start
  ```

---

## Інструкція з розгортання на Render (Web Service)

1. Запуште всі зміни у ваш GitHub репозиторій.
2. У кабінеті **Render** натисніть **New +** -> **Web Service**.
3. Підключіть свій репозиторій.
4. Вкажіть наступні налаштування:
   - **Name**: `flora-backend` (або інша назва)
   - **Region**: Frankfurt (бажано той самий, що й у бази даних)
   - **Root Directory**: `backend` *(критично важливо!)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. У розділі **Environment Variables** додайте такі змінні:
   - `DATABASE_URL` — рядок підключення до вашої PostgreSQL на Render.
   - `CLOUDINARY_CLOUD_NAME` — ваш Cloud name від Cloudinary.
   - `CLOUDINARY_API_KEY` — ваш API Key від Cloudinary.
   - `CLOUDINARY_API_SECRET` — ваш API Secret від Cloudinary.
   - `NODE_ENV` — `production`
6. Натисніть **Deploy Web Service**. Після завершення білду ваш бекенд буде доступний за адресою https://flora-backend-ordu.onrender.com.

---

## Swagger Документація API
Після запуску сервера інтерактивна документація Swagger доступна за адресою:
`http://localhost:3001/api-docs` (локально) або `https://flora-backend-ordu.onrender.com/api-docs` (на продакшені).

---

## REST API ендпоінти

### Колекція букетів (bouquets)
| Метод | Ендпоінт | Опис |
| :--- | :--- | :--- |
| **GET** | `/api/bouquets` | Отримати список усіх букетів (підтримує пагінацію `_page` та `_per_page`) |
| **GET** | `/api/bouquets/:id` | Отримати деталі одного букета за ID |
| **POST** | `/api/bouquets` | Створити новий букет (підтримує `multipart/form-data` для прямого завантаження зображення у полі `photoURL`, Joi-валідацію та автогенерацію Gravatar) |
| **PUT** | `/api/bouquets/:id` | Оновити всі поля букета (підтримує `multipart/form-data` для заміни файлу зображення) |
| **PATCH** | `/api/bouquets/:id/favorite` | Оновити статус `favorite` (обране) |
| **PATCH** | `/api/bouquets/:id/photo` | Окремий ендпоінт для оновлення фото букета на Cloudinary (`multipart/form-data`, поле `photoURL`) |
| **DELETE** | `/api/bouquets/:id` | Видалити букет |

### Колекція відгуків (feedbacks)
| Метод | Ендпоінт | Опис |
| :--- | :--- | :--- |
| **GET** | `/api/feedbacks` | Отримати список усіх відгуків з бази даних |
| **POST** | `/api/feedbacks` | Створити новий відгук (з валідацією Joi) |
