import { Entity } from '@core/@shared/domain/entity/entity'
import { SortParam } from '@core/@shared/infra/types'

export type SearchResultProps<E extends Entity> = {
  items: E[]
  total: number
  currentPage: number
  perPage: number
  sort: SortParam
}

export class SearchResult<E extends Entity = Entity> {
  readonly items: E[]
  readonly total: number
  readonly currentPage: number
  readonly perPage: number
  readonly lastPage: number
  readonly sort: SortParam

  constructor(props: SearchResultProps<E>) {
    this.items = props.items
    this.total = props.total
    this.currentPage = props.currentPage
    this.perPage = props.perPage
    this.lastPage = Math.ceil(this.total / this.perPage)
    this.sort = props.sort
  }
}
