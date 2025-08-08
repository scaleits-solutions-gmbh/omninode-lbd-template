import { Module } from '@nestjs/common';
import { TemplateCrudsController } from './cruds/template.cruds.controller';
import { TemplateCrudsService } from './cruds/template.cruds.service';

@Module({
  controllers: [TemplateCrudsController],
  providers: [TemplateCrudsService],
  exports: [TemplateCrudsService],
})
export class TemplateModule {}
