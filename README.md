# Tism Calendar

ADHD-friendly planner built as an Expo mobile app with an Express + SQLite backend. The product is designed for ADHD users first, while still working well for students and anyone who wants clearer structure for tasks, events, calendars, reminders, and shared planning.

## What The App Does

- persistent auth with register, login, session restore, and logout
- focus dashboard with Today, Overdue, Easy wins, and shared work
- calendar grid plus selected-day agenda
- tasks and events with reminders, priority, effort, recurrence, and status
- personal calendars with categories and colors
- friend system for connecting users
- full calendar sharing between friends
- direct event/task sharing between friends
- recipient-specific filing for directly shared items, so one person can place a shared item in their own calendar without moving it for everyone

## Stack

- Frontend: Expo 54, React 19, React Native 0.81, Expo Router 6, TypeScript
- Backend: Express 5, Knex 3, better-sqlite3, JWT auth, bcrypt
- Database: SQLite

## Repo Layout

```text
frontend/   Expo app, screens, components, providers, API client
backend/    Express API, Knex migrations, controllers, auth, SQLite access
PROJECT_PROMPT.md   Product implementation brief used for ongoing development
```

## Core Screens

- Focus: live queue, bucket counts, primary actions, links to management flows
- Calendars: month grid, selected-day agenda, lightweight navigation to calendar management
- Friends: friend list, logout, links to friend add and calendar management
- Quick Capture: dedicated fast-add screen for tasks/events
- Calendar Center: create calendars, review calendars, and share them with friends
- Planner Item Editor: edit items, share items, and choose recipient-specific calendar placement for direct shares

## Friend System

The friend model is symmetric. Adding a friend creates both directions in the `friends` table so each user sees the other in their list.

Supported friend-related flows:

- add friend by username
- add friend by email
- list connected friends
- share a whole calendar only after a friendship exists
- share a single item only after a friendship exists
- let the recipient file a directly shared item into one of their own accessible calendars

Main endpoints involved:

- `POST /users/friends`
- `GET /users/friends`
- `POST /calendars/:id/share`
- `POST /items/:id/share`
- `PATCH /items/:id/my-calendar`

## Backend Setup

1. Create `backend/.env` from `backend/.env.example`
2. Install dependencies:

```powershell
cd C:\Users\Artur\Documents\expo-project\backend
npm install
```

3. Run migrations:

```powershell
npm run migrate
```

4. Start the API:

```powershell
npm run start
```

The backend listens on `http://127.0.0.1:3000` by default.

## Frontend Setup

1. Install dependencies:

```powershell
cd C:\Users\Artur\Documents\expo-project\frontend
npm install
```

2. Point the app at the backend.

Preferred for local work:

```powershell
$env:EXPO_PUBLIC_API_URL='http://127.0.0.1:3000'
```

For phone testing over tunnel, set `EXPO_PUBLIC_API_URL` to the public backend URL instead.

If `EXPO_PUBLIC_API_URL` is not set, the app falls back to:

- the locally derived Expo host on native when possible
- `frontend/app/config.json`

3. Start Expo:

```powershell
npx expo start
```

Useful variants:

```powershell
npx expo start --web --clear
npx expo start --tunnel --clear
```

## Verification

### Frontend checks

```powershell
cd C:\Users\Artur\Documents\expo-project\frontend
npm run lint
npx tsc --noEmit
```

### Friend-system smoke test

This verifies the full collaboration path against a running backend:

- register two fresh users
- connect them as friends
- confirm both friend lists
- create and share a calendar
- create and share a direct item
- file the direct item into the recipient's own calendar
- confirm the recipient dashboard sees the shared work

Run it with the backend already running on port `3000`:

```powershell
cd C:\Users\Artur\Documents\expo-project\backend
npm run smoke:friends
```

Optional override:

```powershell
$env:API_BASE='https://your-public-backend-url'
npm run smoke:friends
```

## Data Model Summary

Existing and current core tables:

- `users`
- `friends`
- `calendars`
- `calendar_users`
- `planner_items`
- `item_reminders`
- `item_shares`

High-level relationships:

- a user owns calendars
- calendars can be shared to other users through `calendar_users`
- items belong to an owner and optionally a calendar
- items can be directly shared through `item_shares`
- reminders belong to items
- friends gate collaboration flows

## Current Product Notes

- the UI is mobile-first and optimized around ADHD-friendly quick decision-making
- reminder data is stored and editable, but full device notification scheduling is still a future step
- the backend is SQLite-based, which is simple for development and MVP iteration
- collaboration currently centers on trusted friend connections, full calendar sharing, and direct item sharing

## Suggested Next Steps

- add device notification scheduling with Expo notifications
- add friend requests or invite states instead of immediate mutual friendship creation
- add automated API tests beyond the smoke test
- add export/import and richer recurrence editing
