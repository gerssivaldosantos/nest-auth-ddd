import Notification from '@core/@shared/domain/notification/notification'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { DataSource } from 'typeorm'
import UserEntity from '@core/user/domain/entities/user.entity'
import { SearchUserUseCase } from '@core/user/application/use-case/search-user.use-case'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { SearchDto } from '@core/@shared/application/dto/search.dto'
import { UserFakerDatabuilder } from '@core/user/domain/entities/user.faker.databuilder'

jest.setTimeout(10000) // 10 seconds
describe('SearchUserUseCase', () => {
  let dataSource: DataSource
  let notification: Notification
  let repository: UserTypeOrmRepository<UserEntity>

  beforeEach(async () => {
    notification = new Notification()
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    repository = new UserTypeOrmRepository(dataSource, notification)
  })

  it('Should search a valid User using filter', async () => {
    const fakeData = new UserFakerDatabuilder().buildValid()
    const fieldName = fakeData.getRandomField()
    const expression = {}
    expression[fieldName.name] = { $ne: 'foo' }
    const searchInput: SearchDto = {
      filter: [expression]
    }
    jest.spyOn(repository, 'search').mockImplementation((): Promise<any> => {
      return Promise.resolve({
        items: [fakeData],
        total: 1,
        currentPage: 1,
        perPage: 15,
        lastPage: 1,
        sort: null
      })
    })

    const useCase = new SearchUserUseCase(repository)
    const found = await useCase.execute(searchInput)
    const dataReturned = {
      items: [fakeData],
      total: 1,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
      sort: null
    }
    expect(found).toMatchObject(dataReturned)
  })

  it('Should return an error on invalid search', async () => {
    const searchInput: SearchDto = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filter: ['s']
    }

    const useCase = new SearchUserUseCase(repository)
    await expect(useCase.execute(searchInput)).rejects.toBeInstanceOf(
      NotificationError
    )
  })

  it('Should return a empty Search when not found', async () => {
    const fakeData = new UserFakerDatabuilder().buildValid()
    const fieldName = fakeData.getRandomField()
    const expression = {}
    expression[fieldName.name] = { $eq: 'foo' }
    const searchInput: SearchDto = {
      filter: [expression]
    }
    jest.spyOn(repository, 'search').mockImplementation((): Promise<any> => {
      return Promise.resolve({
        items: [],
        total: 0,
        currentPage: 1,
        perPage: 15,
        lastPage: 1,
        sort: null
      })
    })

    const useCase = new SearchUserUseCase(repository)
    const found = await useCase.execute(searchInput)
    const dataReturned = {
      items: [],
      total: 0,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
      sort: null
    }
    expect(found).toMatchObject(dataReturned)
  })
})
