import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Notification from '@core/@shared/domain/notification/notification'
import { CreateAuthUseCase } from '@core/auth/application/use-case/create-auth.use-case'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from '../config/database.config'
import { TypeOrmConfigService } from '../database/typeorm-config.service'
import { AuthCreateDto } from '@core/auth/application/dto/auth-create.dto'
import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { SearchAuthUseCase } from '@core/auth/application/use-case/search-auth.use-case'
import { SearchDto } from '@core/@shared/application/dto/search.dto'
import { AuthFakerDatabuilder } from '@core/auth/domain/entities/auth.faker.databuilder'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { FindByIdAuthUseCase } from '@core/auth/application/use-case/findById-auth.use-case'
import { UpdateAuthUseCase } from '@core/auth/application/use-case/update-auth.use-case'
import { DeleteAuthUseCase } from '@core/auth/application/use-case/delete-auth.use-case'
import { AuthUpdateResultDto } from '@core/auth/application/dto/auth-update-result.dto'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { AuthCreateResultDto } from '@core/auth/application/dto/auth-create-result.dto'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import authConfig from '../config/auth.config'
import appConfig from '../config/app.config'
import mailConfig from '../config/mail.config'
import fileConfig from '../config/file.config'
import { createAuthRelations } from '@core/auth/domain/repository/auth.test.helper'
import { FieldDataFaker } from '@core/@shared/domain/tests/faker.databuilder'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { describe, it, afterEach, beforeEach, expect, vi } from 'vitest'

describe('AuthController', () => {
  let controller: AuthController
  let dataSource: DataSource
  let notification: Notification

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'client'),
          exclude: ['/api*']
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig, authConfig, appConfig, mailConfig, fileConfig],
          envFilePath: ['.env.test']
        }),
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService
        })
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthTypeOrmRepository,
          useFactory: async (dataSource: DataSource) => {
            const notification = new Notification()
            return new AuthTypeOrmRepository(dataSource, notification)
          },
          inject: [getDataSourceToken()]
        },
        /* CreateAuthUseCase */
        {
          provide: CreateAuthUseCase,
          useFactory: async (repo: AuthTypeOrmRepository<AuthEntity>) => {
            return new CreateAuthUseCase(repo)
          },
          inject: [AuthTypeOrmRepository]
        },
        /* FindByIdAuthUseCase */
        {
          provide: FindByIdAuthUseCase,
          useFactory: async (repository: AuthTypeOrmRepository<AuthEntity>) => {
            return new FindByIdAuthUseCase(repository)
          },
          inject: [AuthTypeOrmRepository]
        },
        /* SearchAuthUseCase */
        {
          provide: SearchAuthUseCase,
          useFactory: async (repo: AuthTypeOrmRepository<AuthEntity>) => {
            return new SearchAuthUseCase(repo)
          },
          inject: [AuthTypeOrmRepository]
        },
        /* UpdateAuthUseCase */
        {
          provide: UpdateAuthUseCase,
          useFactory: async (repository: AuthTypeOrmRepository<AuthEntity>) => {
            return new UpdateAuthUseCase(repository)
          },
          inject: [AuthTypeOrmRepository]
        },
        /* DeleteAuthUseCase */
        {
          provide: DeleteAuthUseCase,
          useFactory: async (repository: AuthTypeOrmRepository<AuthEntity>) => {
            return new DeleteAuthUseCase(repository)
          },
          inject: [AuthTypeOrmRepository]
        }
      ]
    }).compile()

    controller = module.get<AuthController>(AuthController)
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    notification = new Notification()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('Should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('INSERT', () => {
    it('Should insert valid Auth', async () => {
      const inputData: AuthCreateDto = {
        ...new AuthFakerDatabuilder().buildValid()
      }
      const useCaseResult: AuthCreateResultDto = { ...inputData }
      vi
        .spyOn(CreateAuthUseCase.prototype, 'execute')
        .mockResolvedValue(useCaseResult)
      const inserted = await controller.create(inputData)
      expect(inserted).toMatchObject(inputData)
    })

    it('Should get an error when inserting invalid Auth', async () => {
      const builder = new AuthFakerDatabuilder()
      const fieldName = builder.getRandomField().name
      const inpuInvalid = builder.buildInValid([fieldName])
      const inputData: AuthCreateDto = {
        ...inpuInvalid
      }
      vi
        .spyOn(CreateAuthUseCase.prototype, 'execute')
        .mockRejectedValue(new NotificationError('Error'))
      await expect(controller.create(inputData)).rejects.toThrowError(
        NotificationError
      )
    })
  })

  describe('UPDATE', () => {
    it('Should update a valid Auth ', async () => {
      const inputData = new AuthFakerDatabuilder().buildValid()
      const relations = await createAuthRelations(dataSource)
      const entity = new AuthEntity({ ...inputData, ...relations }, notification)
      const repository = new AuthTypeOrmRepository(dataSource, notification)
      await repository.insert(entity)
      const fieldName = inputData.getRandomField()
      inputData.setValidField(fieldName)
      const useCaseResult: AuthUpdateResultDto = { ...inputData }
      vi
        .spyOn(UpdateAuthUseCase.prototype, 'execute')
        .mockResolvedValue(useCaseResult)
      const updated = await controller.update('1', inputData)
      expect(updated).toEqual(useCaseResult)
    })

    it('Should get an error when updating invalid Auth', async () => {
      const builder = new AuthFakerDatabuilder()
      const fieldName = builder.getRandomField().name
      const inpuInvalid = builder.buildInValid([fieldName])
      const inputData: AuthCreateDto = {
        ...inpuInvalid
      }
      vi
        .spyOn(UpdateAuthUseCase.prototype, 'execute')
        .mockRejectedValue(new NotificationError('Error'))
      await expect(controller.update('233', inputData)).rejects.toThrowError(
        NotificationError
      )
    })
  })

  describe('SEARCH', () => {
    it('Should search a Auth', async () => {
      const fakeData = new AuthFakerDatabuilder().buildValid()
      const fieldName: FieldDataFaker = fakeData.getRandomField([])
      const expression = {}
      expression[fieldName.name] = {
        $eq: fakeData[fieldName.name]
      }

      const searchInput: SearchDto = {
        filter: [expression]
      }
      const found = await controller.search(searchInput)
      expect(found.items).toBeDefined()
    })
  })
})
