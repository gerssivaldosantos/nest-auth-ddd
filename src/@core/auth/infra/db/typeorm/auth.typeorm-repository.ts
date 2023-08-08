import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { AuthRepositoryInterface } from '@core/auth/domain/repository/auth.repository.interface'
import { TypeOrmRepository } from '@core/@shared/infra/db/typeorm/typeorm-repository'
import NotificationInterface from '@core/@shared/domain/notification/notification.interface'
import { AuthTypeOrmEntitySchema } from '@core/auth/infra/db/typeorm/auth.typeorm-entity.schema'
import { DataSource } from 'typeorm'

export class AuthTypeOrmRepository<E extends AuthEntity>
  extends TypeOrmRepository<E>
  implements AuthRepositoryInterface
{
  constructor(dataSources: DataSource, notification: NotificationInterface) {
    super(dataSources, notification, AuthTypeOrmEntitySchema, AuthEntity)
  }
}
