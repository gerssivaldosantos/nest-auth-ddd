import { AuthPresenter } from '@core/auth/application/presenter/auth.presenter'
import { describe, it, expect } from 'vitest'

describe('AuthPresenter', () => {
  it('should have a method entityToData', async () => {
    expect(AuthPresenter).toHaveProperty('entityToData')
  })
  it('should have a method dataToEntity', async () => {
    expect(AuthPresenter).toHaveProperty('dataToEntity')
  })
})
