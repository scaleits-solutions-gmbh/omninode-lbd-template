# Test Organization

This directory contains all tests for the template API, organized by test type and module.

## 📁 Directory Structure

```
test/
├── e2e/                          # End-to-end tests
│   └── template/
│       └── template.e2e.spec.ts
├── integration/                   # Integration tests
│   └── template/
│       └── template.integration.spec.ts
├── unit/                         # Unit tests
│   └── template/
│       ├── template.controller.unit.spec.ts
│       ├── template.service.unit.spec.ts
│       ├── template.module.unit.spec.ts
│       └── dto/                  # DTO validation tests
│           ├── input/
│           │   ├── create-template.dto.unit.spec.ts
│           │   ├── update-template.dto.unit.spec.ts
│           │   └── get-template-by-id.dto.unit.spec.ts
│           └── output/
│               └── template.dto.unit.spec.ts
├── jest-e2e.json                 # Jest config for e2e tests
├── jest-integration.json         # Jest config for integration tests
├── jest-unit.json               # Jest config for unit tests
└── README.md                    # This file
```

## 🧪 Test Types

### **Unit Tests** (`test/unit/`)
- **Purpose**: Test individual functions and classes in isolation
- **Scope**: Single module/class with mocked dependencies
- **Speed**: Fastest execution
- **Coverage**: Business logic, edge cases, error handling

### **Integration Tests** (`test/integration/`)
- **Purpose**: Test interactions between multiple components
- **Scope**: Service layer with mocked external dependencies (DAO, external APIs)
- **Speed**: Medium execution time
- **Coverage**: Component interactions, data flow, error propagation

### **End-to-End Tests** (`test/e2e/`)
- **Purpose**: Test the complete application from HTTP request to response
- **Scope**: Full application stack with mocked database layer
- **Speed**: Slowest execution
- **Coverage**: API endpoints, HTTP status codes, request/response validation

## 🚀 Running Tests

### Available Commands

```bash
# Default test command (all tests)
pnpm test                  # All tests (unit + integration + e2e)

# Run specific test types
pnpm test:unit              # Unit tests only
pnpm test:integration       # Integration tests only
pnpm test:e2e              # E2E tests only

# Run with watch mode
pnpm test:watch            # Unit tests with watch
pnpm test:all:watch        # All tests with watch (parallel)

# Run with coverage
pnpm test:cov              # Unit tests with coverage
```

### When to Use Each Command

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `pnpm test` | **All test types** | Full test suite, before deployment, CI/CD |
| `pnpm test:unit` | Unit tests only | Quick development, debugging |
| `pnpm test:integration` | Integration tests only | Testing service-DAO interactions |
| `pnpm test:e2e` | E2E tests only | Testing full API endpoints |
| `pnpm test:watch` | Unit tests in watch mode | Development with auto-rerun |
| `pnpm test:cov` | Unit tests with coverage | Code coverage analysis |

### **Typical Development Workflow:**

1. **During Development:** `pnpm test:unit` (unit tests only - fast feedback)
2. **Before Committing:** `pnpm test` (all tests - ensure nothing breaks)
3. **CI/CD Pipeline:** `pnpm test` (all tests)
4. **Code Coverage:** `pnpm test:cov` (unit test coverage)

### Individual Test Files

```bash
# Run specific test files
pnpm test:unit test/unit/template/template.service.unit.spec.ts
pnpm test:integration test/integration/template/template.integration.spec.ts
pnpm test:e2e test/e2e/template/template.e2e.spec.ts
```

## 📋 Test Coverage

### **Unit Tests Coverage**
- **DTOs**: Input validation, output parsing, error handling
- **Services**: Business logic, error handling, data transformation
- **Controllers**: Request/response handling, validation, error scenarios
- **Modules**: Dependency injection, module configuration

### **Integration Tests Coverage**
- **Service-DAO Interactions**: Real database operations
- **Data Flow**: End-to-end data processing
- **Error Scenarios**: Database errors, validation failures
- **Performance**: Bulk operations, pagination

### **E2E Tests Coverage**
- **API Endpoints**: All HTTP methods (GET, POST, PUT, DELETE)
- **Request Validation**: Invalid data handling
- **Response Formats**: JSON structure, status codes
- **Error Handling**: 400, 404, 500 status codes
- **CRUD Workflows**: Complete create-read-update-delete cycles

## 🔧 Test Configuration

### **Jest Configuration Files**
- `jest-unit.json`: Unit tests with heavy mocking
- `jest-integration.json`: Integration tests with database connections
- `jest-e2e.json`: E2E tests with full application stack

### **Environment Setup**
- **Unit Tests**: Mocked dependencies, fast execution
- **Integration Tests**: Real database, medium execution
- **E2E Tests**: Full application, slow execution

## 📊 Test Metrics

### **Coverage Targets**
- **Unit Tests**: >90% line coverage
- **Integration Tests**: >80% branch coverage
- **E2E Tests**: 100% endpoint coverage

### **Performance Targets**
- **Unit Tests**: <5 seconds total
- **Integration Tests**: <30 seconds total
- **E2E Tests**: <60 seconds total

## 🐛 Debugging Tests

### **Common Issues**
1. **Mocking Problems**: Check mock setup in `beforeEach`
2. **Database Issues**: Verify test database configuration
3. **Validation Errors**: Check DTO validation rules
4. **Async Issues**: Ensure proper `async/await` usage

### **Debug Commands**
```bash
# Debug specific test
pnpm test:unit --testNamePattern="should create template"

# Run with verbose output
pnpm test:unit --verbose

# Run single test file with debugging
pnpm test:unit test/unit/template/template.service.unit.spec.ts --verbose
```

## 📝 Best Practices

### **Test Writing**
1. **Descriptive Names**: Use clear, descriptive test names
2. **Single Responsibility**: Each test should test one thing
3. **Proper Setup**: Use `beforeEach` for common setup
4. **Clean Teardown**: Clean up after tests
5. **Mock External Dependencies**: Don't rely on external services

### **Test Organization**
1. **Group Related Tests**: Use `describe` blocks effectively
2. **Consistent Structure**: Follow the same pattern across all tests
3. **Helper Functions**: Extract common test utilities
4. **Clear Assertions**: Make assertions specific and clear

### **Maintenance**
1. **Keep Tests Updated**: Update tests when code changes
2. **Remove Dead Tests**: Delete tests for removed functionality
3. **Monitor Performance**: Keep test execution fast
4. **Review Coverage**: Ensure adequate test coverage 