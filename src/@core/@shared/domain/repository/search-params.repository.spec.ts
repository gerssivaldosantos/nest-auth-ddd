import { SearchParams } from '@core/@shared/domain/repository/search-params.repository'
import { ParserConditionInterface } from '@core/@shared/domain/repository/parser-condition-interface'
import { FilterCondition } from '@core/@shared/infra/types'
import { describe, it, expect } from 'vitest'
class Parser implements ParserConditionInterface {
  parser (filter: FilterCondition) {
    return filter
  }
}

const parser = new Parser()
describe('SearchParams Unit Tests', () => {
  it('page prop', () => {
    const params = new SearchParams({}, parser)
    expect(params.page).toBe(1)

    const arrange = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: '', expected: 1 },
      { page: 'fake', expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 5.5, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },

      { page: 1, expected: 1 },
      { page: 2, expected: 2 }
    ]

    arrange.forEach((i) => {
      const params = new SearchParams({ page: i.page as any }, parser)
      expect(params.page).toBe(i.expected)
    })
  })

  it('perPage prop', () => {
    const params = new SearchParams({}, parser)
    expect(params.perPage).toBe(15)

    // TODO refactor to it.each
    const arrange = [
      { perPage: null, expected: 15 },
      { perPage: undefined, expected: 15 },
      { perPage: '', expected: 15 },
      { perPage: 'fake', expected: 15 },
      { perPage: 0, expected: 15 },
      { perPage: -1, expected: 15 },
      { perPage: 5.5, expected: 15 },
      { perPage: true, expected: 15 },
      { perPage: false, expected: 15 },
      { perPage: {}, expected: 15 },

      { perPage: 1, expected: 1 },
      { perPage: 2, expected: 2 },
      { perPage: 10, expected: 10 }
    ]

    arrange.forEach((i) => {
      expect(
        new SearchParams({ perPage: i.perPage as any }, parser).perPage
      ).toBe(i.expected)
    })
  })

  it('sort prop', () => {
    const params = new SearchParams({}, parser)
    expect(params.sort).toBeNull()

    const arrange = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
      { sort: { name: 'asc' }, expected: { name: 'asc' } }
    ]

    arrange.forEach((i) => {
      expect(new SearchParams({ sort: i.sort as any }, parser).sort).toEqual(
        i.expected
      )
    })
  })

  it('Pass ignorePaging = true', () => {
    const params = new SearchParams({ ignorePaging: true, page: 15 }, parser)
    expect(params.ignorePaging).toBeTruthy()
    expect(params.page).toBe(undefined)
  })

  it('Pass ignorePaging = false', () => {
    const params = new SearchParams({ ignorePaging: false, page: 15 }, parser)
    expect(params.ignorePaging).toBeFalsy()
    expect(params.page).toBe(15)
  })
})
