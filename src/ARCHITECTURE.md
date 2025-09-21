# News Service Architecture

This document outlines the refactored, clean separation of concerns for the news service.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│ NewsCard.jsx (Pure UI)  │  Location1Card.jsx (Container)    │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│ useNews.js (Hook)       │  NewsContext.jsx (Global State)   │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer                             │
├─────────────────────────────────────────────────────────────┤
│ NewsRepository.js (Data Access + Caching)                   │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                 Infrastructure Layer                        │
├─────────────────────────────────────────────────────────────┤
│ NewsApiClient.js │ FallbackDataProvider.js │ Factory.js     │
└─────────────────────────────────────────────────────────────┘
```

## Separation of Concerns

### 1. **Presentation Layer**
- **NewsCard.jsx**: Pure presentational component
- **Location1Card.jsx**: Container component that connects data to UI
- **Responsibility**: UI rendering and user interactions only

### 2. **Application Layer**
- **useNews.js**: React hook for component-level state
- **NewsContext.jsx**: Global state management with React Context
- **Responsibility**: Application state, React-specific logic

### 3. **Domain Layer**
- **NewsRepository.js**: Core business logic, caching, data access patterns
- **Responsibility**: Domain rules, caching strategy, data transformation

### 4. **Infrastructure Layer**
- **NewsApiClient.js**: HTTP client, network communication
- **FallbackDataProvider.js**: Static data provision
- **NewsServiceFactory.js**: Dependency injection, configuration
- **Responsibility**: External dependencies, configuration, data sources

## Benefits of This Architecture

### ✅ **Single Responsibility Principle**
Each class/module has one reason to change:
- API changes → only affect NewsApiClient
- Caching logic → only affect NewsRepository  
- UI changes → only affect NewsCard
- Business rules → only affect Repository/Context

### ✅ **Dependency Inversion**
High-level modules don't depend on low-level modules:
- NewsRepository depends on abstractions (ApiClient interface)
- Components depend on hooks, not direct API calls
- Easy to swap implementations (mock data, different APIs)

### ✅ **Open/Closed Principle**
Easy to extend without modifying existing code:
- Add new data sources via new ApiClient implementations
- Add new caching strategies via Repository patterns
- Add new UI variations via NewsCard props

### ✅ **Testability**
Each layer can be tested in isolation:
- Mock ApiClient for Repository tests
- Mock Repository for Hook tests
- Mock hooks for Component tests

### ✅ **Configurability**
Environment-specific behavior:
- Different base URLs per environment
- Different caching strategies
- Easy feature flags

## Usage Examples

### Basic Usage (Simple)
```jsx
// In a component
const { news, loading, error } = useNews('production', 3);
```

### Advanced Usage (Full Control)
```jsx
// In App.jsx
<NewsProvider environment="production">
  <YourApp />
</NewsProvider>

// In a component
const { 
  news, 
  loading, 
  error, 
  isOnline, 
  refresh 
} = useNews('location', 1);
```

### Testing
```jsx
// Easy to test with different configurations
<NewsProvider environment="testing">
  <ComponentUnderTest />
</NewsProvider>
```

## Migration Path

1. **Phase 1**: Add NewsProvider to App.jsx
2. **Phase 2**: Update one card to use new architecture
3. **Phase 3**: Migrate remaining cards
4. **Phase 4**: Remove old newsService.js
5. **Phase 5**: Add advanced features (offline support, etc.)

This architecture scales well as your application grows and makes testing, debugging, and maintenance much easier.
