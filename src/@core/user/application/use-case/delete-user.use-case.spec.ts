import { DeleteUserUseCase } from '@core/user/application/use-case/delete-user.use-case'
import { DataSource } from 'typeorm'
import Notification from '@core/@shared/domain/notification/notification'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import UserEntity from '@core/user/domain/entities/user.entity'

jest.setTimeout(10000) // 10 seconds
describe('DeleteUserUseCase', () => {
  let dataSource: DataSource
  let notification: Notification
  let repository: UserTypeOrmRepository<UserEntity>

  beforeEach(async () => {
    notification = new Notification()
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    repository = new UserTypeOrmRepository(dataSource, notification)
  })

  it('Should delete a valid User', async () => {
    jest.spyOn(repository, 'delete').mockImplementation((): Promise<any> => {
      return Promise.resolve(true)
    })
    const useCase = new DeleteUserUseCase(repository)
    const result = await useCase.execute('1')
    expect(result).toEqual(true)
  })

  it('Should return an error when id is not provided', async () => {
    const useCase = new DeleteUserUseCase(repository)
    await expect(useCase.execute(undefined)).rejects.toThrowError(
      'id is required'
    )
  })

  it('Should return false when id is not found', async () => {
    jest
      .spyOn(UserTypeOrmRepository.prototype, 'delete')
      .mockImplementation((): Promise<any> => {
        return Promise.resolve(false)
      })
    const useCase = new DeleteUserUseCase(repository)
    const result = await useCase.execute('1')
    expect(result).toEqual(false)
  })
})
