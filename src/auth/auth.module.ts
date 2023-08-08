import { Module } from '@nestjs/common'
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Notification from '@core/@shared/domain/notification/notification'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { AuthTypeOrmEntitySchema } from '@core/auth/infra/db/typeorm/auth.typeorm-entity.schema'
import { CreateAuthUseCase } from '@core/auth/application/use-case/create-auth.use-case'
import { FindByIdAuthUseCase } from '@core/auth/application/use-case/findById-auth.use-case'
import { SearchAuthUseCase } from '@core/auth/application/use-case/search-auth.use-case'
import { UpdateAuthUseCase } from '@core/auth/application/use-case/update-auth.use-case'
import { DeleteAuthUseCase } from '@core/auth/application/use-case/delete-auth.use-case'
import { AuthController } from './auth.controller'
import AuthEntity from '@core/auth/domain/entities/auth.entity'

@Module({
  imports: [TypeOrmModule.forFeature([AuthTypeOrmEntitySchema])],
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
})
export class AuthModule {}
