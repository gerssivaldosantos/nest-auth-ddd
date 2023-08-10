import UserEntity from '@core/user/domain/entities/user.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import { UserPresenter } from '@core/user/application/presenter/user.presenter'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { UserCreateResultDto } from '@core/user/application/dto/user-create-result.dto'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { HttpErrorCode } from '@core/@shared/application/dto/http.enum'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { FilterCondition } from '@core/@shared/infra/types'
import * as argon2 from 'argon2'
import { SignUpDTO } from '@core/auth/application/dto/sign-up.dto'
import { SignUpResultDto } from '@core/auth/application/dto/sign-up-result.dto'

export class SignUpUseCase extends UseCase {
  constructor(
    private repository: UserTypeOrmRepository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super()
  }

  async execute(data: SignUpDTO): Promise<SignUpResultDto | NotificationError> {
    const entity: UserEntity = await UserPresenter.dataToEntity<UserEntity>(
      data,
      UserEntity
    )
    await entity.encryptPassword()
    if (entity.notification.hasError()) {
      return Promise.reject(
        new NotificationError(
          entity.notification.getPlainMessageErrors(),
          HttpErrorCode.UNPROCESSABLE_ENTITY,
          entity.notification.getErrors()
        )
      )
    } else {
      const resultByEmail = await this.repository.search(
        new SearchParams<FilterCondition>(
          {
            filter: [{ email: data.email }]
          },
          {
            parser(filter: FilterCondition): FilterCondition {
              return filter
            }
          }
        )
      )
      if (resultByEmail.total > 0) {
        return Promise.reject(
          new NotificationError('Email já cadastrado', HttpErrorCode.CONFLICT)
        )
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: entity.id,
            username: entity.email
          },
          {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION')
          }
        ),
        this.jwtService.signAsync(
          {
            sub: entity.id,
            username: entity.email
          },
          {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: '7d'
          }
        )
      ])

      entity.refreshToken = await argon2.hash(refreshToken)
      const UserInserted = await this.repository.insert(entity)

      return {
        id: UserInserted.id,
        name: UserInserted.name,
        email: UserInserted.email,
        accessToken,
        refreshToken: UserInserted.refreshToken
      }
    }
  }
}
