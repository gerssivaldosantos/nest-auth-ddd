import { SearchResult } from '@core/@shared/domain/repository/search-result.repository'
import { describe, it, expect } from 'vitest'
describe('SearchResult Unit Tests', () => {
  it('should set lastPage = 1 when perPage field is greater than total field', () => {
    const result = new SearchResult({
      items: [] as any,
      total: 4,
      currentPage: 1,
      perPage: 15,
      sort: { name: 'asc' }
    })

    expect(result.lastPage).toBe(1)
  })

  it('lastPage prop when total is not a multiple of perPage', () => {
    const result = new SearchResult({
      items: [] as any,
      total: 101,
      currentPage: 1,
      perPage: 20,
      sort: { name: 'asc' }
    })

    expect(result.lastPage).toBe(6)
  })
})
