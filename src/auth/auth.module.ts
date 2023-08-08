import { Module } from '@nestjs/common'
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Notification from '@core/@shared/domain/notification/notification'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { AuthTypeOrmEntitySchema } from '@core/auth/infra/db/typeorm/auth.typeorm-entity.schema'
import { SignUpUseCase } from '@core/auth/application/use-case/sign-up.use-case'
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
      provide: SignUpUseCase,
      useFactory: async (repo: AuthTypeOrmRepository<AuthEntity>) => {
        return new SignUpUseCase(repo)
      },
      inject: [AuthTypeOrmRepository]
    }
  ]
})
export class AuthModule {}
