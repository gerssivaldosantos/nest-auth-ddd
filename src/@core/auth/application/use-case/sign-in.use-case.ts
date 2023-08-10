import UserEntity from '@core/user/domain/entities/user.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { HttpErrorCode } from '@core/@shared/application/dto/http.enum'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { FilterCondition } from '@core/@shared/infra/types'
import * as argon2 from 'argon2'
import { SignInDTO } from '@core/auth/application/dto/sign-in.dto'
import { SignInResultDto } from '@core/auth/application/dto/sign-in-result.dto'
import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { AuthPresenter } from '@core/auth/application/presenter/auth.presenter'
import { UserPresenter } from '@core/user/application/presenter/user.presenter'

export class SignInUseCase extends UseCase {
  constructor(
    private repository: UserTypeOrmRepository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super()
  }

  async execute(data: SignInDTO): Promise<SignInResultDto | NotificationError> {
    const entity: AuthEntity = await AuthPresenter.dataToEntity<AuthEntity>(
      data,
      AuthEntity
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
            parser(filter: FilterCondition): FilterCondition {
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
            username: resultFindByEmail.email
          },
          {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION')
          }
        ),
        this.jwtService.signAsync(
          {
            sub: resultFindByEmail.id,
            username: resultFindByEmail.email
          },
          {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: '7d'
          }
        )
      ])
      const hashedToken = await argon2.hash(refreshToken)
      const entityUpdated = await UserPresenter.dataToEntity<UserEntity>(
        {
          ...resultFindByEmail,
          refreshToken: hashedToken
        },
        UserEntity
      )
      await this.repository.update(entityUpdated)

      return {
        accessToken,
        refreshToken,
        ...resultFindByEmail
      }
    }
  }
}
