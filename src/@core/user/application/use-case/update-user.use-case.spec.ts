import Notification from '@core/@shared/domain/notification/notification'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { DataSource } from 'typeorm'
import { UpdateUserUseCase } from '@core/user/application/use-case/update-user.use-case'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import UserEntity from '@core/user/domain/entities/user.entity'
import { UserFakerDatabuilder } from '@core/user/domain/entities/user.faker.databuilder'
import NotificationError from '@core/@shared/domain/notification/notification.error'

jest.setTimeout(10000) // 10 seconds
describe('UpdateUserUseCase', () => {
  let dataSource: DataSource
  let notification: Notification
  let repository: UserTypeOrmRepository<UserEntity>

  beforeEach(async () => {
    notification = new Notification()
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    repository = new UserTypeOrmRepository(dataSource, notification)
  })

  it('Should update an User', async () => {
    const inputData = new UserFakerDatabuilder().buildValid()
    jest.spyOn(repository, 'update').mockImplementation((): Promise<any> => {
      const entity = new UserEntity(inputData, notification)
      return Promise.resolve(entity)
    })
    const useCase = new UpdateUserUseCase(repository)
    const updated = await useCase.execute(inputData)
    expect(updated).toMatchObject(inputData)
  })

  it('Should return an error when trying to update an User with invalid fill field', async () => {
    const builder = new UserFakerDatabuilder()
    const fieldName = builder.getRandomField().name
    const inputData = builder.buildInValid([fieldName])
    const useCase = new UpdateUserUseCase(repository)
    await expect(useCase.execute(inputData)).rejects.toThrowError(
      NotificationError
    )
  })
})
