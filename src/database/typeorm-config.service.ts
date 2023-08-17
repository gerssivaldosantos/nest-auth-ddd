import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { join } from 'path'
import { AuthTypeOrmEntitySchema } from '@core/auth/infra/db/typeorm/auth.typeorm-entity.schema'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor (private configService: ConfigService) {}

  createTypeOrmOptions (): TypeOrmModuleOptions {
    return {
      type: this.configService.get('database.type'),
      url: this.configService.get('database.url'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.name'),
      synchronize: this.configService.get('database.synchronize'),
      dropSchema: false,
      keepConnectionAlive: true,
      logging: this.configService.get('app.nodeEnv') !== 'production',
      entities: [
        AuthTypeOrmEntitySchema,

      ],
      subscribers: [join(__dirname, '/../**/*.event-subscribe{.ts,.js}')],
      migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
      seeds: [join(__dirname, '/seeds/**/*{.ts,.js}')],
      factories: [join(__dirname, '/factories/**/*{.ts,.js}')],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber'
      },
      extra: {
        // based on https://node-postgres.com/api/pool
        // max connection pool size
        max: this.configService.get('database.maxConnections'),
        ssl: this.configService.get('database.sslEnabled')
          ? {
              rejectUnauthorized: this.configService.get(
                'database.rejectUnauthorized'
              ),
              ca: this.configService.get('database.ca')
                ? this.configService.get('database.ca')
                : undefined,
              key: this.configService.get('database.key')
                ? this.configService.get('database.key')
                : undefined,
              cert: this.configService.get('database.cert')
                ? this.configService.get('database.cert')
                : undefined
            }
          : undefined
      }
    } as TypeOrmModuleOptions
  }
}
