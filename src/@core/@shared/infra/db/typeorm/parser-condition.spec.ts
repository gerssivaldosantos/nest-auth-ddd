import { ParserCondition } from '@core/@shared/infra/db/typeorm/parser-condition'
import {
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not
} from 'typeorm'
import { FilterCondition } from '@core/@shared/infra/types'

const parserCondition = new ParserCondition()
describe('Parser condition', () => {
  it('Should return an error when filter is not an array', () => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      parserCondition.parser({})
    } catch (e) {
      expect(e.message).toEqual('filter must be an array')
    }
  })

  it('Should return Equal with $eq', () => {
    const parsed = parserCondition.parser([{ name: { $eq: 'john' } }])
    expect(parsed).toEqual([{ name: Equal('john') }])
  })
  it('Should return Equal when did not enter operator', () => {
    const parsed = parserCondition.parser([{ name: 'john' }])
    expect(parsed).toEqual([{ name: Equal('john') }])
  })
  it('Should return Not Equal', () => {
    const parsed = parserCondition.parser([{ name: { $ne: 'john' } }])
    expect(parsed).toEqual([{ name: Not('john') }])
  })

  it('Should return Contains', () => {
    const parsed = parserCondition.parser([{ name: { $cont: 'john' } }])
    expect(parsed).toEqual([{ name: ILike('%john%') }])
  })

  it('Should return Not Contains', () => {
    const parsed = parserCondition.parser([{ name: { $notcont: 'john' } }])
    expect(parsed).toEqual([{ name: Not(ILike('%john%')) }])
  })

  it('Should return Starts', () => {
    const parsed = parserCondition.parser([{ name: { $starts: 'john' } }])
    expect(parsed).toEqual([{ name: ILike('john%') }])
  })

  it('Should return Ends', () => {
    const parsed = parserCondition.parser([{ name: { $ends: 'john' } }])
    expect(parsed).toEqual([{ name: ILike('%john') }])
  })

  it('Should return IsNull', () => {
    const parsed = parserCondition.parser([{ name: { $isnull: '' } }])
    expect(parsed).toEqual([{ name: IsNull() }])
  })

  it('Should return Not IsNull', () => {
    const parsed = parserCondition.parser([{ name: { $notnull: '' } }])
    expect(parsed).toEqual([{ name: Not(IsNull()) }])
  })

  it('Should return LessThan', () => {
    const parsed = parserCondition.parser([{ name: { $lt: 1 } }])
    expect(parsed).toEqual([{ name: LessThan(1) }])
  })

  it('Should return equal', () => {
    const parsed = parserCondition.parser([{ name: 1 }])
    expect(parsed).toEqual([{ name: Equal(1) }])
  })

  it('Should return LessThanOrEqual', () => {
    const parsed = parserCondition.parser([{ name: { $lte: 1 } }])
    expect(parsed).toEqual([{ name: LessThanOrEqual(1) }])
  })

  it('Should return GreaterThan', () => {
    const parsed = parserCondition.parser([{ name: { $gt: 1 } }])
    expect(parsed).toEqual([{ name: MoreThan(1) }])
  })

  it('Should return MoreThanOrEqual', () => {
    const parsed = parserCondition.parser([{ name: { $gte: 1 } }])
    expect(parsed).toEqual([{ name: MoreThanOrEqual(1) }])
  })

  it('Should return In', () => {
    const parsed = parserCondition.parser([{ name: { $in: [1, 2] } }])
    expect(parsed).toEqual([{ name: In([1, 2]) }])
  })

  it('Should return Not In', () => {
    const parsed = parserCondition.parser([{ name: { $notin: [1, 2] } }])
    expect(parsed).toEqual([{ name: Not(In([1, 2])) }])
  })

  it('Should return Between Date', () => {
    const parsed = parserCondition.parser([
      { name: { $between: ['2022-10-10', '2022-10-11'] } }
    ])
    expect(parsed).toEqual([{ name: Between('2022-10-10', '2022-10-11') }])
  })

  it('Should return complex condition', () => {
    const filter: FilterCondition = [
      { email: { $eq: 'john3@example.com' } },
      { email: { $ne: 'john@example.com' }, name: 'maria' },
      [{ email: 'john@example.com', name: 'John' }]
    ]
    const parsed = parserCondition.parser(filter)
    const expected = [
      { email: Equal('john3@example.com') },
      { email: Not('john@example.com'), name: Equal('maria') },
      [{ email: Equal('john@example.com'), name: Equal('John') }]
    ]
    expect(parsed).toEqual(expected)
  })
})
