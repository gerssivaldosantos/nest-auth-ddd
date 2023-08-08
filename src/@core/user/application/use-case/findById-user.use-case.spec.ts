import { FindByIdUserUseCase } from '@core/user/application/use-case/findById-user.use-case'
import Notification from '@core/@shared/domain/notification/notification'
import UserEntity from '@core/user/domain/entities/user.entity'
import { SearchResult } from '@core/@shared/domain/repository/search-result.repository'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { DataSource } from 'typeorm'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { UserFakerDatabuilder } from '@core/user/domain/entities/user.faker.databuilder'

let notification: Notification
let entity: UserEntity
let result: SearchResult
let dataSource: DataSource
let repository: UserTypeOrmRepository<UserEntity>

jest.setTimeout(10000) // 10 seconds
describe('FindByIdUserUseCase', () => {
  beforeAll(async () => {
    notification = new Notification()
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    repository = new UserTypeOrmRepository(dataSource, notification)
    entity = new UserEntity(
      new UserFakerDatabuilder().buildValid(),
      notification
    )
    result = new SearchResult<UserEntity>({
      items: [entity],
      total: 1,
      perPage: 1,
      currentPage: 1,
      sort: {}
    })
  })

  it('Should get an User', async () => {
    jest
      .spyOn(repository, 'findById')
      .mockImplementation(async (): Promise<any> => {
        return Promise.resolve(result)
      })
    const useCase = new FindByIdUserUseCase(repository)
    expect(await useCase.execute('1')).toEqual(result)
  })

  it('Should return a SearchResult when User not found', async () => {
    jest
      .spyOn(repository, 'findById')
      .mockImplementation(async (): Promise<any> => {
        const result: SearchResult = new SearchResult<UserEntity>({
          items: [],
          total: 0,
          perPage: 1,
          currentPage: 1,
          sort: {}
        })
        return Promise.resolve(result)
      })
    const useCase = new FindByIdUserUseCase(repository)
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
          context: 'User',
          target: 'findById',
          value: undefined
        })
        return Promise.reject(
          new NotificationError(notification.getPlainMessageErrors())
        )
      })
    const useCase = new FindByIdUserUseCase(repository)
    await expect(useCase.execute(undefined)).rejects.toThrowError(
      'O campo ID é obrigatório'
    )
  })
})
