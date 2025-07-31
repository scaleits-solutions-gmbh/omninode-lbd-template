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
import { NestJsKit } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { TemplateService } from './template.service';
import {
  TemplateDto,
  CreateTemplateDto,
  UpdateTemplateDto,
  GetTemplateByIdDto,
} from './dto';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  async getTemplates(
    @Query() query: Record<string, string>,
  ): Promise<PaginatedData<TemplateDto>> {
    return this.templateService.getTemplates(query);
  }

  @Get('/count')
  async getTemplatesCount(): Promise<{ count: number }> {
    return this.templateService.getTemplatesCount();
  }

  @Get('/:templateId')
  async getTemplate(
    @Param() getTemplateByIdDto: GetTemplateByIdDto,
  ): Promise<TemplateDto> {
    const template = await this.templateService.getTemplateById(
      getTemplateByIdDto.templateId,
    );
    if (!template) {
      throw new NestJsKit.NestJsNotFoundException('Template not found', [
        {
          message: 'Template not found',
          code: 'TEMPLATE_NOT_FOUND',
        },
      ]);
    }
    return template;
  }

  @Post()
  async createTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<TemplateDto> {
    return this.templateService.createTemplate(createTemplateDto);
  }

  @Put('/:templateId')
  async updateTemplate(
    @Param() getTemplateByIdDto: GetTemplateByIdDto,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<TemplateDto> {
    const template = await this.templateService.updateTemplate(
      getTemplateByIdDto.templateId,
      updateTemplateDto,
    );
    if (!template) {
      throw new NestJsKit.NestJsNotFoundException('Template not found', [
        {
          message: 'Template not found',
          code: 'TEMPLATE_NOT_FOUND',
        },
      ]);
    }
    return template;
  }

  @Delete('/:templateId')
  async deleteTemplate(
    @Param() getTemplateByIdDto: GetTemplateByIdDto,
  ): Promise<TemplateDto> {
    const template = await this.templateService.deleteTemplate(
      getTemplateByIdDto.templateId,
    );
    if (!template) {
      throw new NestJsKit.NestJsNotFoundException('Template not found', [
        {
          message: 'Template not found',
          code: 'TEMPLATE_NOT_FOUND',
        },
      ]);
    }
    return template;
  }
}
