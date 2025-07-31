import { TemplateDtoUtils, TemplateDto } from '../../../../../src/module/template/dto/output/template.dto';

describe('TemplateDto', () => {
  describe('TemplateDtoUtils.parseTemplateDto', () => {
    it('should parse valid template data', () => {
      const validTemplate = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Template',
        email: 'test@example.com',
        birthDate: '1990-01-01',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      };

      const result = TemplateDtoUtils.parseTemplateDto(validTemplate);
      expect(result).toEqual(validTemplate);
    });

    it('should throw error for invalid UUID', () => {
      const invalidTemplate = {
        id: 'invalid-uuid',
        name: 'Test Template',
        email: 'test@example.com',
        birthDate: '1990-01-01',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      };

      expect(() => TemplateDtoUtils.parseTemplateDto(invalidTemplate)).toThrow();
    });

    it('should throw error for invalid email', () => {
      const invalidTemplate = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Template',
        email: 'invalid-email',
        birthDate: '1990-01-01',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      };

      expect(() => TemplateDtoUtils.parseTemplateDto(invalidTemplate)).toThrow();
    });

    it('should throw error for missing required fields', () => {
      const invalidTemplate = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Template',
        // email missing
        birthDate: '1990-01-01',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      };

      expect(() => TemplateDtoUtils.parseTemplateDto(invalidTemplate)).toThrow();
    });

    it('should throw error for wrong data types', () => {
      const invalidTemplate = {
        id: 123, // should be string
        name: 'Test Template',
        email: 'test@example.com',
        birthDate: '1990-01-01',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      };

      expect(() => TemplateDtoUtils.parseTemplateDto(invalidTemplate)).toThrow();
    });

    it('should handle null input', () => {
      expect(() => TemplateDtoUtils.parseTemplateDto(null as any)).toThrow();
    });

    it('should handle undefined input', () => {
      expect(() => TemplateDtoUtils.parseTemplateDto(undefined as any)).toThrow();
    });

    it('should handle empty object', () => {
      expect(() => TemplateDtoUtils.parseTemplateDto({} as any)).toThrow();
    });
  });

  describe('TemplateDtoUtils.parseTemplateDtoList', () => {
    it('should parse valid template list', () => {
      const validTemplates = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Template 1',
          email: 'test1@example.com',
          birthDate: '1990-01-01',
          createdAt: new Date('2023-01-01T00:00:00.000Z'),
          updatedAt: new Date('2023-01-01T00:00:00.000Z'),
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Test Template 2',
          email: 'test2@example.com',
          birthDate: '1995-05-15',
          createdAt: new Date('2023-01-02T00:00:00.000Z'),
          updatedAt: new Date('2023-01-02T00:00:00.000Z'),
        },
      ];

      const result = TemplateDtoUtils.parseTemplateDtoList(validTemplates);
      expect(result).toEqual(validTemplates);
    });

    it('should throw error for list with invalid template', () => {
      const invalidTemplates = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Template 1',
          email: 'test1@example.com',
          birthDate: '1990-01-01',
          createdAt: new Date('2023-01-01T00:00:00.000Z'),
          updatedAt: new Date('2023-01-01T00:00:00.000Z'),
        },
        {
          id: 'invalid-uuid', // invalid
          name: 'Test Template 2',
          email: 'test2@example.com',
          birthDate: '1995-05-15',
          createdAt: new Date('2023-01-02T00:00:00.000Z'),
          updatedAt: new Date('2023-01-02T00:00:00.000Z'),
        },
      ];

      expect(() => TemplateDtoUtils.parseTemplateDtoList(invalidTemplates)).toThrow();
    });

    it('should handle empty array', () => {
      const result = TemplateDtoUtils.parseTemplateDtoList([]);
      expect(result).toEqual([]);
    });

    it('should handle null input', () => {
      expect(() => TemplateDtoUtils.parseTemplateDtoList(null as any)).toThrow();
    });

    it('should handle undefined input', () => {
      expect(() => TemplateDtoUtils.parseTemplateDtoList(undefined as any)).toThrow();
    });

    it('should handle non-array input', () => {
      expect(() => TemplateDtoUtils.parseTemplateDtoList('not-an-array' as any)).toThrow();
    });
  });

  describe('TemplateDtoUtils.templateDtoSchema', () => {
    it('should validate correct schema structure', () => {
      const schema = TemplateDtoUtils.templateDtoSchema;
      
      expect(schema.shape.id).toBeDefined();
      expect(schema.shape.name).toBeDefined();
      expect(schema.shape.email).toBeDefined();
      expect(schema.shape.birthDate).toBeDefined();
      expect(schema.shape.createdAt).toBeDefined();
      expect(schema.shape.updatedAt).toBeDefined();
    });

    it('should have correct field types', () => {
      const schema = TemplateDtoUtils.templateDtoSchema;
      
      // Test that the schema correctly validates UUID
      const validResult = schema.safeParse({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Template',
        email: 'test@example.com',
        birthDate: '1990-01-01',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      });
      
      expect(validResult.success).toBe(true);
    });

    it('should reject invalid UUID format', () => {
      const schema = TemplateDtoUtils.templateDtoSchema;
      
      const invalidResult = schema.safeParse({
        id: 'invalid-uuid',
        name: 'Test Template',
        email: 'test@example.com',
        birthDate: '1990-01-01',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      });
      
      expect(invalidResult.success).toBe(false);
    });

    it('should reject invalid email format', () => {
      const schema = TemplateDtoUtils.templateDtoSchema;
      
      const invalidResult = schema.safeParse({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Template',
        email: 'invalid-email',
        birthDate: '1990-01-01',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      });
      
      expect(invalidResult.success).toBe(false);
    });
  });

  describe('TemplateDto type', () => {
    it('should be correctly inferred from schema', () => {
      // This test ensures the TypeScript type is correctly inferred
      const template: TemplateDto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Template',
        email: 'test@example.com',
        birthDate: '1990-01-01',
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      };

      expect(template.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(template.name).toBe('Test Template');
      expect(template.email).toBe('test@example.com');
      expect(template.birthDate).toBe('1990-01-01');
      expect(template.createdAt).toBeInstanceOf(Date);
      expect(template.updatedAt).toBeInstanceOf(Date);
    });
  });
}); 