import {
  Between,
  Equal,
  FindOperator,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not
} from 'typeorm'
import { ParserConditionInterface } from '@core/@shared/domain/repository/parser-condition-interface'
import { FilterCondition } from '@core/@shared/infra/types'

const OPERATORS = {
  $eq: Equal,
  $lt: LessThan,
  $lte: LessThanOrEqual,
  $gt: MoreThan,
  $gte: MoreThanOrEqual,
  $ne: Not,
  $in: In,
  $notin: (value) => Not(In(value)),
  $isnull: IsNull,
  $notnull: () => Not(IsNull()),
  $cont: (value) => ILike(`%${value}%`),
  $notcont: (value) => Not(ILike(`%${value}%`)),
  $starts: (value) => ILike(`${value}%`),
  $ends: (value) => ILike(`%${value}`),
  $between: (values) => Between(values[0], values[1])
}
export class ParserCondition implements ParserConditionInterface {
  parser (query: FilterCondition[] | FilterCondition) {
    if (Array.isArray(query)) {
      return query.map((q) => this.parser(q))
    }
    const typeOrmFindOptions: FilterCondition = {}
    for (const key in query) {
      if (
        typeof query[key] === 'object' &&
        !(query[key] instanceof FindOperator)
      ) {
        const subQuery: any = query[key]
        if (Object.keys(subQuery).some((k) => k in OPERATORS)) {
          // Handle operators
          for (const opKey in subQuery) {
            const operator = OPERATORS[opKey]
            typeOrmFindOptions[key] = operator(subQuery[opKey])
          }
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        typeOrmFindOptions[key] = Equal(query[key])
      }
    }
    return typeOrmFindOptions
  }
}
