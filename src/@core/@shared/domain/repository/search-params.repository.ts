import { ParserConditionInterface } from '@core/@shared/domain/repository/parser-condition-interface'
import {
  includeConfig,
  SearchProps,
  SortParam
} from '@core/@shared/infra/types'

export class SearchParams<FilterCondition> {
  protected _page
  protected _perPage = 15
  protected _sort: SortParam
  protected _filter: any
  protected _include: includeConfig[]
  private _attributes: string[]
  ignorePaging: boolean

  constructor(
    props: SearchProps<FilterCondition>,
    private filterParser: ParserConditionInterface
  ) {
    this.ignorePaging = props.ignorePaging || false
    this.page = props.page
    this.perPage = props.perPage
    this.sort = props.sort || null
    this.include = props.include
    this.attributes = props.attributes
    if (props.filter && this.filterParser) {
      this.filter = props.filter
    }
  }

  get page() {
    return this._page
  }

  private set page(value: number) {
    let _page = +value

    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1
    }

    this._page = !this.ignorePaging ? _page : undefined
  }

  get perPage() {
    return this._perPage
  }

  private set perPage(value: number) {
    let _perPage = value === (true as any) ? this._perPage : +value

    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage
    }

    this._perPage = !this.ignorePaging ? _perPage : undefined
  }

  get sort(): SortParam {
    return this._sort
  }

  private set sort(value: SortParam) {
    this._sort = value === null || value === undefined ? null : value
  }

  get filter(): any {
    return this._filter
  }

  private set filter(value: FilterCondition) {
    if (value) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._filter = this.filterParser.parser(value)
    }
  }

  get include(): includeConfig[] {
    return this._include
  }

  private set include(value: includeConfig[]) {
    if (Array.isArray(value)) {
      this._include = value
    }
  }

  get attributes(): string[] {
    return this._attributes
  }

  set attributes(value: string[]) {
    this._attributes = value
  }
}
