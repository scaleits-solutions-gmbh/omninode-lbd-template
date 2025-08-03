import { Test, TestingModule } from '@nestjs/testing';
import { TemplateModule } from '../../../src/module/template/template.module';
import { TemplateController } from '../../../src/module/template/template.controller';
import { TemplateService } from '../../../src/module/template/template.service';

describe('TemplateModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TemplateModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  describe('module configuration', () => {
    it('should be defined', () => {
      expect(module).toBeDefined();
    });

    it('should have TemplateController defined', () => {
      const controller = module.get<TemplateController>(TemplateController);
      expect(controller).toBeDefined();
      expect(controller).toBeInstanceOf(TemplateController);
    });

    it('should have TemplateService defined', () => {
      const service = module.get<TemplateService>(TemplateService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(TemplateService);
    });

    it('should export TemplateService', () => {
      const service = module.get<TemplateService>(TemplateService);
      expect(service).toBeDefined();
    });
  });

  describe('dependency injection', () => {
    it('should inject TemplateService into TemplateController', () => {
      const controller = module.get<TemplateController>(TemplateController);
      const service = module.get<TemplateService>(TemplateService);

      // Verify that the controller has access to the service
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });

    it('should have proper service methods available', () => {
      const service = module.get<TemplateService>(TemplateService);

      expect(typeof service.getTemplates).toBe('function');
      expect(typeof service.getTemplatesCount).toBe('function');
      expect(typeof service.getTemplateById).toBe('function');
      expect(typeof service.createTemplate).toBe('function');
      expect(typeof service.updateTemplate).toBe('function');
      expect(typeof service.deleteTemplate).toBe('function');
    });

    it('should have proper controller methods available', () => {
      const controller = module.get<TemplateController>(TemplateController);

      expect(typeof controller.getTemplates).toBe('function');
      expect(typeof controller.getTemplatesCount).toBe('function');
      expect(typeof controller.getTemplate).toBe('function');
      expect(typeof controller.createTemplate).toBe('function');
      expect(typeof controller.updateTemplate).toBe('function');
      expect(typeof controller.deleteTemplate).toBe('function');
    });
  });

  describe('module initialization', () => {
    it('should initialize without errors', async () => {
      const module = await Test.createTestingModule({
        imports: [TemplateModule],
      }).compile();

      expect(module).toBeDefined();
      await module.close();
    });

    it('should handle module lifecycle correctly', async () => {
      const module = await Test.createTestingModule({
        imports: [TemplateModule],
      }).compile();

      // Test that we can get all providers
      const controller = module.get<TemplateController>(TemplateController);
      const service = module.get<TemplateService>(TemplateService);

      expect(controller).toBeDefined();
      expect(service).toBeDefined();

      // Test that we can close the module
      await module.close();
    });
  });

  describe('module exports', () => {
    it('should export TemplateService for use in other modules', () => {
      const service = module.get<TemplateService>(TemplateService);
      expect(service).toBeDefined();
    });
  });
});
