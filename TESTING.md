# Portfolio Test Suite

This document describes the comprehensive test coverage for the portfolio application, covering both client-side (React) and server-side (Go) components.

## 🏗️ Test Architecture

### Client Tests (React/JavaScript)

- **Testing Framework**: Jest + React Testing Library
- **Location**: `client/src/__tests__/`
- **Coverage**: Components, Services, Utilities, Hooks

### Server Tests (Go)

- **Testing Framework**: Go testing package + testify
- **Location**: `server/**/*_test.go`
- **Coverage**: Controllers, Services, Models

## 🧪 Test Categories

### Client-Side Tests

#### 1. Service Tests

- **ApiService**: HTTP client functionality, interceptors, error handling
- **AuthService**: Authentication, token management
- **ProjectService**: Project CRUD operations with filters
- **SkillService**: Skills management with search and categories

#### 2. Component Tests

- **ContactForm**: Form validation, submission, error states
- **ErrorBoundary**: Error catching, fallback UI, logging
- **Navigation Components**: Home, Contact, Projects, Footer, Navbar, ThemeToggle

#### 3. Utility Tests

- **helpers.js**: Date formatting, validation, string manipulation, debouncing

#### 4. Hook Tests

- **useApiData**: Data fetching, loading states, error handling
- **useProjects**: Project-specific data fetching
- **useSkills**: Skills-specific data fetching
- **useAsyncOperation**: Async operations with loading/error states

### Server-Side Tests

#### 1. Controller Tests

- **Skills Controller**: GET endpoints, filtering, pagination
- **Project Controller**: CRUD operations, validation
- **Auth Controller**: Login, user creation, JWT handling

#### 2. Model Tests

- **User Model**: Authentication, validation
- **Project Model**: CRUD operations, relationships
- **Skill Model**: Categories, search functionality
- **Contact Model**: Form submissions
- **Blog Model**: Content management

#### 3. Service Tests

- **Project Service**: Business logic, data transformation
- **Contact Service**: Email handling, validation

## 🚀 Running Tests

### All Tests

```bash
# Run complete test suite
./run-tests.sh
```

### Client Tests Only

```bash
cd client

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run in CI mode
npm run test:ci
```

### Server Tests Only

```bash
cd server

# Run all tests
go test -v ./...

# Run with coverage
go test -v -cover ./...

# Run with race condition detection
npm run test:race
```

## 📊 Coverage Requirements

### Client Coverage Targets

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Server Coverage

- Comprehensive unit tests for all public functions
- Integration tests for HTTP endpoints
- Database operation testing with in-memory SQLite

## 🔧 Test Configuration

### Client Configuration

- **Jest Config**: `client/jest.config.json`
- **Setup File**: `client/src/setupTests.js`
- **Environment**: jsdom for DOM testing

### Server Configuration

- **Go Modules**: Dependencies managed in `go.mod`
- **Test Database**: In-memory SQLite for isolation
- **Mocking**: testify/mock for dependency injection

## 📝 Test Patterns

### Client Test Patterns

1. **Component Testing**: Render → Interact → Assert
2. **Service Testing**: Mock HTTP → Call → Verify
3. **Hook Testing**: renderHook → Act → Assert state
4. **Error Testing**: Trigger error → Verify handling

### Server Test Patterns

1. **Handler Testing**: Setup → Request → Response verification
2. **Service Testing**: Mock DB → Call → Assert business logic
3. **Model Testing**: Create → Validate → Query verification

## 🛠️ Test Utilities

### Client Utilities

- **Mock Services**: Consistent mocking patterns
- **Test Helpers**: Common setup functions
- **Custom Matchers**: Domain-specific assertions

### Server Utilities

- **Test Database**: Isolated in-memory database per test
- **Mock Services**: Interface-based mocking
- **Test Fixtures**: Reusable test data

## 🔍 Debugging Tests

### Client Debugging

```bash
# Run specific test file
npm test -- ContactForm.test.js

# Run in watch mode
npm test -- --watch

# Debug with verbose output
npm test -- --verbose
```

### Server Debugging

```bash
# Run specific package tests
go test -v ./controllers

# Run with detailed output
go test -v -run TestSpecificFunction

# Debug with race detection
go test -v -race ./...
```

## 📈 Continuous Integration

The test suite is designed to run in CI environments with:

- **Fast execution**: Parallel test running
- **Comprehensive coverage**: Both unit and integration tests
- **Clear reporting**: Detailed test results and coverage reports
- **Fail-fast**: Immediate feedback on test failures

## 🎯 Best Practices

### Writing Tests

1. **Descriptive Names**: Clear test descriptions
2. **Arrange-Act-Assert**: Consistent test structure
3. **Isolation**: Independent, repeatable tests
4. **Edge Cases**: Test error conditions and boundaries

### Maintaining Tests

1. **Keep Updated**: Tests evolve with code
2. **Refactor Together**: Update tests with code changes
3. **Document Complex Cases**: Explain non-obvious test scenarios
4. **Monitor Coverage**: Maintain quality thresholds

## 🚨 Common Issues

### Client Test Issues

- **Async Operations**: Use `waitFor` for async updates
- **Component Lifecycle**: Proper cleanup in tests
- **Mock Management**: Clear mocks between tests

### Server Test Issues

- **Database State**: Clean database between tests
- **Concurrent Access**: Avoid shared state in parallel tests
- **HTTP Testing**: Proper request/response setup

---

For questions or issues with the test suite, please refer to the individual test files or create an issue in the repository.
