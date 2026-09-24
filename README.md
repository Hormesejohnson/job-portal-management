# Hormese JobPortal

A production-style React job portal with separate admin and user experiences, Redux Toolkit state management, mock API simulation, protected routing, responsive UI, and full CRUD flow for jobs.

## Overview

This project demonstrates a complete frontend architecture for a job portal with two core experiences:

- Admin portal for managing jobs and dashboard analytics
- User portal for browsing, searching, applying, and viewing applied jobs

The application uses a mock data layer and Redux thunks to simulate an API workflow while keeping the UI decoupled from data storage logic.

## Features

- Separate admin and user portals
- Redux Toolkit state management for auth, jobs, filters, and applications
- Protected routes for admin and user flows
- Job CRUD workflow through Redux thunks
- Search, filtering, sorting, and pagination
- User authentication with localStorage persistence
- Admin dashboard with KPI cards and recent jobs
- User landing page, job listing, detail page, and applied jobs page
- Loading, empty, and error states
- Responsive layout for mobile, tablet, and desktop
- Job form validation using React Hook Form + Yup
- Mock service layer using localStorage and simulated latency

## Tech Stack

- React.js
- React Router
- Redux Toolkit
- React Redux
- Axios
- Tailwind CSS
- React Hook Form
- Yup
- Lucide React

## Project Structure

```text
src/
├── app/
│   ├── store.js
│
├── components/
│   ├── auth/
│   ├── common/
│   ├── jobs/
│   └── layout/
├── features/
│   ├── applications/
│   ├── auth/
│   ├── filters/
│   └── jobs/
├── mock/
│   ├── seedData.js
├── pages/
│   ├── admin/
│   ├── user/
│   └── NotFound.jsx
├── routes/
│   └── ProtectedRoute.jsx
├── services/
│   ├── api.js
│   ├── authApi.js
│   └── jobsApi.js
├── utils/
│   └── delay.js
├── App.jsx
├── index.css
└── main.jsx
```

## Installation

```bash
npm install
```

## Run the App

```bash
npm run dev
```

Then open the local Vite URL displayed in the terminal.

## Dummy Credentials

Admin:
- Username: admin
- Password: admin123

User:
- Username: user
- Password: user123

## Architecture Notes

### Redux architecture

The app uses Redux Toolkit slices to centralize data access and update flow:

- auth: stores current user, token, auth status, and errors
- jobs: stores job list, selected job, loading states, and CRUD lifecycle
- applications: tracks applied jobs and duplicate prevention
- filters: stores search, category, pagination, and sorting values

### Mock API layer

The service layer simulates backend behavior with localStorage plus artificial delays. This keeps the UI logic aligned with real-world async patterns without introducing an external backend.

### Routing

Routes are protected with a reusable guard that checks auth state and user role. Unauthenticated users are redirected to the relevant login page, and admins cannot access user-only pages unless they are explicitly allowed.

## Route List

User routes:
- /
- /login
- /jobs
- /jobs/:id
- /applied-jobs

Admin routes:
- /admin/login
- /admin/dashboard
- /admin/jobs
- /admin/jobs/create
- /admin/jobs/:id/edit

## Design Decisions

- Redux acts as the single source of truth for app data
- UI state remains isolated to presentational concerns such as sidebar toggle or password visibility
- Mock API behavior is centralized in service modules
- Components reuse common UI primitives to keep the codebase maintainable

## Future Improvements

- Add real backend integration
- Introduce role-based permission objects for stronger access control
- Add charts and analytics for dashboard reporting
- Add unit and integration tests
- Support drag-and-drop job board workflows

## Notes

This project is intentionally built without a server backend, using mock services and client-side persistence to simulate real CRUD and auth flows.
