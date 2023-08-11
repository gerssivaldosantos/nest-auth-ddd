import Notification from '@core/@shared/domain/notification/notification'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { DataSource } from 'typeorm'
import { UpdateAuthUseCase } from '@core/auth/application/use-case/update-auth.use-case'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import AuthEntity from '@core/auth/domain/entities/auth.entity'
import { AuthFakerDatabuilder } from '@core/auth/domain/entities/auth.faker.databuilder'
import NotificationError from '@core/@shared/domain/notification/notification.error'

jest.setTimeout(10000) // 10 seconds
describe('UpdateAuthUseCase', () => {
  let dataSource: DataSource
  let notification: Notification
  let repository: AuthTypeOrmRepository<AuthEntity>

  beforeEach(async () => {
    notification = new Notification()
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    repository = new AuthTypeOrmRepository(dataSource, notification)
  })

  it('Should update an Auth', async () => {
    const inputData = new AuthFakerDatabuilder().buildValid()
    jest.spyOn(repository, 'update').mockImplementation((): Promise<any> => {
      const entity = new AuthEntity(inputData, notification)
      return Promise.resolve(entity)
    })
    const useCase = new UpdateAuthUseCase(repository)
    const updated = await useCase.execute(inputData)
    expect(updated).toMatchObject(inputData)
  })

  it('Should return an error when trying to update an Auth with invalid fill field', async () => {
    const builder = new AuthFakerDatabuilder()
    const fieldName = builder.getRandomField().name
    const inputData = builder.buildInValid([fieldName])
    const useCase = new UpdateAuthUseCase(repository)
    await expect(useCase.execute(inputData)).rejects.toThrowError(
      NotificationError
    )
  })
})
