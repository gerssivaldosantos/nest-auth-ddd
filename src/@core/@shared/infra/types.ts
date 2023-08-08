export enum FilterOperator {
  Equal = '$eq',
  LessThan = '$lt',
  LessThanOrEqual = '$lte',
  MoreThan = '$gt',
  MoreThanOrEqual = '$gte',
  Not = '$ne',
  In = '$in',
  NotIn = '$notin',
  IsNull = '$isnull',
  NotNull = '$notnull',
  Contains = '$cont',
  NotContains = '$notcont',
  Starts = '$starts',
  Ends = '$ends',
  Between = '$between'
}

export type SortDirection = 'asc' | 'desc'

export type PrimitiveType = string | boolean | number

export type FieldCondition = {
  [key: string]:
    | PrimitiveType
    | { [key: string]: PrimitiveType }
    | { [key: string]: Array<PrimitiveType> }
    | Array<{ [key: string]: PrimitiveType }>
}

export type FieldConditionOperator = {
  [key: string]: FieldCondition
}

export type FilterCondition =
  | FieldCondition
  | FieldConditionOperator
  | Array<FieldCondition | Array<FieldCondition>>

export type SortParam = {
  [key: string]: SortDirection
}

export type includeConfig = {
  attributes: string[]
  entity: any
}
export type SearchProps<FilterCondition> = {
  page?: number | 1
  perPage?: number | 15
  sort?: SortParam
  filter?: FilterCondition
  include?: includeConfig[]
  attributes?: string[]
  ignorePaging?: boolean
}
