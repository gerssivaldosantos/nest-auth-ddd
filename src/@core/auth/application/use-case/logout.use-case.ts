import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { HttpErrorCode } from '@core/@shared/application/dto/http.enum'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AuthPresenter } from '@core/auth/application/presenter/auth.presenter'

export class LogoutUseCase extends UseCase {
  constructor (
    private repository: AuthTypeOrmRepository<AuthEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super()
  }

  async execute (id: string): Promise<boolean | NotificationError> {
    const resultFindByEmail = await this.repository.findById(id)
    if (!resultFindByEmail) {
      return Promise.reject(
        new NotificationError('Email não cadastrado', HttpErrorCode.BAD_REQUEST)
      )
    }
    const entityUpdated = await AuthPresenter.dataToEntity<AuthEntity>(
      {
        ...resultFindByEmail,
        refreshToken: null
      },
      AuthEntity
    )
    await this.repository.update(entityUpdated)

    return true
  }
}
