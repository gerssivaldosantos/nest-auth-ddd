import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { applyGlobalConfig } from './global-config'

class Bootstrap {
  static async load () {
    const { AppModule } = await import('./app.module')
    const app = await NestFactory.create(AppModule)
    const configService: ConfigService = app.get(ConfigService)

    applyGlobalConfig(app)
    await app.init()

    await app.listen(Number(configService.get('APP_PORT')) || 3000)
  }
}

Bootstrap.load()
