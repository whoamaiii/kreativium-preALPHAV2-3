# Features Directory

This directory contains the modular features added to the application:

- **ILP (Individual Learning Plan)**: Manage learning plans and goals
- **AAC (Augmentative and Alternative Communication)**: Communication boards and symbols
- **Games**: Quiz and Memory games
- **Gamification**: XP, levels, and badges system
- **Feelings**: Mood/feelings tracking system

## Structure

Each feature follows a similar structure:

```
features/
├── [feature-name]/
│   ├── components/ - UI components specific to the feature
│   ├── hooks/ - Custom React hooks
│   ├── pages/ - Full page components
│   ├── services/ - API/data interaction services
│   ├── types.ts - TypeScript types/interfaces
```

## Integration with Existing Project

These features integrate with the existing application:

1. **Authentication**: All services utilize the existing authentication mechanism
2. **Routing**: New routes have been added to match existing routing structure
3. **API**: Services are designed to work with the backend API
4. **UI**: Components follow the existing design patterns and use Tailwind CSS

## Path Aliases

For convenience, path aliases have been configured in both `vite.config.ts` and `tsconfig.json`:

```
@features/* -> src/features/*
@ilp/* -> src/features/ilp/*
@aac/* -> src/features/aac/*
@games/* -> src/features/games/*
@gamification/* -> src/features/gamification/*
@feelings/* -> src/features/feelings/*
```

## Dependencies

The following dependencies have been added/verified:

- framer-motion (for animations)
- zod (for validation)
- @react-pdf/renderer (for PDF generation)
- i18next and react-i18next (for internationalization)
- tailwindcss, postcss, autoprefixer (for styling)
- vitest and testing-library packages (for testing)

## Getting Started

To implement UI components for each feature:

1. Create components in the respective feature's `components/` directory
2. Create pages in the feature's `pages/` directory
3. Use the services from the `services/` directory to interact with the backend
4. Implement feature-specific logic in custom hooks 