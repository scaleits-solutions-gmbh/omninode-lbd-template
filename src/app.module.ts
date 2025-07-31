import { Module } from '@nestjs/common';
import { TemplateModule } from './module/template/template.module';

@Module({
  imports: [TemplateModule],
})
export class AppModule {}
