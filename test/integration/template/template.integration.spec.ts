import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TemplateModule } from '../../../src/module/template/template.module';
import { TemplateService } from '../../../src/module/template/template.service';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
} from '../../../src/module/template/dto/input';

describe('Template Integration Tests', () => {
  let app: INestApplication;
  let service: TemplateService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TemplateModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = moduleFixture.get<TemplateService>(TemplateService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up any existing test data
    // This would typically involve clearing the test database
    // For now, we'll just ensure we start with a clean state
  });

  describe('Template CRUD Operations', () => {
    it('should create, read, update, and delete a template', async () => {
      // Create
      const createDto: CreateTemplateDto = {
        name: 'Integration Test Template',
        email: 'integration@test.com',
        birthDate: '1990-01-01',
      };

      const createdTemplate = await service.createTemplate(createDto);
      expect(createdTemplate).toBeDefined();
      expect(createdTemplate.name).toBe(createDto.name);
      expect(createdTemplate.email).toBe(createDto.email);
      expect(createdTemplate.birthDate).toBe(createDto.birthDate);
      expect(createdTemplate.id).toBeDefined();
      expect(createdTemplate.createdAt).toBeDefined();
      expect(createdTemplate.updatedAt).toBeDefined();

      // Read
      const retrievedTemplate = await service.getTemplateById(
        createdTemplate.id,
      );
      expect(retrievedTemplate).toBeDefined();
      expect(retrievedTemplate).not.toBeNull();
      expect(retrievedTemplate.id).toBe(createdTemplate.id);
      expect(retrievedTemplate.name).toBe(createDto.name);

      // Update
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Integration Test Template',
        email: 'updated@test.com',
      };

      const updatedTemplate = await service.updateTemplate(
        createdTemplate.id,
        updateDto,
      );
      expect(updatedTemplate).toBeDefined();
      expect(updatedTemplate).not.toBeNull();
      expect(updatedTemplate.id).toBe(createdTemplate.id);
      expect(updatedTemplate.name).toBe(updateDto.name);
      expect(updatedTemplate.email).toBe(updateDto.email);
      expect(updatedTemplate.birthDate).toBe(createDto.birthDate); // Should remain unchanged

      // Verify update was persisted
      const retrievedUpdatedTemplate = await service.getTemplateById(
        createdTemplate.id,
      );
      expect(retrievedUpdatedTemplate).not.toBeNull();
      expect(retrievedUpdatedTemplate.name).toBe(updateDto.name);
      expect(retrievedUpdatedTemplate.email).toBe(updateDto.email);

      // Delete
      const deletedTemplate = await service.deleteTemplate(createdTemplate.id);
      expect(deletedTemplate).toBeDefined();
      expect(deletedTemplate).not.toBeNull();
      expect(deletedTemplate.id).toBe(createdTemplate.id);

      // Verify deletion
      await expect(
        service.getTemplateById(createdTemplate.id),
      ).rejects.toThrow();
    });

    it('should handle multiple templates', async () => {
      // Create multiple templates
      const templates = [
        {
          name: 'Template 1',
          email: 'template1@test.com',
          birthDate: '1990-01-01',
        },
        {
          name: 'Template 2',
          email: 'template2@test.com',
          birthDate: '1991-02-02',
        },
        {
          name: 'Template 3',
          email: 'template3@test.com',
          birthDate: '1992-03-03',
        },
      ];

      const createdTemplates: any[] = [];
      for (const templateData of templates) {
        const created = await service.createTemplate(templateData);
        createdTemplates.push(created);
      }

      // Verify all templates were created
      expect(createdTemplates).toHaveLength(3);

      // Get all templates
      const allTemplates = await service.getTemplates({});
      expect(allTemplates.data.length).toBeGreaterThanOrEqual(3);

      // Get count
      const count = await service.getTemplatesCount();
      expect(count.count).toBeGreaterThanOrEqual(3);

      // Clean up
      for (const template of createdTemplates) {
        await service.deleteTemplate(template.id);
      }
    });

    it('should handle pagination correctly', async () => {
      // Create multiple templates for pagination testing
      const templates: any[] = [];
      for (let i = 1; i <= 15; i++) {
        const template = await service.createTemplate({
          name: `Pagination Template ${i}`,
          email: `pagination${i}@test.com`,
          birthDate: '1990-01-01',
        });
        templates.push(template);
      }

      try {
        // Test first page
        const firstPage = await service.getTemplates({
          page: '1',
          pageSize: '5',
        });
        expect(firstPage.data).toHaveLength(5);
        expect(firstPage.page).toBe(1);
        expect(firstPage.pageSize).toBe(5);
        expect(firstPage.total).toBeGreaterThanOrEqual(15);

        // Test second page
        const secondPage = await service.getTemplates({
          page: '2',
          pageSize: '5',
        });
        expect(secondPage.data).toHaveLength(5);
        expect(secondPage.page).toBe(2);
        expect(secondPage.pageSize).toBe(5);

        // Test different page size
        const largePage = await service.getTemplates({
          page: '1',
          pageSize: '10',
        });
        expect(largePage.data).toHaveLength(10);
        expect(largePage.pageSize).toBe(10);

        // Test last page
        const lastPage = await service.getTemplates({
          page: '3',
          pageSize: '5',
        });
        expect(lastPage.page).toBe(3);
      } finally {
        // Clean up
        for (const template of templates) {
          await service.deleteTemplate(template.id);
        }
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent template retrieval', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
      await expect(service.getTemplateById(nonExistentId)).rejects.toThrow();
    });

    it('should handle non-existent template update', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Name',
      };

      const result = await service.updateTemplate(nonExistentId, updateDto);
      expect(result).toBeNull();
    });

    it('should handle non-existent template deletion', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
      const result = await service.deleteTemplate(nonExistentId);
      expect(result).toBeNull();
    });

    it('should handle invalid UUID format', async () => {
      const invalidId = 'invalid-uuid';
      await expect(service.getTemplateById(invalidId)).rejects.toThrow();
    });
  });

  describe('Data Validation', () => {
    it('should validate required fields on creation', async () => {
      const invalidDto = {
        name: '', // Empty name should fail
        email: 'invalid-email', // Invalid email should fail
        birthDate: 'invalid-date', // Invalid date should fail
      };

      // These should be caught by the validation pipe
      // The service should receive valid data or throw validation errors
      expect(() => service.createTemplate(invalidDto as any)).rejects.toThrow();
    });

    it('should handle partial updates correctly', async () => {
      // Create a template first
      const createDto: CreateTemplateDto = {
        name: 'Partial Update Test',
        email: 'partial@test.com',
        birthDate: '1990-01-01',
      };

      const createdTemplate = await service.createTemplate(createDto);

      // Update only the name
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Name Only',
      };

      const updatedTemplate = await service.updateTemplate(
        createdTemplate.id,
        updateDto,
      );
      expect(updatedTemplate).not.toBeNull();
      expect(updatedTemplate.name).toBe('Updated Name Only');
      expect(updatedTemplate.email).toBe(createDto.email); // Should remain unchanged
      expect(updatedTemplate.birthDate).toBe(createDto.birthDate); // Should remain unchanged

      // Clean up
      await service.deleteTemplate(createdTemplate.id);
    });
  });

  describe('Performance', () => {
    it('should handle bulk operations efficiently', async () => {
      const startTime = Date.now();
      const templates: any[] = [];

      // Create 10 templates
      for (let i = 1; i <= 10; i++) {
        const template = await service.createTemplate({
          name: `Bulk Template ${i}`,
          email: `bulk${i}@test.com`,
          birthDate: '1990-01-01',
        });
        templates.push(template);
      }

      const createTime = Date.now() - startTime;
      expect(createTime).toBeLessThan(5000); // Should complete within 5 seconds

      // Retrieve all templates
      const retrieveStartTime = Date.now();
      const allTemplates = await service.getTemplates({});
      const retrieveTime = Date.now() - retrieveStartTime;
      expect(retrieveTime).toBeLessThan(2000); // Should complete within 2 seconds

      // Clean up
      for (const template of templates) {
        await service.deleteTemplate(template.id);
      }
    });
  });
});
