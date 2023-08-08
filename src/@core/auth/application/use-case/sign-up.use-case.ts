import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import { AuthCreateDto } from '@core/auth/application/dto/auth-create.dto'
import { AuthPresenter } from '@core/auth/application/presenter/auth.presenter'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { AuthCreateResultDto } from '@core/auth/application/dto/auth-create-result.dto'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { HttpErrorCode } from '@core/@shared/application/dto/http.enum'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

export class SignUpUseCase extends UseCase {
  constructor(
    private repository: AuthTypeOrmRepository<AuthEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super()
  }

  async execute(
    data: AuthCreateDto
  ): Promise<AuthCreateResultDto | NotificationError> {
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
      const AuthInserted = await this.repository.insert(entity)
      return AuthPresenter.entityToData(AuthInserted)
    }
  }
}
