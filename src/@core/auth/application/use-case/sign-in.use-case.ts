import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { HttpErrorCode } from '@core/@shared/application/dto/http.enum'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { FilterCondition } from '@core/@shared/infra/types'
import * as argon2 from 'argon2'
import { SignInDTO } from '@core/auth/application/dto/sign-in.dto'
import { SignInResultDto } from '@core/auth/application/dto/sign-in-result.dto'
import { AuthPresenter } from '@core/auth/application/presenter/auth.presenter'
import SignInEntity from '@core/auth/domain/entities/sign-in.entity'

export class SignInUseCase extends UseCase {
  constructor (
    private repository: AuthTypeOrmRepository<AuthEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super()
  }

  async execute (data: SignInDTO): Promise<SignInResultDto | NotificationError> {
    const entity: SignInEntity = await AuthPresenter.dataToEntity<SignInEntity>(
      data,
      SignInEntity
    )
    if (entity.notification.hasError()) {
      return Promise.reject(
        new NotificationError(
          entity.notification.getPlainMessageErrors(),
          HttpErrorCode.UNPROCESSABLE_ENTITY,
          entity.notification.getErrors()
        )
      )
    } else {
      const {
        total: resultTotal,
        items: [resultFindByEmail]
      } = await this.repository.search(
        new SearchParams<FilterCondition>(
          {
            filter: [{ email: data.email }]
          },
          {
            parser (filter: FilterCondition): FilterCondition {
              return filter
            }
          }
        )
      )
      if (resultTotal < 1) {
        return Promise.reject(
          new NotificationError(
            'Email não cadastrado',
            HttpErrorCode.BAD_REQUEST
          )
        )
      }
      const passwordMatches = await argon2.verify(
        resultFindByEmail.password,
        data.password
      )
      if (!passwordMatches) {
        return Promise.reject(
          new NotificationError('Dados incorretos', HttpErrorCode.UNAUTHORIZED)
        )
      }
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            sub: resultFindByEmail.id,
            authname: resultFindByEmail.email
          },
          {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION')
          }
        ),
        this.jwtService.signAsync(
          {
            sub: resultFindByEmail.id,
            authname: resultFindByEmail.email
          },
          {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>(
              'REFRESH_TOKEN_EXPIRATION'
            )
          }
        )
      ])
      const hashedToken = await argon2.hash(refreshToken)
      const entityUpdated = await AuthPresenter.dataToEntity<AuthEntity>(
        {
          ...resultFindByEmail,
          refreshToken: hashedToken
        },
        AuthEntity
      )
      await this.repository.update(entityUpdated)
      return {
        id: resultFindByEmail.id,
        name: resultFindByEmail.name,
        email: resultFindByEmail.email,
        accessToken,
        refreshToken
      }
    }
  }
}
