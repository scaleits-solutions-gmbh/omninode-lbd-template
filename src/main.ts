import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestJsKit } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // setup global pipes to validate incoming requests with custom error handling
  app.useGlobalPipes(new NestJsKit.CustomValidationPipe());
  // setup global exception filter to format error responses
  app.useGlobalFilters(new NestJsKit.GlobalExceptionFilter());
  // start the server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
