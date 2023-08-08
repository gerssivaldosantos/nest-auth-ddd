import { DeleteAuthUseCase } from '@core/auth/application/use-case/delete-auth.use-case'
import { DataSource } from 'typeorm'
import Notification from '@core/@shared/domain/notification/notification'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import AuthEntity from '@core/auth/domain/entities/auth.entity'

jest.setTimeout(10000) // 10 seconds
describe('DeleteAuthUseCase', () => {
  let dataSource: DataSource
  let notification: Notification
  let repository: AuthTypeOrmRepository<AuthEntity>

  beforeEach(async () => {
    notification = new Notification()
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    repository = new AuthTypeOrmRepository(dataSource, notification)
  })

  it('Should delete a valid Auth', async () => {
    jest.spyOn(repository, 'delete').mockImplementation((): Promise<any> => {
      return Promise.resolve(true)
    })
    const useCase = new DeleteAuthUseCase(repository)
    const result = await useCase.execute('1')
    expect(result).toEqual(true)
  })

  it('Should return an error when id is not provided', async () => {
    const useCase = new DeleteAuthUseCase(repository)
    await expect(useCase.execute(undefined)).rejects.toThrowError(
      'id is required'
    )
  })

  it('Should return false when id is not found', async () => {
    jest
      .spyOn(AuthTypeOrmRepository.prototype, 'delete')
      .mockImplementation((): Promise<any> => {
        return Promise.resolve(false)
      })
    const useCase = new DeleteAuthUseCase(repository)
    const result = await useCase.execute('1')
    expect(result).toEqual(false)
  })
})
