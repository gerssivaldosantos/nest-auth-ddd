import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { AuthUpdateDto } from '@core/auth/application/dto/auth-update.dto'
import { AuthPresenter } from '@core/auth/application/presenter/auth.presenter'
import { AuthUpdateResultDto } from '@core/auth/application/dto/auth-update-result.dto'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import NotificationError from '@core/@shared/domain/notification/notification.error'

export class UpdateAuthUseCase extends UseCase {
  constructor(private repository: AuthTypeOrmRepository<AuthEntity>) {
    super()
  }

  async execute(
    data: AuthUpdateDto
  ): Promise<AuthUpdateResultDto | NotificationError> {
    const dataWithDate = { ...data, updatedAt: new Date().toISOString() }
    const entity: AuthEntity = await AuthPresenter.dataToEntity<AuthEntity>(
      dataWithDate,
      AuthEntity
    )
    if (entity.notification.hasError()) {
      return Promise.reject(
        new NotificationError(entity.notification.getPlainMessageErrors())
      )
    } else {
      const AuthUpdate = await this.repository.update(entity)
      return AuthPresenter.entityToData(AuthUpdate)
    }
  }
}
