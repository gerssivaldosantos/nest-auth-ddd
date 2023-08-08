import UserEntity from '@core/user/domain/entities/user.entity'
import { UserUpdateDto } from '@core/user/application/dto/user-update.dto'
import { UserPresenter } from '@core/user/application/presenter/user.presenter'
import { UserUpdateResultDto } from '@core/user/application/dto/user-update-result.dto'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import NotificationError from '@core/@shared/domain/notification/notification.error'

export class UpdateUserUseCase extends UseCase {
  constructor(private repository: UserTypeOrmRepository<UserEntity>) {
    super()
  }

  async execute(
    data: UserUpdateDto
  ): Promise<UserUpdateResultDto | NotificationError> {
    const dataWithDate = { ...data, updatedAt: new Date().toISOString() }
    const entity: UserEntity = await UserPresenter.dataToEntity<UserEntity>(
      dataWithDate,
      UserEntity
    )
    if (entity.notification.hasError()) {
      return Promise.reject(
        new NotificationError(entity.notification.getPlainMessageErrors())
      )
    } else {
      const UserUpdate = await this.repository.update(entity)
      return UserPresenter.entityToData(UserUpdate)
    }
  }
}
