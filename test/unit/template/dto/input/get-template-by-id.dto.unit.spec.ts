import { validate } from 'class-validator';
import { GetTemplateByIdDto } from '../../../../../src/module/template/dto/input/get-template-by-id.dto';

describe('GetTemplateByIdDto', () => {
  describe('validation', () => {
    it('should pass validation with valid UUID v4', async () => {
      const dto = new GetTemplateByIdDto();
      dto.templateId = '550e8400-e29b-41d4-a716-446655440000';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with another valid UUID v4', async () => {
      const dto = new GetTemplateByIdDto();
      dto.templateId = '2c74ed65-4a90-4a24-893f-e1cc1b826c46';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when templateId is empty', async () => {
      const dto = new GetTemplateByIdDto();
      dto.templateId = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('templateId');
      expect(errors[0].constraints?.isUuid).toBeDefined();
    });

    it('should fail validation when templateId is missing', async () => {
      const dto = new GetTemplateByIdDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('templateId');
      expect(errors[0].constraints?.isUuid).toBeDefined();
    });

    it('should fail validation when templateId is not a valid UUID format', async () => {
      const invalidUuids = [
        'not-a-uuid',
        '550e8400-e29b-41d4-a716-44665544000', // too short
        '550e8400-e29b-41d4-a716-4466554400000', // too long
        '550e8400-e29b-41d4-a716-44665544000g', // invalid character
        '550e8400-e29b-41d4-a716-44665544000G', // invalid character
        '550e8400-e29b-41d4-a716-44665544000!', // invalid character
        '550e8400-e29b-41d4-a716', // incomplete
        '550e8400-e29b-41d4', // incomplete
        '550e8400-e29b', // incomplete
        '550e8400', // incomplete
        '123', // incomplete
      ];

      for (const invalidUuid of invalidUuids) {
        const dto = new GetTemplateByIdDto();
        dto.templateId = invalidUuid;

        const errors = await validate(dto);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe('templateId');
        expect(errors[0].constraints?.isUuid).toBeDefined();
      }
    });

    it('should fail validation when templateId is not a string', async () => {
      const dto = new GetTemplateByIdDto();
      (dto as any).templateId = 123;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('templateId');
      expect(errors[0].constraints?.isUuid).toBeDefined();
    });

    it('should fail validation when templateId is null', async () => {
      const dto = new GetTemplateByIdDto();
      (dto as any).templateId = null;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('templateId');
      expect(errors[0].constraints?.isUuid).toBeDefined();
    });

    it('should fail validation when templateId is undefined', async () => {
      const dto = new GetTemplateByIdDto();
      (dto as any).templateId = undefined;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('templateId');
      expect(errors[0].constraints?.isUuid).toBeDefined();
    });

    it('should pass validation with various valid UUID v4 formats', async () => {
      const validUuids = [
        '550e8400-e29b-41d4-a716-446655440000',
        '2c74ed65-4a90-4a24-893f-e1cc1b826c46',
        'e5821442-debf-4423-b727-19618ffe895b',
        '8690b271-5cde-4336-8f36-cdc1408df000',
        '73ba1084-7277-44e9-8b03-8331915cb54c',
        'f9d07938-2eb8-4b29-83f8-1b5921cdfade',
        'fa00a5bd-47e7-42cc-afdb-10473e7cc323',
        '754db50c-e82f-4940-b3e2-2dac619a097d',
      ];

      for (const validUuid of validUuids) {
        const dto = new GetTemplateByIdDto();
        dto.templateId = validUuid;

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });
  });
});
