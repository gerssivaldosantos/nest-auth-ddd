import { EntityInterface } from '@core/@shared/domain/entity/entity.interface'
import NotificationInterface from '@core/@shared/domain/notification/notification.interface'
import { SearchResult } from '@core/@shared/domain/repository/search-result.repository'
import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { FilterCondition } from '@core/@shared/infra/types'

export interface BaseRepositoryInterface {
  notification: NotificationInterface
}
export interface RepositoryInsertInterface<E extends EntityInterface>
  extends BaseRepositoryInterface {
  insert(entity: E): Promise<EntityInterface>
}

export interface RepositoryUpdateInterface<E extends EntityInterface>
  extends BaseRepositoryInterface {
  update(entity: E): Promise<EntityInterface>
}

export interface RepositoryDeleteInterface extends BaseRepositoryInterface {
  delete(id: number | string): Promise<boolean>
}

export interface RepositorySearchInterface extends BaseRepositoryInterface {
  findById(id: string | number): Promise<EntityInterface | null>
  search<E extends new (...args: any[]) => any>(
    props: SearchParams<FilterCondition>,
    EntityClass: E
  ): Promise<SearchResult>
  executeSQL(sql: string): Promise<any>
}

export interface RepositoryInterface<E extends EntityInterface>
  extends RepositoryInsertInterface<E>,
    RepositoryUpdateInterface<E>,
    RepositoryDeleteInterface,
    RepositorySearchInterface {}
