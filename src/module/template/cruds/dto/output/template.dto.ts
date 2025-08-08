import { z } from 'zod';
import {
  parseArrayOrThrowNestJsException,
  parseOrThrowNestJsException,
} from '@scaleits-solutions-gmbh/omninode-lib-backend-common-kit';

export class TemplateDtoUtils {
  static readonly templateDtoSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.string().email(),
    birthDate: z.string(), // Drizzle date() returns string, not Date object
    createdAt: z.date(),
    updatedAt: z.date(),
  });

  static readonly parseTemplateDto = (template: unknown): TemplateDto => {
    return parseOrThrowNestJsException(this.templateDtoSchema, template);
  };

  static readonly parseTemplateDtoList = (
    templates: unknown[],
  ): TemplateDto[] => {
    return parseArrayOrThrowNestJsException(this.templateDtoSchema, templates);
  };
}

export type TemplateDto = z.infer<typeof TemplateDtoUtils.templateDtoSchema>;
