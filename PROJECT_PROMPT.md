# ADHD Calendar App Build Prompt

You are continuing development of an existing mobile app project. Treat this as a real product build, not a demo. The app is an Expo mobile app for people with ADHD, students, and anyone who wants better structure for tasks, events, routines, and shared planning.

## Product Vision

Build an ADHD-friendly calendar and task planner that reduces overwhelm, improves follow-through, and makes planning easier. The experience should be fast, clear, forgiving, and motivating. It should help users:

- capture tasks quickly before they forget
- sort tasks in smarter ways than a normal calendar
- get reminders that work for ADHD-style time blindness
- separate life areas like school, work, personal, health, and routines
- share full calendars or single events with friends
- use accountability and collaboration without making the app feel heavy

The product should still work well for students and general productivity users, but the UX should primarily be optimized for ADHD needs.

## Current Stack And Constraints

Use the existing project structure and stay compatible with the current versions unless there is a strong technical reason not to:

- Frontend: Expo `~54.0.33`, React `19.1.0`, React Native `0.81.5`, Expo Router `~6.0.23`, TypeScript
- Frontend already includes: `expo-secure-store`, `expo-auth-session`, `expo-web-browser`, `react-native-reanimated`, `react-native-svg`
- Backend: Express `5.2.1`, Knex `3.1.0`, `better-sqlite3`, JWT auth, bcrypt
- Database: SQLite via Knex migrations

Do not downgrade Expo or React Native packages. Build on the current setup.

## Current Repo State

The repo already has:

- a `frontend` Expo app with starter auth and home screens
- reusable UI components like `MiniCalendar`, `TaskView`, `InputText`, and `Button`
- a `backend` Express API with early auth and calendar/friend endpoints
- existing database tables for `users`, `friends`, `calendars`, and `calendar_users`

The project is still incomplete. Many screens are placeholders, and the current backend does not yet fully support the intended product.

## What To Build

Turn the project into a usable MVP with a strong foundation for future growth.

### Core Features

Implement these features end-to-end:

- authentication: register, login, persistent session, logout
- personal calendars with colors, labels, and categories
- tasks and events with title, notes, due date, start/end time, calendar, priority, status, reminders, and repeat options
- advanced sorting and filtering
- ADHD-focused organization helpers
- reminders and notification-ready scheduling support
- friend system and sharing

### ADHD-Focused UX Requirements

Design the app so it helps with executive dysfunction and time blindness:

- quick-add flow from the main screen with minimal required inputs
- clear priority system such as urgent, important, easy win, overdue
- multiple useful task views, for example:
  - today
  - next up
  - overdue
  - low effort wins
  - school
  - routines
- visual urgency cues without making the UI stressful
- soft but effective reminders, including support for multiple reminders per task/event
- routine and recurring task support
- progress feedback that feels encouraging, not punishing
- easy rescheduling and snoozing

### Collaboration Features

Users should be able to:

- add friends
- view friend connections
- share an entire calendar with selected friends
- share only a specific event or task with selected friends
- control whether invited users can only view or can also edit

## Database Requirements

Use the database properly and do not leave important product behavior as mock data or frontend-only state.

Reuse the existing tables where they make sense:

- `users`
- `friends`
- `calendars`
- `calendar_users`

Extend the schema cleanly with Knex migrations for the missing product concepts, likely including:

- tasks
- events
- reminders
- recurring rules or recurrence metadata
- shared event participants
- task tags or categories
- notification preferences or reminder metadata if needed

Keep relationships explicit and queryable. Build the backend so the frontend can rely on real API data.

## API Expectations

Create or improve backend routes and controllers for:

- auth
- user profile/session
- friends
- calendars
- calendar sharing
- tasks
- events
- reminders
- filtering/sorting queries

Validate inputs, return clear JSON responses, and keep auth protected routes behind JWT middleware.

## Frontend Expectations

Build a mobile-first experience in Expo Router with clear navigation and consistent styling.

The frontend should include:

- onboarding or landing experience that explains the product clearly
- working auth screens
- dashboard/home with quick capture and smart task overview
- calendar view
- task/event creation and editing flows
- task detail screen
- friends/share management screens
- filters/sorting controls that are genuinely useful for ADHD users

Avoid generic placeholder text and starter-template behavior. Use the existing components when helpful, but improve them where needed.

## Product Direction For Sorting And Reminders

Advanced sorting should be meaningful, not just alphabetical or date-based. Include combinations such as:

- due soon + high priority
- overdue + easy to finish
- grouped by calendar or life area
- grouped by energy level or estimated effort
- routines vs one-off tasks
- assigned/shared items

Reminder behavior should support real-life ADHD needs:

- multiple reminders for one item
- reminders before start time and due time
- optional same-day follow-up reminders
- easy snooze/reschedule pathways

## Quality Bar

When implementing, focus on:

- real end-to-end flows
- readable code and reusable components
- good mobile UX
- accessible and low-stress visual design
- strong state handling
- no fake data for core flows
- clean database-backed logic

## Deliverables

When working on this project:

- implement features directly in the existing codebase
- keep compatibility with the current Expo setup
- add or update Knex migrations as needed
- wire frontend screens to real backend endpoints
- replace placeholders with product-specific UX
- leave the project in a state where the app already demonstrates the intended ADHD calendar concept clearly

If tradeoffs are needed, prioritize this order:

1. Working auth and session flow
2. Real calendars, tasks, and reminders backed by the database
3. ADHD-friendly home/dashboard and sorting flows
4. Friend connections and sharing for calendars/events
5. UI polish and secondary improvements
