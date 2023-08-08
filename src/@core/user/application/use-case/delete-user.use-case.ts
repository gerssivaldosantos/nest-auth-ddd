import UserEntity from '@core/user/domain/entities/user.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'

export class DeleteUserUseCase extends UseCase {
  constructor(private repository: UserTypeOrmRepository<UserEntity>) {
    super()
  }

  async execute(id: string): Promise<boolean> {
    return this.repository.delete(id)
  }
}
