import { Module } from '@nestjs/common'
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Notification from '@core/@shared/domain/notification/notification'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { AuthTypeOrmEntitySchema } from '@core/auth/infra/db/typeorm/auth.typeorm-entity.schema'
import { SignUpUseCase } from '@core/auth/application/use-case/sign-up.use-case'
import { AuthController } from './auth.controller'
import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET
    }),
    TypeOrmModule.forFeature([AuthTypeOrmEntitySchema])
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
      provide: SignUpUseCase,
      useFactory: async (
        repo: AuthTypeOrmRepository<AuthEntity>,
        configService: ConfigService,
        jwtService: JwtService
      ) => {
        return new SignUpUseCase(repo, jwtService, configService)
      },
      inject: [AuthTypeOrmRepository, ConfigService, JwtService]
    }
  ]
})
export class AuthModule {}
