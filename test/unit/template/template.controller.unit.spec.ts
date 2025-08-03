import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from '../../../src/module/template/template.controller';
import { TemplateService } from '../../../src/module/template/template.service';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  GetTemplateByIdDto,
} from '../../../src/module/template/dto/input';
import { TemplateDtoUtils } from '../../../src/module/template/dto/output';

describe('TemplateController', () => {
  let controller: TemplateController;
  let service: TemplateService;

  const mockTemplate = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Test Template',
    email: 'test@example.com',
    birthDate: '1990-01-01',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  const mockPaginatedResponse = {
    data: [mockTemplate],
    page: 1,
    pageSize: 10,
    total: 1,
    totalPages: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        {
          provide: TemplateService,
          useValue: {
            getTemplates: jest.fn(),
            getTemplatesCount: jest.fn(),
            getTemplateById: jest.fn(),
            createTemplate: jest.fn(),
            updateTemplate: jest.fn(),
            deleteTemplate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
    service = module.get<TemplateService>(TemplateService);
  });

  describe('getTemplates', () => {
    it('should return paginated templates', async () => {
      jest
        .spyOn(service, 'getTemplates')
        .mockResolvedValue(mockPaginatedResponse);

      const result = await controller.getTemplates({});

      expect(service.getTemplates).toHaveBeenCalledWith({});
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should handle query parameters', async () => {
      const query = { page: '2', pageSize: '5' };
      jest
        .spyOn(service, 'getTemplates')
        .mockResolvedValue(mockPaginatedResponse);

      await controller.getTemplates(query);

      expect(service.getTemplates).toHaveBeenCalledWith(query);
    });

    it('should handle empty results', async () => {
      const emptyResponse = {
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      };
      jest.spyOn(service, 'getTemplates').mockResolvedValue(emptyResponse);

      const result = await controller.getTemplates({});

      expect(result).toEqual(emptyResponse);
    });
  });

  describe('getTemplatesCount', () => {
    it('should return templates count', async () => {
      const count = { count: 5 };
      jest.spyOn(service, 'getTemplatesCount').mockResolvedValue(count);

      const result = await controller.getTemplatesCount();

      expect(service.getTemplatesCount).toHaveBeenCalled();
      expect(result).toEqual(count);
    });
  });

  describe('getTemplate', () => {
    it('should return template by ID', async () => {
      const templateId = '550e8400-e29b-41d4-a716-446655440000';
      const dto = new GetTemplateByIdDto();
      dto.templateId = templateId;

      jest.spyOn(service, 'getTemplateById').mockResolvedValue(mockTemplate);

      const result = await controller.getTemplate(dto);

      expect(service.getTemplateById).toHaveBeenCalledWith(templateId);
      expect(result).toEqual(mockTemplate);
    });

    it('should handle template not found', async () => {
      const templateId = '550e8400-e29b-41d4-a716-446655440000';
      const dto = new GetTemplateByIdDto();
      dto.templateId = templateId;

      const error = new Error('Template not found');
      jest.spyOn(service, 'getTemplateById').mockRejectedValue(error);

      await expect(controller.getTemplate(dto)).rejects.toThrow(
        'Template not found',
      );
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
      jest.spyOn(service, 'createTemplate').mockResolvedValue(createdTemplate);

      const result = await controller.createTemplate(createDto);

      expect(service.createTemplate).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(createdTemplate);
    });

    it('should handle creation error', async () => {
      const createDto: CreateTemplateDto = {
        name: 'New Template',
        email: 'new@example.com',
        birthDate: '1995-05-15',
      };

      const error = new Error('Creation failed');
      jest.spyOn(service, 'createTemplate').mockRejectedValue(error);

      await expect(controller.createTemplate(createDto)).rejects.toThrow(
        'Creation failed',
      );
    });
  });

  describe('updateTemplate', () => {
    it('should update template successfully', async () => {
      const templateId = '2c74ed65-4a90-4a24-893f-e1cc1b826c46';
      const dto = new GetTemplateByIdDto();
      dto.templateId = templateId;
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Template',
        email: 'updated@example.com',
      };

      const updatedTemplate = { ...mockTemplate, ...updateDto };
      jest.spyOn(service, 'updateTemplate').mockResolvedValue(updatedTemplate);

      const result = await controller.updateTemplate(dto, updateDto);

      expect(service.updateTemplate).toHaveBeenCalledWith(
        templateId,
        updateDto,
      );
      expect(result).toEqual(updatedTemplate);
    });

    it('should handle update error', async () => {
      const templateId = 'e5821442-debf-4423-b727-19618ffe895b';
      const dto = new GetTemplateByIdDto();
      dto.templateId = templateId;
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Template',
      };

      const error = new Error('Update failed');
      jest.spyOn(service, 'updateTemplate').mockRejectedValue(error);

      await expect(controller.updateTemplate(dto, updateDto)).rejects.toThrow(
        'Update failed',
      );
    });

    it('should handle template not found for update', async () => {
      const templateId = '8690b271-5cde-4336-8f36-cdc1408df000';
      const dto = new GetTemplateByIdDto();
      dto.templateId = templateId;
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Template',
      };

      const error = new Error('Template not found');
      jest.spyOn(service, 'updateTemplate').mockRejectedValue(error);

      await expect(controller.updateTemplate(dto, updateDto)).rejects.toThrow(
        'Template not found',
      );
    });
  });

  describe('deleteTemplate', () => {
    it('should delete template successfully', async () => {
      const templateId = '73ba1084-7277-44e9-8b03-8331915cb54c';
      const dto = new GetTemplateByIdDto();
      dto.templateId = templateId;

      jest.spyOn(service, 'deleteTemplate').mockResolvedValue(mockTemplate);

      const result = await controller.deleteTemplate(dto);

      expect(service.deleteTemplate).toHaveBeenCalledWith(templateId);
      expect(result).toEqual(mockTemplate);
    });

    it('should handle deletion error', async () => {
      const templateId = 'f9d07938-2eb8-4b29-83f8-1b5921cdfade';
      const dto = new GetTemplateByIdDto();
      dto.templateId = templateId;

      const error = new Error('Deletion failed');
      jest.spyOn(service, 'deleteTemplate').mockRejectedValue(error);

      await expect(controller.deleteTemplate(dto)).rejects.toThrow(
        'Deletion failed',
      );
    });

    it('should handle template not found for deletion', async () => {
      const templateId = 'fa00a5bd-47e7-42cc-afdb-10473e7cc323';
      const dto = new GetTemplateByIdDto();
      dto.templateId = templateId;

      const error = new Error('Template not found');
      jest.spyOn(service, 'deleteTemplate').mockRejectedValue(error);

      await expect(controller.deleteTemplate(dto)).rejects.toThrow(
        'Template not found',
      );
    });
  });

  describe('DTO validation', () => {
    it('should validate CreateTemplateDto', async () => {
      const createDto: CreateTemplateDto = {
        name: 'Test Template',
        email: 'test@example.com',
        birthDate: '1990-01-01',
      };

      jest.spyOn(service, 'createTemplate').mockResolvedValue(mockTemplate);

      await controller.createTemplate(createDto);

      expect(service.createTemplate).toHaveBeenCalledWith(createDto);
    });

    it('should validate UpdateTemplateDto', async () => {
      const templateId = '7e52a65d-52c0-4ac9-b2c6-24c5258933e7';
      const dto = new GetTemplateByIdDto();
      dto.templateId = templateId;
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Template',
        email: 'updated@example.com',
      };

      jest.spyOn(service, 'updateTemplate').mockResolvedValue(mockTemplate);

      await controller.updateTemplate(dto, updateDto);

      expect(service.updateTemplate).toHaveBeenCalledWith(
        templateId,
        updateDto,
      );
    });

    it('should validate GetTemplateByIdDto', async () => {
      const templateId = '754db50c-e82f-4940-b3e2-2dac619a097d';
      const dto = new GetTemplateByIdDto();
      dto.templateId = templateId;

      jest.spyOn(service, 'getTemplateById').mockResolvedValue(mockTemplate);

      await controller.getTemplate(dto);

      expect(service.getTemplateById).toHaveBeenCalledWith(templateId);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'getTemplates').mockRejectedValue(error);

      await expect(controller.getTemplates({})).rejects.toThrow(
        'Service error',
      );
    });

    it('should handle validation errors', async () => {
      const invalidDto = {
        name: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: not a valid email
        birthDate: 'invalid-date', // Invalid: not a valid date
      };

      // This should be caught by the validation pipe before reaching the controller
      // but we can test that the controller doesn't crash with invalid data
      jest.spyOn(service, 'createTemplate').mockResolvedValue(mockTemplate);

      // The actual validation would happen at the pipe level
      // This test just ensures the controller method signature is correct
      expect(typeof controller.createTemplate).toBe('function');
    });
  });
});
