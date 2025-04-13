# Project Overview

This document provides a high-level visualization and summary of the codebase structure for the current project. The project appears to be an educational or therapeutic application with a focus on individual learning plans (ILP), augmentative and alternative communication (AAC), quizzes, and gamification features.

## Core Structure

- **Root Directory**: Contains configuration files for Vite, TypeScript, ESLint, Tailwind CSS, and Docker, indicating a modern React-based web application.
  - Key files: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`

- **Source Code (`src/`)**: Main directory for application code.
  - **Components (`src/components/`)**: Reusable UI elements.
    - Notable components: `Header`, `ILPDashboard`, `StandaloneAAC`, `GamificationDashboard`, `QuizGame`
    - Subdirectories for specific features like `AAC/`, `ILP/`, and `Form/`
  - **Pages (`src/pages/`)**: Top-level page components for routing.
    - Key pages: `Home.tsx`, `ILP.tsx`, `Quiz.tsx`, `ILPManagement.tsx`
  - **Hooks (`src/hooks/`)**: Custom React hooks for state and logic management.
    - Examples: `useILPActivityIntegration.ts`, `useAuth.ts`, `useGamification.ts`
  - **Services (`src/services/`)**: Business logic and data handling.
    - Notable services: `PDFExportService.ts`, `ILPProgressService.ts`
  - **Context (`src/context/`)**: React context for state management.
    - Key contexts: `ILPContext.tsx`, `AuthContext.tsx`
  - **Types (`src/types/`)**: TypeScript type definitions.
    - Key type files: `ilp.ts`, `quiz.ts`
  - **Routes (`src/routes/`)**: Routing configuration.
    - Example: `AdminRoutes.tsx`
  - **Utils (`src/utils/`)**: Utility functions.
    - Example: `validation.ts`

- **Public Assets (`public/`)**: Static files and assets.
  - Includes `ilp-test.html` and symbol SVGs for AAC features.

## Key Features

1. **Individual Learning Plan (ILP)**: Components and services for managing personalized learning plans, with dashboards, progress charts, and PDF export capabilities.
2. **Augmentative and Alternative Communication (AAC)**: Tools for communication support, including boards and icons.
3. **Quizzes and Games**: Interactive learning through quizzes with progress tracking and completion states.
4. **Gamification**: Features like achievement badges, level progress, and daily streaks to engage users.
5. **Admin and Analytics**: Administrative routes and dashboards for monitoring usage and progress.

## Summary

The project is a comprehensive web application built with React and TypeScript, utilizing modern frameworks like Tailwind CSS for styling. It focuses on educational support with specialized features for ILP and AAC, integrated with gamification to enhance user engagement. This overview serves as a starting point for understanding the codebase structure and key functionalities.
