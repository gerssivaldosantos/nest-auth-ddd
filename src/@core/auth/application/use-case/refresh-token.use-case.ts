import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { HttpErrorCode } from '@core/@shared/application/dto/http.enum'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { SignInResultDto } from '@core/auth/application/dto/sign-in-result.dto'
import { AuthPresenter } from '@core/auth/application/presenter/auth.presenter'

export class RefreshTokenUseCase extends UseCase {
  constructor(
    private repository: AuthTypeOrmRepository<AuthEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super()
  }

  async execute({
    id,
    refreshToken
  }): Promise<SignInResultDto | NotificationError> {
    const resultFindById = await this.repository.findById(id)
    if (!resultFindById || !resultFindById.refreshToken)
      return Promise.reject(
        new NotificationError(
          'Refresh Token Inexistente',
          HttpErrorCode.FORBIDDEN
        )
      )
    const refreshTokenMatches = await argon2.verify(
      resultFindById.refreshToken,
      refreshToken
    )
    if (!refreshTokenMatches)
      return Promise.reject(
        new NotificationError('Refresh Token Inválido', HttpErrorCode.FORBIDDEN)
      )
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: resultFindById.id,
          authname: resultFindById.email
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION')
        }
      ),
      this.jwtService.signAsync(
        {
          sub: resultFindById.id,
          authname: resultFindById.email
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d'
        }
      )
    ])
    const hashedToken = await argon2.hash(newRefreshToken)
    const entityUpdated = await AuthPresenter.dataToEntity<AuthEntity>(
      {
        ...resultFindById,
        refreshToken: hashedToken
      },
      AuthEntity
    )
    await this.repository.update(entityUpdated)
    const auth = entityUpdated.toJSON()
    return {
      id: auth.id,
      name: auth.name,
      email: auth.email,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
}
