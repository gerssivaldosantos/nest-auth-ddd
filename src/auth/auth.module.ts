import { Module } from '@nestjs/common'
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import Notification from '@core/@shared/domain/notification/notification'
import { SignUpUseCase } from '@core/auth/application/use-case/sign-up.use-case'
import { AuthController } from './auth.controller'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { AuthTypeOrmEntitySchema } from '@core/auth/infra/db/typeorm/auth.typeorm-entity.schema'
import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { SignInUseCase } from '@core/auth/application/use-case/sign-in.use-case'
import { LogoutUseCase } from '@core/auth/application/use-case/logout.use-case'
import { AccessTokenStrategy } from './strategies/accessToken.strategy'
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy'
import { RefreshTokenUseCase } from '@core/auth/application/use-case/refresh-token.use-case'
import { CreateAuthUseCase } from '@core/auth/application/use-case/create-auth.use-case'
import { FindByIdAuthUseCase } from '@core/auth/application/use-case/findById-auth.use-case'
import { SearchAuthUseCase } from '@core/auth/application/use-case/search-auth.use-case'
import { UpdateAuthUseCase } from '@core/auth/application/use-case/update-auth.use-case'
import { DeleteAuthUseCase } from '@core/auth/application/use-case/delete-auth.use-case'

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
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: AuthTypeOrmRepository,
      useFactory: async (dataSource: DataSource) => {
        const notification = new Notification()
        return new AuthTypeOrmRepository(dataSource, notification)
      },
      inject: [getDataSourceToken()]
    },
    /* SignUpUseCase */
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
    },
    /* SignInUseCase */
    {
      provide: SignInUseCase,
      useFactory: async (
        repo: AuthTypeOrmRepository<AuthEntity>,
        configService: ConfigService,
        jwtService: JwtService
      ) => {
        return new SignInUseCase(repo, jwtService, configService)
      },
      inject: [AuthTypeOrmRepository, ConfigService, JwtService]
    },
    /* LogoutUseCase */
    {
      provide: LogoutUseCase,
      useFactory: async (
        repo: AuthTypeOrmRepository<AuthEntity>,
        configService: ConfigService,
        jwtService: JwtService
      ) => {
        return new LogoutUseCase(repo, jwtService, configService)
      },
      inject: [AuthTypeOrmRepository, ConfigService, JwtService]
    },
    /* RefreshTokenUseCase */
    {
      provide: RefreshTokenUseCase,
      useFactory: async (
        repo: AuthTypeOrmRepository<AuthEntity>,
        configService: ConfigService,
        jwtService: JwtService
      ) => {
        return new RefreshTokenUseCase(repo, jwtService, configService)
      },
      inject: [AuthTypeOrmRepository, ConfigService, JwtService]
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
