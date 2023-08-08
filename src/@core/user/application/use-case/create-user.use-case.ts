import UserEntity from '@core/user/domain/entities/user.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import { UserCreateDto } from '@core/user/application/dto/user-create.dto'
import { UserPresenter } from '@core/user/application/presenter/user.presenter'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { UserCreateResultDto } from '@core/user/application/dto/user-create-result.dto'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { HttpErrorCode } from '@core/@shared/application/dto/http.enum'

export class CreateUserUseCase extends UseCase {
  constructor(private repository: UserTypeOrmRepository<UserEntity>) {
    super()
  }

  async execute(
    data: UserCreateDto
  ): Promise<UserCreateResultDto | NotificationError> {
    const entity: UserEntity = await UserPresenter.dataToEntity<UserEntity>(
      data,
      UserEntity
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
      const UserInserted = await this.repository.insert(entity)
      return UserPresenter.entityToData(UserInserted)
    }
  }
}
