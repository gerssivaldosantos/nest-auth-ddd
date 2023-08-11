import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import { AuthPresenter } from '@core/auth/application/presenter/auth.presenter'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
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
    private repository: AuthTypeOrmRepository<AuthEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super()
  }

  async execute(data: SignUpDTO): Promise<SignUpResultDto | NotificationError> {
    const entity: AuthEntity = await AuthPresenter.dataToEntity<AuthEntity>(
      data,
      AuthEntity
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
      const AuthInserted = await this.repository.insert(entity)

      return {
        id: AuthInserted.id,
        name: AuthInserted.name,
        email: AuthInserted.email,
        accessToken,
        refreshToken
      }
    }
  }
}
