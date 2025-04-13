# Changelog

## [Unreleased] - TypeScript Error Fixes

### Fixed
- ILPStatus config in ILPManagement.tsx now includes the missing 'paused' status
- Updated React Query API usage from 'cacheTime' to 'gcTime' across the codebase to match latest API
- Fixed MediaFile import inconsistencies, standardizing import paths
- Improved Firebase collection typing for better type safety
- Fixed Question object type conversion issues, properly handling ID type conversion
- Added missing analyzer modules (bestPractices, accessibility, maintenance)

### Added
- Type-safe Firebase utilities in src/lib/firebase/utils.ts
  - getTypedCollection - for safe collection fetching
  - getTypedDoc - for safe document fetching 
  - convertToTypedDoc - for safe document data conversion
- Type converters for data models in src/utils/typeConverters.ts
  - Properly handles data conversion for Question, MediaFile, and ILP types
  - Handles type mismatches between Firestore and application models
- Standardized query options in src/lib/queryUtils.ts
  - DEFAULT_QUERY_OPTIONS - standard caching settings
  - LONG_LIVED_QUERY_OPTIONS - for infrequently changing data
  - REAL_TIME_QUERY_OPTIONS - for frequently changing data
- Enhanced type definitions for analyzer services

### Future Work
- Complete implementation of type-safe Firebase utilities for all hooks
- Implement Zod schema validation for runtime type checking
- Gradually enable stricter TypeScript compiler options
- Add unit tests for critical data conversion functions
- Complete the analyzer implementation with real functionality

## [1.0.0] - Initial Release
- Initial implementation of ILP feature
- Quiz and Memory game integration
- PDF report generation
- Progress tracking visualization 