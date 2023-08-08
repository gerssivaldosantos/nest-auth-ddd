import { FindByIdAuthUseCase } from '@core/auth/application/use-case/findById-auth.use-case'
import Notification from '@core/@shared/domain/notification/notification'
import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { SearchResult } from '@core/@shared/domain/repository/search-result.repository'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { DataSource } from 'typeorm'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { AuthFakerDatabuilder } from '@core/auth/domain/entities/auth.faker.databuilder'

let notification: Notification
let entity: AuthEntity
let result: SearchResult
let dataSource: DataSource
let repository: AuthTypeOrmRepository<AuthEntity>

jest.setTimeout(10000) // 10 seconds
describe('FindByIdAuthUseCase', () => {
  beforeAll(async () => {
    notification = new Notification()
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    repository = new AuthTypeOrmRepository(dataSource, notification)
    entity = new AuthEntity(
      new AuthFakerDatabuilder().buildValid(),
      notification
    )
    result = new SearchResult<AuthEntity>({
      items: [entity],
      total: 1,
      perPage: 1,
      currentPage: 1,
      sort: {}
    })
  })

  it('Should get an Auth', async () => {
    jest
      .spyOn(repository, 'findById')
      .mockImplementation(async (): Promise<any> => {
        return Promise.resolve(result)
      })
    const useCase = new FindByIdAuthUseCase(repository)
    expect(await useCase.execute('1')).toEqual(result)
  })

  it('Should return a SearchResult when Auth not found', async () => {
    jest
      .spyOn(repository, 'findById')
      .mockImplementation(async (): Promise<any> => {
        const result: SearchResult = new SearchResult<AuthEntity>({
          items: [],
          total: 0,
          perPage: 1,
          currentPage: 1,
          sort: {}
        })
        return Promise.resolve(result)
      })
    const useCase = new FindByIdAuthUseCase(repository)
    const useCaseResult = await useCase.execute('1')
    expect(useCaseResult).toEqual({
      items: [],
      total: 0,
      lastPage: 0,
      perPage: 1,
      currentPage: 1,
      sort: {}
    })
  })

  it('Should return a Notification error when id is not provided', async () => {
    jest
      .spyOn(repository, 'findById')
      .mockImplementation(async (): Promise<any> => {
        const notification = new Notification()
        notification.addError({
          message: 'O campo ID é obrigatório',
          context: 'Auth',
          target: 'findById',
          value: undefined
        })
        return Promise.reject(
          new NotificationError(notification.getPlainMessageErrors())
        )
      })
    const useCase = new FindByIdAuthUseCase(repository)
    await expect(useCase.execute(undefined)).rejects.toThrowError(
      'O campo ID é obrigatório'
    )
  })
})
