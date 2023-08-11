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
import { RefreshTokenUseCase } from '@core/auth/application/use-case/refresh-token.use-case'
import { CreateAuthUseCase } from '@core/auth/application/use-case/create-auth.use-case'
import { FindByIdAuthUseCase } from '@core/auth/application/use-case/findById-auth.use-case'
import { SearchAuthUseCase } from '@core/auth/application/use-case/search-auth.use-case'
import { UpdateAuthUseCase } from '@core/auth/application/use-case/update-auth.use-case'
import { DeleteUserUseCase } from '@core/auth/application/use-case/delete-auth.use-case'

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
    },
    /* RefreshTokenUseCase */
    {
      provide: RefreshTokenUseCase,
      useFactory: async (
        repo: UserTypeOrmRepository<UserEntity>,
        configService: ConfigService,
        jwtService: JwtService
      ) => {
        return new RefreshTokenUseCase(repo, jwtService, configService)
      },
      inject: [UserTypeOrmRepository, ConfigService, JwtService]
    },
    /* CreateUserUseCase */
    {
      provide: CreateAuthUseCase,
      useFactory: async (repo: UserTypeOrmRepository<UserEntity>) => {
        return new CreateAuthUseCase(repo)
      },
      inject: [UserTypeOrmRepository]
    },
    /* FindByIdUserUseCase */
    {
      provide: FindByIdAuthUseCase,
      useFactory: async (repository: UserTypeOrmRepository<UserEntity>) => {
        return new FindByIdAuthUseCase(repository)
      },
      inject: [UserTypeOrmRepository]
    },
    /* SearchUserUseCase */
    {
      provide: SearchAuthUseCase,
      useFactory: async (repo: UserTypeOrmRepository<UserEntity>) => {
        return new SearchAuthUseCase(repo)
      },
      inject: [UserTypeOrmRepository]
    },
    /* UpdateUserUseCase */
    {
      provide: UpdateAuthUseCase,
      useFactory: async (repository: UserTypeOrmRepository<UserEntity>) => {
        return new UpdateAuthUseCase(repository)
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
export class AuthModule {}
