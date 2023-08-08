import {
  INestApplication,
  ValidationPipe,
  VersioningType
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import validationOptions from './utils/validation-options'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function applyGlobalConfig(app: INestApplication) {
  const configService: ConfigService = app.get(ConfigService)
  app.enableCors({
    origin: configService.get('ALLOW_ORIGIN')
  })
  app.enableShutdownHooks()
  app.setGlobalPrefix(configService.get('app.apiPrefix'))
  app.enableVersioning({
    type: VersioningType.URI
  })
  app.useGlobalPipes(new ValidationPipe(validationOptions))
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NCRUD Generator')
    .setVersion('1.0')
    .addTag('NCRUD')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, document)
}
