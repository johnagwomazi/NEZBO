# Nobzo Lite

Nobzo Lite lets users browse property listings, search by title or location, filter by rent or sale, view rich property details, like listings, and leave comments. It also includes a lightweight admin dashboard for reviewing platform activity and deleting properties.

## Live Demo

`https://nezbolite-sigma.vercel.app/`

## Repository

`https://github.com/johnagwomazi/NEZBO`

## Features

### Authentication

- Mock login functionality
- Protected routes
- User session persistence using Zustand and localStorage

### Property Feed

- View all available property listings
- Search properties by title or location
- Filter properties by Rent or Sale
- Responsive card-based layout

### Property Details

- Detailed property information
- Like and unlike properties
- View total likes
- Add comments directly on the page
- View existing comments
- Contact agent action from the detail view

### Admin Dashboard

- Overview cards for properties, users, comments, and likes
- Property management actions
- Delete property support with cascading removal of related comments and likes
- Responsive admin layout for mobile and desktop

### State Management

- Global state management with Zustand
- Centralized handling of:
  - User authentication
  - Property data
  - Likes
  - Comments
  - Loading states

### Data Persistence

- Mock data sourced from `src/data/db.json`
- Local API writes likes, comments, and property deletions back to `db.json`
- Optimistic UI updates for a faster experience

### User Experience

- Responsive design for mobile, tablet, and desktop
- Skeleton loading states
- Empty states
- Clean and accessible UI

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Zustand
- React Router DOM
- Lucide React

## Project Structure

```text
src/
├── components/
├── pages/
├── services/
├── store/
├── types/
├── data/
├── main.tsx
└── App.tsx
server/
scripts/
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd nobzo-lite
```

Install dependencies:

```bash
npm install
```

Start the development environment:

```bash
npm run dev
```

This starts the Vite client and the local API server together.

## Available Scripts

Run the development environment:

```bash
npm run dev
```

Build the production version:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Design Decisions

### Zustand

Zustand was selected because it provides a lightweight and simple approach to global state management without the boilerplate associated with larger state management libraries.

### Local API Persistence

A small Node-based API is used during development so likes, comments, and property deletion can persist into `src/data/db.json`.

### Skeleton Loading States

Skeleton components were used instead of traditional loading spinners to provide a smoother user experience and reduce perceived loading times.

### Responsive Design

The interface was designed with a mobile-first approach and optimized for different screen sizes using Tailwind CSS responsive utilities.

## Assumptions

- Authentication is mocked for demonstration purposes.
- Any valid email and password combination can be used to access the application.
- Property data is stored in `src/data/db.json`.
- Likes and comments are persisted through the local API when the app is running in development mode.

## Future Improvements

- Real backend integration
- Real authentication and authorization
- Editable property forms for the admin dashboard
- Property image galleries
- User profiles
- Favorites page
- Advanced property filtering
- Pagination and infinite scrolling
- Property booking and inquiry workflows

## Assessment Requirements Covered

- React
- TypeScript
- React Router
- Zustand state management
- Responsive design
- Property listing page
- Property detail page
- Authentication flow
- Protected routes
- Comments functionality
- Likes functionality
- Admin dashboard
- Loading states

## Author

Agwom Azi John

Frontend Developer
