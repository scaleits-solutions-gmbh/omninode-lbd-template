import { validate } from 'class-validator';
import { CreateTemplateDto } from '../../../../../src/module/template/dto/input/create-template.dto';

describe('CreateTemplateDto', () => {
  let createTemplateDto: CreateTemplateDto;

  beforeEach(() => {
    createTemplateDto = new CreateTemplateDto();
  });

  // Helper function to find validation error by property
  const findErrorByProperty = (errors: any[], property: string) => {
    return errors.find((error) => error.property === property);
  };

  describe('name validation', () => {
    it('should pass validation with valid name', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when name is empty', async () => {
      createTemplateDto.name = '';
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const nameError = findErrorByProperty(errors, 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when name is missing', async () => {
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const nameError = findErrorByProperty(errors, 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when name exceeds 255 characters', async () => {
      createTemplateDto.name = 'a'.repeat(256);
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const nameError = findErrorByProperty(errors, 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.constraints?.maxLength).toBeDefined();
    });

    it('should fail validation when name is not a string', async () => {
      (createTemplateDto as any).name = 123;
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const nameError = findErrorByProperty(errors, 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.constraints?.isString).toBeDefined();
    });

    it('should fail validation when name is null', async () => {
      (createTemplateDto as any).name = null;
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const nameError = findErrorByProperty(errors, 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when name is undefined', async () => {
      (createTemplateDto as any).name = undefined;
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const nameError = findErrorByProperty(errors, 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.constraints?.isNotEmpty).toBeDefined();
    });
  });

  describe('email validation', () => {
    it('should pass validation with valid email', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when email is empty', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = '';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when email is missing', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when email is invalid', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'invalid-email';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.isEmail).toBeDefined();
    });

    it('should fail validation when email exceeds 255 characters', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'a'.repeat(250) + '@example.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.maxLength).toBeDefined();
    });

    it('should fail validation when email is not a string', async () => {
      createTemplateDto.name = 'Test Template';
      (createTemplateDto as any).email = 123;
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.isEmail).toBeDefined();
    });

    it('should fail validation when email is null', async () => {
      createTemplateDto.name = 'Test Template';
      (createTemplateDto as any).email = null;
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when email is undefined', async () => {
      createTemplateDto.name = 'Test Template';
      (createTemplateDto as any).email = undefined;
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.isNotEmpty).toBeDefined();
    });
  });

  describe('birthDate validation', () => {
    it('should pass validation with valid birthDate', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with different valid date formats', async () => {
      const validDates = ['1990-01-01', '2000-12-31', '1985-06-15'];

      for (const date of validDates) {
        createTemplateDto.name = 'Test Template';
        createTemplateDto.email = 'test@example.com';
        createTemplateDto.birthDate = date;

        const errors = await validate(createTemplateDto);
        expect(errors).toHaveLength(0);
      }
    });

    it('should fail validation when birthDate is empty', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = '';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const birthDateError = findErrorByProperty(errors, 'birthDate');
      expect(birthDateError).toBeDefined();
      expect(birthDateError?.constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when birthDate is missing', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'test@example.com';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const birthDateError = findErrorByProperty(errors, 'birthDate');
      expect(birthDateError).toBeDefined();
      expect(birthDateError?.constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when birthDate is not a valid date string', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'test@example.com';
      createTemplateDto.birthDate = 'invalid-date';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const birthDateError = findErrorByProperty(errors, 'birthDate');
      expect(birthDateError).toBeDefined();
      expect(birthDateError?.constraints?.isDateString).toBeDefined();
    });

    it('should fail validation when birthDate is not a string', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'test@example.com';
      (createTemplateDto as any).birthDate = 123;

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const birthDateError = findErrorByProperty(errors, 'birthDate');
      expect(birthDateError).toBeDefined();
      expect(birthDateError?.constraints?.isDateString).toBeDefined();
    });

    it('should fail validation when birthDate is null', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'test@example.com';
      (createTemplateDto as any).birthDate = null;

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const birthDateError = findErrorByProperty(errors, 'birthDate');
      expect(birthDateError).toBeDefined();
      expect(birthDateError?.constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when birthDate is undefined', async () => {
      createTemplateDto.name = 'Test Template';
      createTemplateDto.email = 'test@example.com';
      (createTemplateDto as any).birthDate = undefined;

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const birthDateError = findErrorByProperty(errors, 'birthDate');
      expect(birthDateError).toBeDefined();
      expect(birthDateError?.constraints?.isNotEmpty).toBeDefined();
    });
  });

  describe('multiple field validation', () => {
    it('should fail validation with multiple errors', async () => {
      // All fields are invalid
      (createTemplateDto as any).name = 123;
      createTemplateDto.email = 'invalid-email';
      createTemplateDto.birthDate = 'invalid-date';

      const errors = await validate(createTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(3);

      const nameError = findErrorByProperty(errors, 'name');
      const emailError = findErrorByProperty(errors, 'email');
      const birthDateError = findErrorByProperty(errors, 'birthDate');

      expect(nameError).toBeDefined();
      expect(emailError).toBeDefined();
      expect(birthDateError).toBeDefined();
    });

    it('should pass validation with all valid fields', async () => {
      createTemplateDto.name = 'Valid Template Name';
      createTemplateDto.email = 'valid@email.com';
      createTemplateDto.birthDate = '1990-01-01';

      const errors = await validate(createTemplateDto);
      expect(errors).toHaveLength(0);
    });
  });
});
