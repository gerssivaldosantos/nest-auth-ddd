import { TypeOrmConfigService } from './typeorm-config.service'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import databaseConfig from '../config/database.config'
import { describe, it, beforeEach, expect } from 'vitest'

let config: ConfigService

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [TypeOrmConfigService],
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [databaseConfig],
        envFilePath: ['.env']
      })
    ]
  }).compile()

  config = module.get<ConfigService>(ConfigService)
})

describe('TypeOrmConfigService', () => {
  it('should be an instance of TypeOrmConfigService', () => {
    const configService = new TypeOrmConfigService(config)
    expect(configService).toBeInstanceOf(TypeOrmConfigService)
  })

  it('should create TypeOrmOptions', () => {
    const configService = new TypeOrmConfigService(config)
    const options = configService.createTypeOrmOptions()
    expect(options).toHaveProperty('type')
    expect(options.type).toEqual(process.env.DATABASE_TYPE)
  })
})
