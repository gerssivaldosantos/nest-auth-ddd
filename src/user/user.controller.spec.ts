import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Notification from '@core/@shared/domain/notification/notification'
import { CreateUserUseCase } from '@core/user/application/use-case/create-user.use-case'
import { ConfigModule } from '@nestjs/config'
import databaseConfig from '../config/database.config'
import { TypeOrmConfigService } from '../database/typeorm-config.service'
import { UserCreateDto } from '@core/user/application/dto/user-create.dto'
import UserEntity from '@core/user/domain/entities/user.entity'
import { SearchUserUseCase } from '@core/user/application/use-case/search-user.use-case'
import { SearchDto } from '@core/@shared/application/dto/search.dto'
import { UserFakerDatabuilder } from '@core/user/domain/entities/user.faker.databuilder'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { FindByIdUserUseCase } from '@core/user/application/use-case/findById-user.use-case'
import { UpdateUserUseCase } from '@core/user/application/use-case/update-user.use-case'
import { DeleteUserUseCase } from '@core/user/application/use-case/delete-user.use-case'
import { UserUpdateResultDto } from '@core/user/application/dto/user-update-result.dto'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { UserCreateResultDto } from '@core/user/application/dto/user-create-result.dto'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import authConfig from '../config/auth.config'
import appConfig from '../config/app.config'
import mailConfig from '../config/mail.config'
import fileConfig from '../config/file.config'
import { createUserRelations } from '@core/user/domain/repository/user.test.helper'
import { FieldDataFaker } from '@core/@shared/domain/tests/faker.databuilder'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'

describe('UserController', () => {
  let controller: UserController
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
      controllers: [UserController],
      providers: [
        {
          provide: UserTypeOrmRepository,
          useFactory: async (dataSource: DataSource) => {
            const notification = new Notification()
            return new UserTypeOrmRepository(dataSource, notification)
          },
          inject: [getDataSourceToken()]
        },
        /* CreateUserUseCase */
        {
          provide: CreateUserUseCase,
          useFactory: async (repo: UserTypeOrmRepository<UserEntity>) => {
            return new CreateUserUseCase(repo)
          },
          inject: [UserTypeOrmRepository]
        },
        /* FindByIdUserUseCase */
        {
          provide: FindByIdUserUseCase,
          useFactory: async (repository: UserTypeOrmRepository<UserEntity>) => {
            return new FindByIdUserUseCase(repository)
          },
          inject: [UserTypeOrmRepository]
        },
        /* SearchUserUseCase */
        {
          provide: SearchUserUseCase,
          useFactory: async (repo: UserTypeOrmRepository<UserEntity>) => {
            return new SearchUserUseCase(repo)
          },
          inject: [UserTypeOrmRepository]
        },
        /* UpdateUserUseCase */
        {
          provide: UpdateUserUseCase,
          useFactory: async (repository: UserTypeOrmRepository<UserEntity>) => {
            return new UpdateUserUseCase(repository)
          },
          inject: [UserTypeOrmRepository]
        },
        /* DeleteUserUseCase */
        {
          provide: DeleteUserUseCase,
          useFactory: async (repository: UserTypeOrmRepository<UserEntity>) => {
            return new DeleteUserUseCase(repository)
          },
          inject: [UserTypeOrmRepository]
        }
      ]
    }).compile()

    controller = module.get<UserController>(UserController)
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    notification = new Notification()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('Should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('INSERT', () => {
    it('Should insert valid User', async () => {
      const inputData: UserCreateDto = {
        ...new UserFakerDatabuilder().buildValid()
      }
      const useCaseResult: UserCreateResultDto = { ...inputData }
      jest
        .spyOn(CreateUserUseCase.prototype, 'execute')
        .mockResolvedValue(useCaseResult)
      const inserted = await controller.create(inputData)
      expect(inserted).toMatchObject(inputData)
    })

    it('Should get an error when inserting invalid User', async () => {
      const builder = new UserFakerDatabuilder()
      const fieldName = builder.getRandomField().name
      const inpuInvalid = builder.buildInValid([fieldName])
      const inputData: UserCreateDto = {
        ...inpuInvalid
      }
      jest
        .spyOn(CreateUserUseCase.prototype, 'execute')
        .mockRejectedValue(new NotificationError('Error'))
      await expect(controller.create(inputData)).rejects.toThrowError(
        NotificationError
      )
    })
  })

  describe('UPDATE', () => {
    it('Should update a valid User ', async () => {
      const inputData = new UserFakerDatabuilder().buildValid()
      const relations = await createUserRelations(dataSource)
      const entity = new UserEntity(
        { ...inputData, ...relations },
        notification
      )
      const repository = new UserTypeOrmRepository(dataSource, notification)
      await repository.insert(entity)
      const fieldName = inputData.getRandomField()
      inputData.setValidField(fieldName)
      const useCaseResult: UserUpdateResultDto = { ...inputData }
      jest
        .spyOn(UpdateUserUseCase.prototype, 'execute')
        .mockResolvedValue(useCaseResult)
      const updated = await controller.update('1', inputData)
      expect(updated).toEqual(useCaseResult)
    })

    it('Should get an error when updating invalid User', async () => {
      const builder = new UserFakerDatabuilder()
      const fieldName = builder.getRandomField().name
      const inpuInvalid = builder.buildInValid([fieldName])
      const inputData: UserCreateDto = {
        ...inpuInvalid
      }
      jest
        .spyOn(UpdateUserUseCase.prototype, 'execute')
        .mockRejectedValue(new NotificationError('Error'))
      await expect(controller.update('233', inputData)).rejects.toThrowError(
        NotificationError
      )
    })
  })

  describe('SEARCH', () => {
    it('Should search a User', async () => {
      const fakeData = new UserFakerDatabuilder().buildValid()
      const fieldName: FieldDataFaker = fakeData.getRandomField([
        'updatedAt',
        'createdAt',
        'password',
        'refreshToken',
        'refreshTokenExpiration'
      ])
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
