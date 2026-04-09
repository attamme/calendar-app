# Calendar App

Expo Router mobile calendar app with an Express + SQLite backend.

## Requirements

- Node.js 20+
- npm
- Expo Go on a phone or an emulator/simulator

## 1. Clone the project

```bash
git clone https://github.com/attamme/calendar-app.git
cd calendar-app
```

## 2. Install dependencies

Frontend:

```bash
cd frontend
npm install
cd ..
```

Backend:

```bash
cd backend
npm install
cd ..
```

## 3. Start the backend

```bash
cd backend
npx knex --knexfile db/knexfile.js migrate:latest
node index.js
```

Expected output:

```bash
app listening on port: 3000
```

The backend now listens on `0.0.0.0:3000`, so devices on the same network can reach it.

## 4. Start the frontend

In a new terminal:

```bash
cd frontend
npx expo start
```

Then open:

- `w` for web
- `a` for Android
- `i` for iOS
- Expo Go by scanning the QR code

## API URL behavior

The tracked config is:

`frontend/app/config.json`

```json
{
  "API_URL": "http://localhost:3000"
}
```

How that behaves:

- On web, requests go to `http://localhost:3000`
- On Expo native/device builds, the app rewrites `localhost` to the current Expo dev host IP automatically

So in the normal local workflow you should not need to edit `config.json`.

## Common local workflow

Terminal 1:

```bash
cd backend
npx knex --knexfile db/knexfile.js migrate:latest
node index.js
```

Terminal 2:

```bash
cd frontend
npx expo start --clear
```

## Verification

Frontend checks:

```bash
cd frontend
npx tsc --noEmit
npx expo lint
npm test -- --runInBand
```

Backend syntax check:

```bash
cd backend
node --check index.js
```

## Troubleshooting

If login/register says it cannot reach the backend:

1. Confirm the backend terminal says `app listening on port: 3000`
2. Confirm frontend and backend are running on the same machine
3. If using a phone, make sure the phone and computer are on the same Wi‑Fi
4. Restart Expo with:

```bash
cd frontend
npx expo start --clear
```

5. Retry after restarting the backend:

```bash
cd backend
npx knex --knexfile db/knexfile.js migrate:latest
node index.js
```
