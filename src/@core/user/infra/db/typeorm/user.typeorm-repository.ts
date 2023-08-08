import UserEntity from '@core/user/domain/entities/user.entity'
import { UserRepositoryInterface } from '@core/user/domain/repository/user.repository.interface'
import { TypeOrmRepository } from '@core/@shared/infra/db/typeorm/typeorm-repository'
import NotificationInterface from '@core/@shared/domain/notification/notification.interface'
import { UserTypeOrmEntitySchema } from '@core/user/infra/db/typeorm/user.typeorm-entity.schema'
import { DataSource } from 'typeorm'

export class UserTypeOrmRepository<E extends UserEntity>
  extends TypeOrmRepository<E>
  implements UserRepositoryInterface
{
  constructor(dataSources: DataSource, notification: NotificationInterface) {
    super(dataSources, notification, UserTypeOrmEntitySchema, UserEntity)
  }
}
