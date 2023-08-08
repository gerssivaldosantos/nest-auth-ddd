import { UserPresenter } from '@core/user/application/presenter/user.presenter'

describe('UserPresenter', () => {
  it('should have a method entityToData', async () => {
    expect(UserPresenter).toHaveProperty('entityToData')
  })
  it('should have a method dataToEntity', async () => {
    expect(UserPresenter).toHaveProperty('dataToEntity')
  })
})
