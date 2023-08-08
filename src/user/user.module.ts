import { Module } from '@nestjs/common'
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Notification from '@core/@shared/domain/notification/notification'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { UserTypeOrmEntitySchema } from '@core/user/infra/db/typeorm/user.typeorm-entity.schema'
import { CreateUserUseCase } from '@core/user/application/use-case/create-user.use-case'
import { FindByIdUserUseCase } from '@core/user/application/use-case/findById-user.use-case'
import { SearchUserUseCase } from '@core/user/application/use-case/search-user.use-case'
import { UpdateUserUseCase } from '@core/user/application/use-case/update-user.use-case'
import { DeleteUserUseCase } from '@core/user/application/use-case/delete-user.use-case'
import { UserController } from './user.controller'
import UserEntity from '@core/user/domain/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntitySchema])],
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
})
export class UserModule {}
