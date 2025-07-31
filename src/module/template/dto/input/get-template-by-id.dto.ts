import { IsUUID, IsString } from 'class-validator';

export class GetTemplateByIdDto {
  @IsUUID('4', { message: 'Template ID must be a valid UUID v4 format' })
  @IsString({ message: 'Template ID must be a string' })
  templateId: string;
}
