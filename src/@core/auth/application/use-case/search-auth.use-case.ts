import { UseCase } from '@core/@shared/application/use-case/use-case'
import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { SearchResult } from '@core/@shared/domain/repository/search-result.repository'
import { ParserCondition } from '@core/@shared/infra/db/typeorm/parser-condition'
import { SearchDto } from '@core/@shared/application/dto/search.dto'

export class SearchAuthUseCase extends UseCase {
  constructor(private repository: AuthTypeOrmRepository<AuthEntity>) {
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
