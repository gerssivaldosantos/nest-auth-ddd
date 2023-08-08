import UserEntity from '@core/user/domain/entities/user.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { EntityInterface } from '@core/@shared/domain/entity/entity.interface'

export class FindByIdUserUseCase extends UseCase {
  constructor(private repository: UserTypeOrmRepository<UserEntity>) {
    super()
  }

  async execute(id: string): Promise<EntityInterface | null> {
    return this.repository.findById(id)
  }
}
