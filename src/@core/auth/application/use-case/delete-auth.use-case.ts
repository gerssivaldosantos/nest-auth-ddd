import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'

export class DeleteAuthUseCase extends UseCase {
  constructor(private repository: AuthTypeOrmRepository<AuthEntity>) {
    super()
  }

  async execute(id: string): Promise<boolean> {
    return this.repository.delete(id)
  }
}
