import { validate } from 'class-validator';
import { UpdateTemplateDto } from '../../../../../src/module/template/dto/input/update-template.dto';

describe('UpdateTemplateDto', () => {
  let updateTemplateDto: UpdateTemplateDto;

  beforeEach(() => {
    updateTemplateDto = new UpdateTemplateDto();
  });

  // Helper function to find validation error by property
  const findErrorByProperty = (errors: any[], property: string) => {
    return errors.find(error => error.property === property);
  };

  describe('name validation', () => {
    it('should pass validation with valid name', async () => {
      updateTemplateDto.name = 'Updated Template';

      const errors = await validate(updateTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when name is not provided', async () => {
      // name is undefined (not provided)
      const errors = await validate(updateTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when name is empty string (optional field)', async () => {
      updateTemplateDto.name = '';

      const errors = await validate(updateTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when name exceeds 255 characters', async () => {
      updateTemplateDto.name = 'a'.repeat(256);

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const nameError = findErrorByProperty(errors, 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.constraints?.maxLength).toBeDefined();
    });

    it('should fail validation when name is not a string', async () => {
      (updateTemplateDto as any).name = 123;

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const nameError = findErrorByProperty(errors, 'name');
      expect(nameError).toBeDefined();
      expect(nameError?.constraints?.isString).toBeDefined();
    });
  });

  describe('email validation', () => {
    it('should pass validation with valid email', async () => {
      updateTemplateDto.email = 'updated@example.com';

      const errors = await validate(updateTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when email is not provided', async () => {
      // email is undefined (not provided)
      const errors = await validate(updateTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when email is empty string', async () => {
      updateTemplateDto.email = '';

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.isEmail).toBeDefined();
    });

    it('should fail validation when email is invalid', async () => {
      updateTemplateDto.email = 'invalid-email';

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.isEmail).toBeDefined();
    });

    it('should fail validation when email exceeds 255 characters', async () => {
      updateTemplateDto.email = 'a'.repeat(250) + '@example.com';

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.maxLength).toBeDefined();
    });

    it('should fail validation when email is not a string', async () => {
      (updateTemplateDto as any).email = 123;

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.isEmail).toBeDefined();
    });
  });

  describe('birthDate validation', () => {
    it('should pass validation with valid birthDate', async () => {
      updateTemplateDto.birthDate = '1995-05-15';

      const errors = await validate(updateTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when birthDate is not provided', async () => {
      // birthDate is undefined (not provided)
      const errors = await validate(updateTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when birthDate is empty string', async () => {
      updateTemplateDto.birthDate = '';

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const birthDateError = findErrorByProperty(errors, 'birthDate');
      expect(birthDateError).toBeDefined();
      expect(birthDateError?.constraints?.isDateString).toBeDefined();
    });

    it('should fail validation when birthDate is not a valid date string', async () => {
      updateTemplateDto.birthDate = 'invalid-date';

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const birthDateError = findErrorByProperty(errors, 'birthDate');
      expect(birthDateError).toBeDefined();
      expect(birthDateError?.constraints?.isDateString).toBeDefined();
    });

    it('should fail validation when birthDate is not a string', async () => {
      (updateTemplateDto as any).birthDate = 123;

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const birthDateError = findErrorByProperty(errors, 'birthDate');
      expect(birthDateError).toBeDefined();
      expect(birthDateError?.constraints?.isDateString).toBeDefined();
    });

    it('should pass validation with valid date formats', async () => {
      const validDates = ['1990-01-01', '2000-12-31', '1985-06-15', '1995-05-15'];
      
      for (const date of validDates) {
        updateTemplateDto.birthDate = date;

        const errors = await validate(updateTemplateDto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('multiple field validation', () => {
    it('should pass validation with all fields provided and valid', async () => {
      updateTemplateDto.name = 'Updated Template Name';
      updateTemplateDto.email = 'updated@example.com';
      updateTemplateDto.birthDate = '1995-05-15';

      const errors = await validate(updateTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial fields provided', async () => {
      updateTemplateDto.name = 'Updated Template Name';
      // email and birthDate not provided

      const errors = await validate(updateTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      const errors = await validate(updateTemplateDto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with multiple invalid fields', async () => {
      updateTemplateDto.name = 'a'.repeat(256); // too long
      updateTemplateDto.email = 'invalid-email';
      updateTemplateDto.birthDate = 'invalid-date';

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(3);
      
      const nameError = findErrorByProperty(errors, 'name');
      const emailError = findErrorByProperty(errors, 'email');
      const birthDateError = findErrorByProperty(errors, 'birthDate');
      
      expect(nameError).toBeDefined();
      expect(emailError).toBeDefined();
      expect(birthDateError).toBeDefined();
    });

    it('should pass validation with mixed valid and invalid fields', async () => {
      updateTemplateDto.name = 'Valid Name';
      updateTemplateDto.email = 'invalid-email'; // This should fail
      // birthDate not provided (should pass)

      const errors = await validate(updateTemplateDto);
      expect(errors.length).toBeGreaterThanOrEqual(1);
      const emailError = findErrorByProperty(errors, 'email');
      expect(emailError).toBeDefined();
      expect(emailError?.constraints?.isEmail).toBeDefined();
    });
  });
}); 