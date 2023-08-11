import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { EntityInterface } from '@core/@shared/domain/entity/entity.interface'

export class FindByIdAuthUseCase extends UseCase {
  constructor(private repository: AuthTypeOrmRepository<AuthEntity>) {
    super()
  }

  async execute(id: string): Promise<EntityInterface | null> {
    return this.repository.findById(id)
  }
}
