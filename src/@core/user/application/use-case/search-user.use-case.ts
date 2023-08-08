import { UseCase } from '@core/@shared/application/use-case/use-case'
import UserEntity from '@core/user/domain/entities/user.entity'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { SearchResult } from '@core/@shared/domain/repository/search-result.repository'
import { ParserCondition } from '@core/@shared/infra/db/typeorm/parser-condition'
import { SearchDto } from '@core/@shared/application/dto/search.dto'

export class SearchUserUseCase extends UseCase {
  constructor(private repository: UserTypeOrmRepository<UserEntity>) {
    super()
  }

  async execute(data: SearchDto): Promise<SearchResult> {
    const searchParams = new SearchParams(
      {
        ...data,
        include: []
      },
      new ParserCondition()
    )
    return await this.repository.search(searchParams)
  }
}
