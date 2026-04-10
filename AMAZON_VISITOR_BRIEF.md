# Tism Calendar
## Project Brief For Visiting Amazon Representative

## 1. Overview

Tism Calendar is a mobile-first planning app designed for people with ADHD, students, and anyone who benefits from clearer structure. The project focuses on reducing overwhelm, improving follow-through, and making planning more collaborative without making the experience feel heavy or stressful.

This app is being built as an Expo mobile application with a custom Express and SQLite backend. It is not just a UI concept. The current version already supports real authentication, calendars, tasks, events, reminders, friend connections, and sharing flows backed by a database.

## 2. Problem We Chose To Solve

Traditional calendar and task apps often assume that users can:

- hold multiple pending tasks in working memory
- estimate time consistently
- notice deadlines early enough
- maintain routines without friction
- switch smoothly between solo and shared planning

For many ADHD users, this is exactly where planning breaks down.

The problem is not a lack of motivation. It is often a mismatch between standard productivity tools and how attention, time perception, and executive function work in real life.

## 3. Our Product Goal

Our goal is to build a planner that helps users:

- capture tasks quickly before they are forgotten
- see what matters right now
- sort work into mentally lighter buckets
- use reminders in a way that supports time blindness
- organize different life areas clearly
- collaborate with friends without cluttering the main experience

We want the app to feel supportive and forgiving rather than demanding.

## 4. Core Product Ideas

### ADHD-first prioritization

Instead of showing only a long chronological list, the app surfaces work through more useful buckets:

- Today
- Next up
- Overdue
- Easy wins
- Shared items

This helps users answer a practical question quickly:

What is the best next thing to focus on?

### Quick capture

Many users lose tasks before they can fully organize them. We support fast entry for tasks and events so that planning starts with capture, not friction.

### Calendar structure without overload

Users can create multiple calendars for different life areas such as:

- school
- work
- personal
- health
- routines

The monthly calendar view is kept lightweight, while heavier management flows are placed on dedicated pages.

### Collaboration

Users can:

- add friends
- share full calendars
- share single items or events
- choose view/edit permissions
- place directly shared items into a recipient-specific calendar

That last detail is especially important because it allows collaboration without breaking each person’s own organizational system.

## 5. Current Technical Implementation

### Frontend

- Expo SDK 54
- React 19
- React Native 0.81
- Expo Router 6
- TypeScript

### Backend

- Express 5
- Knex 3
- better-sqlite3
- JWT-based authentication
- SQLite database

### Current backend-supported features

- register and login
- persistent session restore
- logout
- create and edit calendars
- create and edit tasks/events
- reminders stored in the database
- friend connections
- calendar sharing
- direct item sharing
- recipient-specific filing for directly shared items

## 6. Data Model Highlights

Main tables currently in use:

- `users`
- `friends`
- `calendars`
- `calendar_users`
- `planner_items`
- `item_reminders`
- `item_shares`

This means the application logic is database-backed rather than mock-driven.

## 7. Why This Project Matters Educationally

This project was a strong learning opportunity because it combines:

- product design for a real user problem
- mobile frontend development
- API development
- authentication and session management
- database design
- collaboration features and permissions
- UX decisions shaped by accessibility and neurodivergent needs

It also pushed us to think beyond “feature building” into:

- user psychology
- information hierarchy
- trust and collaboration
- reducing cognitive load

## 8. What We Learned

Some of the most important lessons from this project:

- simple features become much more valuable when the UX reduces friction
- collaboration is not just sharing data; it is respecting different users’ organizational contexts
- ADHD-friendly design requires more than bright colors or reminders
- architecture matters early when the app includes auth, sharing, and multiple user roles
- a useful MVP needs real end-to-end flows, not just attractive screens

## 9. Current State Of The MVP

The current MVP demonstrates:

- a working login/register flow
- a live dashboard for task grouping
- a calendar grid with agenda behavior
- dedicated management screens for capture, calendars, and friends
- end-to-end friend and sharing flows
- real database persistence

The app is already strong enough to discuss as both a technical and product project.

## 10. Future Improvements

Planned next directions include:

- real device notifications
- better recurrence editing
- richer accessibility tuning
- analytics for reminder effectiveness
- friend requests or invite acceptance flow
- stronger automated testing
- more refined onboarding for ADHD and student use cases

## 11. Suggested Demo Flow

If we present the project live, a strong short demo would be:

1. Register or log in
2. Show the Focus dashboard
3. Create a task or event
4. Show how it appears in the calendar
5. Add a friend
6. Share a calendar or single event
7. Show how the recipient sees and files the shared item

This sequence demonstrates both the user value and the technical depth.

## 12. Why An Amazon Engineer Might Find This Interesting

This project is a good discussion piece because it touches multiple engineering and product themes that scale well beyond a school project:

- human-centered design
- mobile product architecture
- auth and permissions
- collaboration systems
- practical MVP scoping
- accessibility and inclusive design

It also shows how a small team can take a specific user problem and turn it into a working system with real product decisions behind it.

## 13. Short Summary

Tism Calendar is an ADHD-first planning app that helps users capture, prioritize, organize, and share tasks and events in a way that reduces overwhelm. It combines thoughtful UX with a real full-stack implementation and reflects both technical growth and product thinking.
