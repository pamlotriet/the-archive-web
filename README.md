# The Archive

The Archive is a personal media tracker for keeping books, movies, series, games, music, podcasts, and audiobooks in one place. It provides tools for organizing a library, recording reading and listening activity, saving notes and quotes, and reviewing progress through a dashboard and statistics.

## Features

- Email-based authentication backed by Firebase
- A searchable media library with progress, status, ratings, and cover images
- Collections and tags for organizing entries
- Notes and quotes linked to your archive
- Reading and listening logs, including pages and time spent
- Dashboard and statistics views for activity, completion, ratings, and media types
- Responsive light and dark themes
- Internationalization support through JSON translation files

## Tech stack

- [Angular 21](https://angular.dev/) with standalone components and lazy-loaded routes
- [NgRx](https://ngrx.io/) for state management and effects
- [Firebase](https://firebase.google.com/) Authentication and Cloud Firestore
- [PrimeNG](https://primeng.org/) and [Tailwind CSS](https://tailwindcss.com/) for the interface
- [ngx-translate](https://github.com/ngx-translate/core) for localization
- [Vitest](https://vitest.dev/) for unit tests

## Getting started

### Prerequisites

- Node.js supported by Angular 21
- npm
- A Firebase project with Authentication and Cloud Firestore enabled

### Installation

Clone the repository and install its dependencies:

```bash
npm install
```

Update the Firebase configuration in both environment files with the web app configuration from your Firebase project:

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

Then start the development server:

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200). The development server reloads automatically when source files change.

## Available scripts

| Command                          | Description                                           |
| -------------------------------- | ----------------------------------------------------- |
| `npm start`                      | Start the Angular development server                  |
| `npm run build`                  | Create an optimized production build in `dist/`       |
| `npm run watch`                  | Build continuously with the development configuration |
| `npm test`                       | Run the Vitest unit test suite                        |
| `npm run prettier`               | Format the project with Prettier                      |
| `npm run create:store -- <name>` | Generate NgRx store files in the current directory    |

## Project structure

```text
src/
├── app/
│   ├── core/          # Guards, Firebase setup, and development scripts
│   ├── features/      # Feature pages, components, types, and NgRx state
│   └── shared/        # Reusable UI components, types, and utilities
├── environments/     # Development and production configuration
└── styles.css         # Global styles and Tailwind theme
public/
└── assets/
    ├── i18n/          # Translation files
    └── images/        # Static image assets
```

Feature routes are defined in `src/app/app.routes.ts`. Authenticated areas are protected by `AuthGuard`, while feature data is loaded from Firestore through NgRx effects and services.

## Localization

English translations live in `public/assets/i18n/en.json`. Add another JSON file in the same directory and register its language through the translation service to support an additional locale.

## Building for production

```bash
npm run build
```

Angular writes the production artifacts to `dist/`. Deploy those files to a static host configured to fall back to `index.html` for client-side routes.
