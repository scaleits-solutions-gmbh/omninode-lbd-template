import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { TemplateCrudsService } from './template.cruds.service';
import {
  TemplateDto,
  CreateTemplateDto,
  UpdateTemplateDto,
  GetTemplateByIdDto,
} from './dto';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

@Controller('templates/cruds')
export class TemplateCrudsController {
  constructor(private readonly templateCrudsService: TemplateCrudsService) {}

  @Get()
  async getTemplates(
    @Query() query: Record<string, string>,
  ): Promise<PaginatedData<TemplateDto>> {
    return this.templateCrudsService.getTemplates(query);
  }

  @Get('/count')
  async getTemplatesCount(): Promise<{ count: number }> {
    return this.templateCrudsService.getTemplatesCount();
  }

  @Get('/:templateId')
  async getTemplate(
    @Param() getTemplateByIdDto: GetTemplateByIdDto,
  ): Promise<TemplateDto> {
    const template = await this.templateCrudsService.getTemplateById(
      getTemplateByIdDto.templateId,
    );

    return template;
  }

  @Post()
  async createTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<TemplateDto> {
    return this.templateCrudsService.createTemplate(createTemplateDto);
  }

  @Put('/:templateId')
  async updateTemplate(
    @Param() getTemplateByIdDto: GetTemplateByIdDto,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<TemplateDto> {
    const template = await this.templateCrudsService.updateTemplate(
      getTemplateByIdDto.templateId,
      updateTemplateDto,
    );

    return template;
  }

  @Delete('/:templateId')
  async deleteTemplate(
    @Param() getTemplateByIdDto: GetTemplateByIdDto,
  ): Promise<TemplateDto> {
    const template = await this.templateCrudsService.deleteTemplate(
      getTemplateByIdDto.templateId,
    );

    return template;
  }
}
