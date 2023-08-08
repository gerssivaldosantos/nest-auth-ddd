import { FilterCondition } from '@core/@shared/infra/types'

export interface ParserConditionInterface {
  parser(filter: FilterCondition): any
}
