<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Omninode Template API

A NestJS-based template management API service for the Omninode platform.

## Description

This service provides a comprehensive template management system with RESTful API endpoints for creating, reading, updating, and deleting template entries. Built with NestJS framework and TypeScript, it includes robust validation, error handling, and comprehensive test coverage.

## Features

- **CRUD Operations**: Full Create, Read, Update, Delete functionality for templates
- **Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Proper HTTP status codes and error responses
- **Pagination**: Support for paginated template retrieval
- **Type Safety**: Full TypeScript support with strict typing
- **Testing**: Comprehensive test suite with unit, integration, and e2e tests

## Project Structure

```
omninode-serverless-template-domain/
├── src/
│   ├── module/
│   │   └── template/
│   │       ├── dto/
│   │       │   ├── input/
│   │       │   │   ├── create-template.dto.ts
│   │       │   │   ├── update-template.dto.ts
│   │       │   │   └── get-template-by-id.dto.ts
│   │       │   └── output/
│   │       │       └── template.dto.ts
│   │       ├── template.controller.ts
│   │       ├── template.service.ts
│   │       └── template.module.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── e2e/template/template.e2e.spec.ts
│   ├── integration/template/template.integration.spec.ts
│   ├── unit/template/
│   │   ├── dto/
│   │   │   ├── input/
│   │   │   └── output/
│   │   ├── template.controller.unit.spec.ts
│   │   ├── template.service.unit.spec.ts
│   │   └── template.module.unit.spec.ts
│   ├── jest-e2e.json
│   ├── jest-integration.json
│   ├── jest-unit.json
│   └── README.md
├── jest.setup.js
└── package.json
```

## API Endpoints

### Template Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/templates` | Get paginated list of templates |
| GET | `/templates/count` | Get total count of templates |
| GET | `/templates/:id` | Get template by ID |
| POST | `/templates` | Create new template |
| PUT | `/templates/:id` | Update existing template |
| DELETE | `/templates/:id` | Delete template |

### Request/Response Examples

#### Create Template
```bash
POST /templates
Content-Type: application/json

{
  "name": "Sample Template",
  "email": "template@example.com",
  "birthDate": "1990-01-01"
}
```

#### Get Templates (Paginated)
```bash
GET /templates?page=1&pageSize=10&sortBy=createdAt&sortOrder=desc
```

#### Update Template
```bash
PUT /templates/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "name": "Updated Template Name",
  "email": "updated@example.com"
}
```

## Project Setup

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Environment variables configured

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Required environment variables (see `jest.setup.js` for test environment):

```bash
STAGE=development
NODE_ENV=development
PORT=3000
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=template_db
DB_USER=user
DB_PASSWORD=password
```

## Development

### Running the Application

```bash
# Development mode
pnpm start:dev

# Production mode
pnpm start:prod

# Debug mode
pnpm start:debug
```

### Building the Project

```bash
# Build the project
pnpm build

# Run built application
pnpm start:prod
```

## Testing

This project includes a comprehensive test suite organized by test type:

### Test Structure

- **Unit Tests**: Test individual functions and classes in isolation
- **Integration Tests**: Test component interactions and data flow
- **E2E Tests**: Test complete API endpoints and HTTP responses

### Running Tests

```bash
# Run all tests (unit + integration + e2e)
pnpm test

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

### Test Coverage

- **Unit Tests**: 120 tests (7 test suites)
- **Integration Tests**: 10 tests (1 test suite)
- **E2E Tests**: 25 tests (1 test suite)
- **Total**: 155 tests passing

For detailed test documentation, see [test/README.md](test/README.md).

## Code Quality

### Linting and Formatting

```bash
# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

### Type Checking

```bash
# Check TypeScript types
pnpm build
```

## Deployment

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start:prod
```

### Docker (if applicable)

```bash
# Build Docker image
docker build -t omninode-template-api .

# Run Docker container
docker run -p 3000:3000 omninode-template-api
```

## Dependencies

### Core Dependencies

- **@nestjs/common**: NestJS core framework
- **@nestjs/core**: NestJS core functionality
- **@nestjs/platform-express**: Express platform integration
- **class-validator**: Input validation
- **class-transformer**: Object transformation
- **@scaleits-solutions-gmbh/org-lib-backend-common-kit**: Common backend utilities
- **@scaleits-solutions-gmbh/omninode-lib-database-drizzle**: Database access layer
- **@scaleits-solutions-gmbh/org-lib-global-common-kit**: Global common utilities

### Development Dependencies

- **@nestjs/testing**: Testing utilities
- **jest**: Testing framework
- **supertest**: HTTP testing
- **typescript**: TypeScript compiler
- **eslint**: Code linting
- **prettier**: Code formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Workflow

1. **During Development**: Use `pnpm test:unit` for quick feedback
2. **Before Committing**: Run `pnpm test` to ensure all tests pass
3. **Code Review**: Ensure linting passes with `pnpm lint`

## License

This project is licensed under the MIT License.

## Support

For questions and support, please contact the development team or create an issue in the repository.
