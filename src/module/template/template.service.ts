import { Injectable, Logger } from '@nestjs/common';
import {
  TemplateDao,
  GetTemplatesCollum,
} from '@scaleits-solutions-gmbh/omninode-lib-database-drizzle';
import {
  CustomParams,
  NestJsKit,
  buildCustomParamsFromQuery,
} from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import {
  PaginatedData,
  paginateExternalData,
} from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import {
  CreateTemplateDto,
  TemplateDto,
  TemplateDtoUtils,
  UpdateTemplateDto,
} from './dto';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  async getTemplates(
    query: Record<string, string>,
  ): Promise<PaginatedData<TemplateDto>> {
    const startTime = Date.now();
    this.logger.debug(
      `Fetching templates with query: ${JSON.stringify(query)}`,
    );

    try {
      const result = buildCustomParamsFromQuery(
        query,
        TemplateDao.cruds.getTemplates.allowedFilterOptions,
        TemplateDao.cruds.getTemplates.allowedSortOptions,
        true,
        TemplateDao.cruds.getTemplates.maxPageSize,
      );

      if (!result.success) {
        this.logger.warn(
          `Invalid query parameters: ${JSON.stringify(result.errorDetails)}`,
        );
        throw new NestJsKit.NestJsBadRequestException(
          'Validation Failed',
          result.errorDetails,
        );
      }

      const customParams =
        result.customParams as CustomParams<GetTemplatesCollum>;
      this.logger.debug(`Built custom params: ${JSON.stringify(customParams)}`);

      const [templates, total] = await Promise.all([
        TemplateDao.cruds.getTemplates.fetch(customParams),
        TemplateDao.cruds.getTemplates.fetchCount(customParams),
      ]);

      const duration = Date.now() - startTime;
      this.logger.log(
        `Retrieved ${templates.length} templates out of ${total} total in ${duration}ms`,
      );

      const templatesDto = TemplateDtoUtils.parseTemplateDtoList(templates);

      return paginateExternalData<TemplateDto>(
        templatesDto,
        total,
        customParams.paginationOption?.page ??
          TemplateDao.cruds.getTemplates.defaultParams.paginationOption.page,
        customParams.paginationOption?.limit ??
          TemplateDao.cruds.getTemplates.defaultParams.paginationOption.limit,
      );
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to fetch templates after ${duration}ms: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async getTemplatesCount(): Promise<{ count: number }> {
    const startTime = Date.now();
    this.logger.debug('Fetching templates count');

    try {
      const count = await TemplateDao.cruds.getTemplatesCount.fetch();
      const duration = Date.now() - startTime;
      this.logger.log(`Retrieved templates count: ${count} in ${duration}ms`);
      return { count };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to fetch templates count after ${duration}ms: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async getTemplateById(id: string): Promise<TemplateDto> {
    const startTime = Date.now();
    this.logger.debug(`Fetching template by ID: ${id}`);

    try {
      const template = await TemplateDao.cruds.getTemplateById.fetch(id);

      if (!template) {
        this.logger.warn(`Template not found with ID: ${id}`);
        throw new NestJsKit.NestJsNotFoundException('Template not found', [
          {
            message: 'Template not found',
            code: 'TEMPLATE_NOT_FOUND',
          },
        ]);
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Successfully retrieved template ${id} in ${duration}ms`);
      return TemplateDtoUtils.parseTemplateDto(template);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to fetch template ${id} after ${duration}ms: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async createTemplate(
    createTemplateDto: CreateTemplateDto,
  ): Promise<TemplateDto> {
    const startTime = Date.now();
    this.logger.debug(
      `Creating new template: ${JSON.stringify(createTemplateDto)}`,
    );

    try {
      const template =
        await TemplateDao.cruds.createTemplate.create(createTemplateDto);

      const duration = Date.now() - startTime;
      this.logger.log(
        `Successfully created template with ID: ${template.id} in ${duration}ms`,
      );

      return TemplateDtoUtils.parseTemplateDto(template);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to create template after ${duration}ms: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async updateTemplate(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<TemplateDto> {
    const startTime = Date.now();
    this.logger.debug(
      `Updating template ${id}: ${JSON.stringify(updateTemplateDto)}`,
    );

    try {
      const template = await TemplateDao.cruds.updateTemplate.update(
        id,
        updateTemplateDto,
      );

      if (!template) {
        this.logger.warn(`Template not found for update with ID: ${id}`);
        throw new NestJsKit.NestJsNotFoundException('Template not found', [
          {
            message: 'Template not found',
            code: 'TEMPLATE_NOT_FOUND',
          },
        ]);
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Successfully updated template ${id} in ${duration}ms`);
      return TemplateDtoUtils.parseTemplateDto(template);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to update template ${id} after ${duration}ms: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }

  async deleteTemplate(id: string): Promise<TemplateDto> {
    const startTime = Date.now();
    this.logger.debug(`Deleting template: ${id}`);

    try {
      const template = await TemplateDao.cruds.deleteTemplate.delete(id);

      if (!template) {
        this.logger.warn(`Template not found for deletion with ID: ${id}`);
        throw new NestJsKit.NestJsNotFoundException('Template not found', [
          {
            message: 'Template not found',
            code: 'TEMPLATE_NOT_FOUND',
          },
        ]);
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Successfully deleted template ${id} in ${duration}ms`);
      return TemplateDtoUtils.parseTemplateDto(template);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to delete template ${id} after ${duration}ms: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }
}
