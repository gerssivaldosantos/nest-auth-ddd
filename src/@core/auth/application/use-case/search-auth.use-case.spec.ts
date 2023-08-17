import Notification from '@core/@shared/domain/notification/notification'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { DataSource } from 'typeorm'
import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { SearchAuthUseCase } from '@core/auth/application/use-case/search-auth.use-case'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { SearchDto } from '@core/@shared/application/dto/search.dto'
import { AuthFakerDatabuilder } from '@core/auth/domain/entities/auth.faker.databuilder'
import { describe, it, beforeEach, expect, vi } from 'vitest'

describe('SearchAuthUseCase', () => {
  let dataSource: DataSource
  let notification: Notification
  let repository: AuthTypeOrmRepository<AuthEntity>

  beforeEach(async () => {
    notification = new Notification()
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    repository = new AuthTypeOrmRepository(dataSource, notification)
  })

  it('Should search a valid Auth using filter', async () => {
    const fakeData = new AuthFakerDatabuilder().buildValid()
    const fieldName = fakeData.getRandomField()
    const expression = {}
    expression[fieldName.name] = { $ne: 'foo' }
    const searchInput: SearchDto = {
      filter: [expression]
    }
    vi.spyOn(repository, 'search').mockImplementation((): Promise<any> => {
      return Promise.resolve({
        items: [fakeData],
        total: 1,
        currentPage: 1,
        perPage: 15,
        lastPage: 1,
        sort: null
      })
    })

    const useCase = new SearchAuthUseCase(repository)
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

    const useCase = new SearchAuthUseCase(repository)
    await expect(useCase.execute(searchInput)).rejects.toBeInstanceOf(
      NotificationError
    )
  })

  it('Should return a empty Search when not found', async () => {
    const fakeData = new AuthFakerDatabuilder().buildValid()
    const fieldName = fakeData.getRandomField()
    const expression = {}
    expression[fieldName.name] = { $eq: 'foo' }
    const searchInput: SearchDto = {
      filter: [expression]
    }
    vi.spyOn(repository, 'search').mockImplementation((): Promise<any> => {
      return Promise.resolve({
        items: [],
        total: 0,
        currentPage: 1,
        perPage: 15,
        lastPage: 1,
        sort: null
      })
    })

    const useCase = new SearchAuthUseCase(repository)
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
