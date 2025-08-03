import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { TemplateService } from '../../../src/module/template/template.service';
import { TemplateDao } from '@scaleits-solutions-gmbh/omninode-lib-database-drizzle';
import {
  NestJsKit,
  buildCustomParamsFromQuery,
} from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  GetTemplateByIdDto,
} from '../../../src/module/template/dto/input';
import { TemplateDtoUtils } from '../../../src/module/template/dto/output';

// Mock the DAO
jest.mock('@scaleits-solutions-gmbh/omninode-lib-database-drizzle', () => ({
  TemplateDao: {
    cruds: {
      getTemplates: {
        fetch: jest.fn(),
        fetchCount: jest.fn(),
        allowedFilterOptions: [],
        allowedSortOptions: [],
        maxPageSize: 100,
        defaultParams: {
          paginationOption: { page: 1, limit: 10 },
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

// Mock the common kit
jest.mock('@scaleits-solutions-gmbh/org-lib-backend-common-kit', () => ({
  NestJsKit: {
    NestJsNotFoundException: jest.fn().mockImplementation((message) => {
      const error = new Error(message);
      error.name = 'NestJsNotFoundException';
      return error;
    }),
    NestJsBadRequestException: jest.fn(),
  },
  buildCustomParamsFromQuery: jest.fn(),
}));

describe('TemplateService', () => {
  let service: TemplateService;
  let mockTemplateDao: jest.Mocked<typeof TemplateDao>;
  let mockBuildCustomParamsFromQuery: jest.MockedFunction<
    typeof buildCustomParamsFromQuery
  >;

  const mockTemplate = {
    id: 'bbf81e77-17eb-49f5-a910-fb1127b156cf',
    name: 'Test Template',
    email: 'test@example.com',
    birthDate: '1990-01-01',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateService],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
    mockTemplateDao = TemplateDao as jest.Mocked<typeof TemplateDao>;
    mockBuildCustomParamsFromQuery =
      buildCustomParamsFromQuery as jest.MockedFunction<
        typeof buildCustomParamsFromQuery
      >;

    // Reset all mocks
    jest.clearAllMocks();

    // Properly type the mock functions
    (mockTemplateDao.cruds.getTemplates.fetch as jest.Mock).mockReset();
    (mockTemplateDao.cruds.getTemplates.fetchCount as jest.Mock).mockReset();
    (mockTemplateDao.cruds.getTemplatesCount.fetch as jest.Mock).mockReset();
    (mockTemplateDao.cruds.getTemplateById.fetch as jest.Mock).mockReset();
    (mockTemplateDao.cruds.createTemplate.create as jest.Mock).mockReset();
    (mockTemplateDao.cruds.updateTemplate.update as jest.Mock).mockReset();
    (mockTemplateDao.cruds.deleteTemplate.delete as jest.Mock).mockReset();

    // Setup buildCustomParamsFromQuery mock
    mockBuildCustomParamsFromQuery.mockReturnValue({
      success: true,
      customParams: {
        paginationOption: { page: 1, limit: 10 },
      },
    });
  });

  describe('getTemplates', () => {
    it('should return paginated templates', async () => {
      const mockTemplates = [mockTemplate];
      const mockCount = 1;

      (mockTemplateDao.cruds.getTemplates.fetch as jest.Mock).mockResolvedValue(
        mockTemplates,
      );
      (
        mockTemplateDao.cruds.getTemplates.fetchCount as jest.Mock
      ).mockResolvedValue(mockCount);

      const result = await service.getTemplates({});

      expect(mockTemplateDao.cruds.getTemplates.fetch).toHaveBeenCalled();
      expect(mockTemplateDao.cruds.getTemplates.fetchCount).toHaveBeenCalled();
      expect(result.data).toEqual(mockTemplates);
      expect(result.total).toBe(mockCount);
    });

    it('should handle empty results', async () => {
      (mockTemplateDao.cruds.getTemplates.fetch as jest.Mock).mockResolvedValue(
        [],
      );
      (
        mockTemplateDao.cruds.getTemplates.fetchCount as jest.Mock
      ).mockResolvedValue(0);

      const result = await service.getTemplates({});

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should handle query parameters', async () => {
      const query = { page: '2', pageSize: '5' };
      (mockTemplateDao.cruds.getTemplates.fetch as jest.Mock).mockResolvedValue(
        [],
      );
      (
        mockTemplateDao.cruds.getTemplates.fetchCount as jest.Mock
      ).mockResolvedValue(0);

      // Mock buildCustomParamsFromQuery to return the expected parameters
      mockBuildCustomParamsFromQuery.mockReturnValue({
        success: true,
        customParams: {
          paginationOption: { page: 2, limit: 5 },
        },
      });

      await service.getTemplates(query);

      expect(mockTemplateDao.cruds.getTemplates.fetch).toHaveBeenCalledWith(
        expect.objectContaining({
          paginationOption: expect.objectContaining({
            page: 2,
            limit: 5,
          }),
        }),
      );
    });
  });

  describe('getTemplatesCount', () => {
    it('should return templates count', async () => {
      const mockCount = 5;
      (
        mockTemplateDao.cruds.getTemplatesCount.fetch as jest.Mock
      ).mockResolvedValue(mockCount);

      const result = await service.getTemplatesCount();

      expect(mockTemplateDao.cruds.getTemplatesCount.fetch).toHaveBeenCalled();
      expect(result).toEqual({ count: mockCount });
    });
  });

  describe('getTemplateById', () => {
    it('should return template by ID', async () => {
      const templateId = '4d54519a-447d-4229-b697-6dcd96922647';
      (
        mockTemplateDao.cruds.getTemplateById.fetch as jest.Mock
      ).mockResolvedValue(mockTemplate);

      const result = await service.getTemplateById(templateId);

      expect(mockTemplateDao.cruds.getTemplateById.fetch).toHaveBeenCalledWith(
        templateId,
      );
      expect(result).toEqual(mockTemplate);
    });

    it('should throw NotFoundException when template not found', async () => {
      const templateId = '2c74ed65-4a90-4a24-893f-e1cc1b826c46';
      const mockFetch = mockTemplateDao.cruds.getTemplateById
        .fetch as jest.Mock;
      mockFetch.mockResolvedValue(null);

      await expect(service.getTemplateById(templateId)).rejects.toThrow(
        'Template not found',
      );
      expect(mockFetch).toHaveBeenCalledWith(templateId);
    });
  });

  describe('createTemplate', () => {
    it('should create template successfully', async () => {
      const createDto: CreateTemplateDto = {
        name: 'New Template',
        email: 'new@example.com',
        birthDate: '1995-05-15',
      };

      const createdTemplate = { ...mockTemplate, ...createDto };
      (
        mockTemplateDao.cruds.createTemplate.create as jest.Mock
      ).mockResolvedValue(createdTemplate);

      const result = await service.createTemplate(createDto);

      expect(mockTemplateDao.cruds.createTemplate.create).toHaveBeenCalledWith(
        createDto,
      );
      expect(result).toEqual(createdTemplate);
    });

    it('should handle creation error', async () => {
      const createDto: CreateTemplateDto = {
        name: 'New Template',
        email: 'new@example.com',
        birthDate: '1995-05-15',
      };

      (
        mockTemplateDao.cruds.createTemplate.create as jest.Mock
      ).mockRejectedValue(new Error('Database error'));

      await expect(service.createTemplate(createDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('updateTemplate', () => {
    it('should update template successfully', async () => {
      const templateId = 'e5821442-debf-4423-b727-19618ffe895b';
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Template',
        email: 'updated@example.com',
      };

      const updatedTemplate = { ...mockTemplate, ...updateDto };
      (
        mockTemplateDao.cruds.updateTemplate.update as jest.Mock
      ).mockResolvedValue(updatedTemplate);

      const result = await service.updateTemplate(templateId, updateDto);

      expect(mockTemplateDao.cruds.updateTemplate.update).toHaveBeenCalledWith(
        templateId,
        updateDto,
      );
      expect(result).toEqual(updatedTemplate);
    });

    it('should return null when template not found for update', async () => {
      const templateId = '8690b271-5cde-4336-8f36-cdc1408df000';
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Template',
      };

      (
        mockTemplateDao.cruds.updateTemplate.update as jest.Mock
      ).mockResolvedValue(null);

      const result = await service.updateTemplate(templateId, updateDto);
      expect(result).toBeNull();
    });

    it('should handle update error', async () => {
      const templateId = '73ba1084-7277-44e9-8b03-8331915cb54c';
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Template',
      };

      (
        mockTemplateDao.cruds.updateTemplate.update as jest.Mock
      ).mockRejectedValue(new Error('Update error'));

      await expect(
        service.updateTemplate(templateId, updateDto),
      ).rejects.toThrow('Update error');
    });
  });

  describe('deleteTemplate', () => {
    it('should delete template successfully', async () => {
      const templateId = 'f9d07938-2eb8-4b29-83f8-1b5921cdfade';
      (
        mockTemplateDao.cruds.deleteTemplate.delete as jest.Mock
      ).mockResolvedValue(mockTemplate);

      const result = await service.deleteTemplate(templateId);

      expect(mockTemplateDao.cruds.deleteTemplate.delete).toHaveBeenCalledWith(
        templateId,
      );
      expect(result).toEqual(mockTemplate);
    });

    it('should return null when template not found for deletion', async () => {
      const templateId = 'fa00a5bd-47e7-42cc-afdb-10473e7cc323';
      (
        mockTemplateDao.cruds.deleteTemplate.delete as jest.Mock
      ).mockResolvedValue(null);

      const result = await service.deleteTemplate(templateId);
      expect(result).toBeNull();
    });

    it('should handle deletion error', async () => {
      const templateId = '7e52a65d-52c0-4ac9-b2c6-24c5258933e7';
      (
        mockTemplateDao.cruds.deleteTemplate.delete as jest.Mock
      ).mockRejectedValue(new Error('Delete error'));

      await expect(service.deleteTemplate(templateId)).rejects.toThrow(
        'Delete error',
      );
    });
  });

  describe('error handling', () => {
    it('should handle DAO errors gracefully', async () => {
      const error = new Error('Database connection failed');
      (mockTemplateDao.cruds.getTemplates.fetch as jest.Mock).mockRejectedValue(
        error,
      );

      await expect(service.getTemplates({})).rejects.toThrow(
        'Database connection failed',
      );
    });

    it('should log errors appropriately', async () => {
      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();
      const error = new Error('Test error');
      (mockTemplateDao.cruds.getTemplates.fetch as jest.Mock).mockRejectedValue(
        error,
      );

      try {
        await service.getTemplates({});
      } catch (e) {
        // Expected to throw
      }

      expect(loggerSpy).toHaveBeenCalled();
      loggerSpy.mockRestore();
    });
  });
});
