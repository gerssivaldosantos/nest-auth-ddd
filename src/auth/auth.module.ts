import { Module } from '@nestjs/common'
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Notification from '@core/@shared/domain/notification/notification'
import { SignUpUseCase } from '@core/auth/application/use-case/sign-up.use-case'
import { AuthController } from './auth.controller'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { UserTypeOrmEntitySchema } from '@core/user/infra/db/typeorm/user.typeorm-entity.schema'
import UserEntity from '@core/user/domain/entities/user.entity'
import { SignInUseCase } from '@core/auth/application/use-case/sign-in.use-case'
import { LogoutUseCase } from '@core/auth/application/use-case/logout.use-case'
import { AccessTokenStrategy } from './strategies/accessToken.strategy'
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET
    }),
    TypeOrmModule.forFeature([UserTypeOrmEntitySchema])
  ],
  controllers: [AuthController],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: UserTypeOrmRepository,
      useFactory: async (dataSource: DataSource) => {
        const notification = new Notification()
        return new UserTypeOrmRepository(dataSource, notification)
      },
      inject: [getDataSourceToken()]
    },
    /* SignUpUseCase */
    {
      provide: SignUpUseCase,
      useFactory: async (
        repo: UserTypeOrmRepository<UserEntity>,
        configService: ConfigService,
        jwtService: JwtService
      ) => {
        return new SignUpUseCase(repo, jwtService, configService)
      },
      inject: [UserTypeOrmRepository, ConfigService, JwtService]
    },
    /* SignInUseCase */
    {
      provide: SignInUseCase,
      useFactory: async (
        repo: UserTypeOrmRepository<UserEntity>,
        configService: ConfigService,
        jwtService: JwtService
      ) => {
        return new SignInUseCase(repo, jwtService, configService)
      },
      inject: [UserTypeOrmRepository, ConfigService, JwtService]
    },
    /* LogoutUseCase */
    {
      provide: LogoutUseCase,
      useFactory: async (
        repo: UserTypeOrmRepository<UserEntity>,
        configService: ConfigService,
        jwtService: JwtService
      ) => {
        return new LogoutUseCase(repo, jwtService, configService)
      },
      inject: [UserTypeOrmRepository, ConfigService, JwtService]
    }
  ]
})
export class AuthModule {}
