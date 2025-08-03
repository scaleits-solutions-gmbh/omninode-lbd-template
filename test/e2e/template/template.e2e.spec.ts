import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TemplateModule } from '../../../src/module/template/template.module';
import { TemplateService } from '../../../src/module/template/template.service';
import { NestJsKit } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

// Mock the DAO classes and their static properties
jest.mock('@scaleits-solutions-gmbh/omninode-lib-database-drizzle', () => ({
  TemplateDao: {
    cruds: {
      getTemplates: {
        fetch: jest.fn(),
        fetchCount: jest.fn(),
        allowedFilterOptions: ['name', 'email'],
        allowedSortOptions: ['createdAt', 'name'],
        maxPageSize: 100,
        defaultParams: {
          paginationOption: {
            page: 1,
            limit: 10,
          },
        },
      },
      getTemplatesCount: {
        fetch: jest.fn(),
      },
      getTemplateById: {
        fetch: jest.fn(),
      },
      createTemplate: {
        create: jest.fn(),
      },
      updateTemplate: {
        update: jest.fn(),
      },
      deleteTemplate: {
        delete: jest.fn(),
      },
    },
  },
}));

describe('TemplateController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let mockTemplateDao: any;

  const mockTemplate = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'E2E Test Template',
    email: 'e2e@test.com',
    birthDate: '1990-01-01',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  const validCreateTemplateDto = {
    name: 'E2E Test Template',
    email: 'e2e@test.com',
    birthDate: '1990-01-01',
  };

  const validUpdateTemplateDto = {
    name: 'Updated E2E Test Template',
    email: 'updated@test.com',
  };

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [TemplateModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Add global validation pipe and exception filter like in main.ts
    app.useGlobalPipes(new NestJsKit.CustomValidationPipe());
    app.useGlobalFilters(new NestJsKit.GlobalExceptionFilter());

    await app.init();

    // Get the mocked DAO
    const {
      TemplateDao,
    } = require('@scaleits-solutions-gmbh/omninode-lib-database-drizzle');
    mockTemplateDao = TemplateDao;
  });

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mock responses
    mockTemplateDao.cruds.getTemplates.fetch.mockResolvedValue([]);
    mockTemplateDao.cruds.getTemplates.fetchCount.mockResolvedValue(0);
    mockTemplateDao.cruds.getTemplatesCount.fetch.mockResolvedValue(0);
    mockTemplateDao.cruds.getTemplateById.fetch.mockResolvedValue(null);
    mockTemplateDao.cruds.createTemplate.create.mockResolvedValue(mockTemplate);
    mockTemplateDao.cruds.updateTemplate.update.mockResolvedValue(mockTemplate);
    mockTemplateDao.cruds.deleteTemplate.delete.mockResolvedValue(mockTemplate);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/templates (GET)', () => {
    it('should return empty array when no templates exist', () => {
      // Mock empty response
      mockTemplateDao.cruds.getTemplates.fetch.mockResolvedValue([]);
      mockTemplateDao.cruds.getTemplates.fetchCount.mockResolvedValue(0);

      return request(app.getHttpServer())
        .get('/templates')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('pageSize');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('totalPages');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data).toHaveLength(0);
        });
    });

    it('should handle pagination parameters', () => {
      // Mock response with data
      const mockTemplates = [mockTemplate];
      mockTemplateDao.cruds.getTemplates.fetch.mockResolvedValue(mockTemplates);
      mockTemplateDao.cruds.getTemplates.fetchCount.mockResolvedValue(1);

      return request(app.getHttpServer())
        .get('/templates?page=1&pageSize=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.page).toBe(1);
          expect(res.body.pageSize).toBe(5);
          expect(res.body.data).toHaveLength(1);
        });
    });

    it('should handle invalid pagination parameters gracefully', async () => {
      // Mock the service to throw a validation error
      const mockService = moduleFixture.get<TemplateService>(TemplateService);
      const mockSpy = jest.spyOn(mockService, 'getTemplates').mockRejectedValue(
        new NestJsKit.NestJsBadRequestException('Validation Failed', [
          {
            message: 'Invalid page parameter',
            code: 'INVALID_PAGE_PARAMETER',
          },
        ]),
      );

      try {
        const response = await request(app.getHttpServer())
          .get('/templates?page=invalid&pageSize=invalid')
          .expect(400);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('Validation Failed');
      } finally {
        mockSpy.mockRestore();
      }
    });
  });

  describe('/templates/count (GET)', () => {
    it('should return templates count', () => {
      // Mock count response
      mockTemplateDao.cruds.getTemplatesCount.fetch.mockResolvedValue(5);

      return request(app.getHttpServer())
        .get('/templates/count')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('count');
          expect(typeof res.body.count).toBe('number');
          expect(res.body.count).toBe(5);
        });
    });
  });

  describe('/templates (POST)', () => {
    it('should create a new template', () => {
      // Mock successful creation
      mockTemplateDao.cruds.createTemplate.create.mockResolvedValue(
        mockTemplate,
      );

      return request(app.getHttpServer())
        .post('/templates')
        .send(validCreateTemplateDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', validCreateTemplateDto.name);
          expect(res.body).toHaveProperty(
            'email',
            validCreateTemplateDto.email,
          );
          expect(res.body).toHaveProperty(
            'birthDate',
            validCreateTemplateDto.birthDate,
          );
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          expect(typeof res.body.id).toBe('string');
          expect(res.body.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
          );
        });
    });

    it('should reject invalid email format', () => {
      const invalidDto = {
        name: 'Invalid Email Template',
        email: 'invalid-email',
        birthDate: '1990-01-01',
      };

      return request(app.getHttpServer())
        .post('/templates')
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Validation Failed');
        });
    });

    it('should reject empty name', () => {
      const invalidDto = {
        name: '',
        email: 'valid@email.com',
        birthDate: '1990-01-01',
      };

      return request(app.getHttpServer())
        .post('/templates')
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Validation Failed');
        });
    });

    it('should reject invalid date format', () => {
      const invalidDto = {
        name: 'Invalid Date Template',
        email: 'valid@email.com',
        birthDate: 'invalid-date',
      };

      return request(app.getHttpServer())
        .post('/templates')
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Validation Failed');
        });
    });

    it('should reject missing required fields', () => {
      const invalidDto = {
        name: 'Missing Fields Template',
        // email missing
        birthDate: '1990-01-01',
      };

      return request(app.getHttpServer())
        .post('/templates')
        .send(invalidDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Validation Failed');
        });
    });
  });

  describe('/templates/:id (GET)', () => {
    it('should return template by ID', () => {
      // Mock successful retrieval
      mockTemplateDao.cruds.getTemplateById.fetch.mockResolvedValue(
        mockTemplate,
      );

      return request(app.getHttpServer())
        .get(`/templates/${mockTemplate.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', mockTemplate.id);
          expect(res.body).toHaveProperty('name', mockTemplate.name);
          expect(res.body).toHaveProperty('email', mockTemplate.email);
          expect(res.body).toHaveProperty('birthDate', mockTemplate.birthDate);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should return 404 for non-existent template', () => {
      const nonExistentId = '2c74ed65-4a90-4a24-893f-e1cc1b826c46';
      // Mock not found
      mockTemplateDao.cruds.getTemplateById.fetch.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get(`/templates/${nonExistentId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Template not found');
        });
    });

    it('should return 400 for invalid UUID format', () => {
      return request(app.getHttpServer())
        .get('/templates/invalid-uuid')
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Validation Failed');
        });
    });
  });

  describe('/templates/:id (PUT)', () => {
    it('should update template successfully', () => {
      // Mock successful update
      const updatedTemplate = { ...mockTemplate, ...validUpdateTemplateDto };
      mockTemplateDao.cruds.updateTemplate.update.mockResolvedValue(
        updatedTemplate,
      );

      return request(app.getHttpServer())
        .put(`/templates/${mockTemplate.id}`)
        .send(validUpdateTemplateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', mockTemplate.id);
          expect(res.body).toHaveProperty('name', validUpdateTemplateDto.name);
          expect(res.body).toHaveProperty(
            'email',
            validUpdateTemplateDto.email,
          );
          expect(res.body).toHaveProperty('birthDate', mockTemplate.birthDate); // Should remain unchanged
        });
    });

    it('should handle partial updates', () => {
      // Mock successful partial update
      const partialUpdateDto = { name: 'Partially Updated Template' };
      const updatedTemplate = { ...mockTemplate, ...partialUpdateDto };
      mockTemplateDao.cruds.updateTemplate.update.mockResolvedValue(
        updatedTemplate,
      );

      return request(app.getHttpServer())
        .put(`/templates/${mockTemplate.id}`)
        .send(partialUpdateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('name', partialUpdateDto.name);
          expect(res.body).toHaveProperty('email', mockTemplate.email); // Should remain unchanged
        });
    });

    it('should return 404 for non-existent template', () => {
      const nonExistentId = 'e5821442-debf-4423-b727-19618ffe895b';
      const updateDto = { name: 'Updated Name' };
      // Mock not found
      mockTemplateDao.cruds.updateTemplate.update.mockResolvedValue(null);

      return request(app.getHttpServer())
        .put(`/templates/${nonExistentId}`)
        .send(updateDto)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Template not found');
        });
    });

    it('should return 400 for invalid UUID format', () => {
      const updateDto = { name: 'Updated Name' };

      return request(app.getHttpServer())
        .put('/templates/invalid-uuid')
        .send(updateDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Validation Failed');
        });
    });

    it('should reject invalid email in update', () => {
      const invalidUpdateDto = { email: 'invalid-email' };

      return request(app.getHttpServer())
        .put(`/templates/${mockTemplate.id}`)
        .send(invalidUpdateDto)
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Validation Failed');
        });
    });
  });

  describe('/templates/:id (DELETE)', () => {
    it('should delete template successfully', () => {
      // Mock successful deletion
      mockTemplateDao.cruds.deleteTemplate.delete.mockResolvedValue(
        mockTemplate,
      );

      return request(app.getHttpServer())
        .delete(`/templates/${mockTemplate.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', mockTemplate.id);
          expect(res.body).toHaveProperty('name', mockTemplate.name);
        });
    });

    it('should return 404 for non-existent template', () => {
      const nonExistentId = '8690b271-5cde-4336-8f36-cdc1408df000';
      // Mock not found
      mockTemplateDao.cruds.deleteTemplate.delete.mockResolvedValue(null);

      return request(app.getHttpServer())
        .delete(`/templates/${nonExistentId}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Template not found');
        });
    });

    it('should return 400 for invalid UUID format', () => {
      return request(app.getHttpServer())
        .delete('/templates/invalid-uuid')
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Validation Failed');
        });
    });

    it('should verify template is actually deleted', async () => {
      // Mock successful deletion
      mockTemplateDao.cruds.deleteTemplate.delete.mockResolvedValue(
        mockTemplate,
      );

      // First delete the template
      await request(app.getHttpServer())
        .delete(`/templates/${mockTemplate.id}`)
        .expect(200);

      // Mock not found for subsequent get
      mockTemplateDao.cruds.getTemplateById.fetch.mockResolvedValue(null);

      // Then try to get it - should return 404
      return request(app.getHttpServer())
        .get(`/templates/${mockTemplate.id}`)
        .expect(404);
    });
  });

  describe('Full CRUD workflow', () => {
    it('should complete full CRUD cycle', async () => {
      const templateId = mockTemplate.id;
      const createDto = {
        name: 'Full CRUD Test',
        email: 'crud@test.com',
        birthDate: '1990-01-01',
      };
      const updateDto = {
        name: 'Updated CRUD Test',
        email: 'updated-crud@test.com',
      };

      // Mock create
      mockTemplateDao.cruds.createTemplate.create.mockResolvedValue({
        ...mockTemplate,
        ...createDto,
      });

      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/templates')
        .send(createDto)
        .expect(201);

      expect(createResponse.body.id).toBe(templateId);

      // Mock read
      mockTemplateDao.cruds.getTemplateById.fetch.mockResolvedValue({
        ...mockTemplate,
        ...createDto,
      });

      // Read
      await request(app.getHttpServer())
        .get(`/templates/${templateId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(templateId);
          expect(res.body.name).toBe(createDto.name);
        });

      // Mock update
      const updatedTemplate = { ...mockTemplate, ...createDto, ...updateDto };
      mockTemplateDao.cruds.updateTemplate.update.mockResolvedValue(
        updatedTemplate,
      );

      // Update
      await request(app.getHttpServer())
        .put(`/templates/${templateId}`)
        .send(updateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateDto.name);
          expect(res.body.email).toBe(updateDto.email);
        });

      // Mock read after update
      mockTemplateDao.cruds.getTemplateById.fetch.mockResolvedValue(
        updatedTemplate,
      );

      // Verify update
      await request(app.getHttpServer())
        .get(`/templates/${templateId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateDto.name);
          expect(res.body.email).toBe(updateDto.email);
        });

      // Mock delete
      mockTemplateDao.cruds.deleteTemplate.delete.mockResolvedValue(
        updatedTemplate,
      );

      // Delete
      await request(app.getHttpServer())
        .delete(`/templates/${templateId}`)
        .expect(200);

      // Mock not found for verification
      mockTemplateDao.cruds.getTemplateById.fetch.mockResolvedValue(null);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/templates/${templateId}`)
        .expect(404);
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON', () => {
      return request(app.getHttpServer())
        .post('/templates')
        .set('Content-Type', 'application/json')
        .send(
          '{"name": "test", "email": "test@test.com", "birthDate": "1990-01-01"',
        ) // Missing closing brace
        .expect(400);
    });

    it('should handle unsupported HTTP methods', () => {
      return request(app.getHttpServer())
        .patch('/templates/123e4567-e89b-12d3-a456-426614174000')
        .expect(404);
    });

    it('should handle non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/non-existent-route')
        .expect(404);
    });
  });
});
