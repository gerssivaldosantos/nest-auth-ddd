import { Module } from '@nestjs/common'
import databaseConfig from './config/database.config'
import authConfig from './config/auth.config'
import appConfig from './config/app.config'
import mailConfig from './config/mail.config'
import fileConfig from './config/file.config'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypeOrmConfigService } from './database/typeorm-config.service'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*']
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
      envFilePath: ['.env']
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    AuthModule
  ],
  providers: []
})
export class AppModule {}
