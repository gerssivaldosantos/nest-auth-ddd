import { CreateUserUseCase } from '@core/user/application/use-case/create-user.use-case'
import Notification from '@core/@shared/domain/notification/notification'
import { UserCreateDto } from '@core/user/application/dto/user-create.dto'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { DataSource } from 'typeorm'
import UserEntity from '@core/user/domain/entities/user.entity'
import crypto from 'crypto'
import { UserFakerDatabuilder } from '@core/user/domain/entities/user.faker.databuilder'
import NotificationError from '@core/@shared/domain/notification/notification.error'
const builder = new UserFakerDatabuilder().buildValid()

jest.setTimeout(10000) // 10 seconds
describe('CreateUserUseCase', () => {
  let dataSource: DataSource
  let notification: Notification
  let repository: UserTypeOrmRepository<UserEntity>

  beforeEach(async () => {
    notification = new Notification()
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    repository = new UserTypeOrmRepository(dataSource, notification)
  })

  it('Should insert a valid user', async () => {
    const inputData: UserCreateDto = {
      ...new UserFakerDatabuilder().buildValid()
    }
    const id = crypto.randomUUID()
    jest.spyOn(repository, 'insert').mockImplementation((): Promise<any> => {
      const data = {
        id,
        ...inputData
      }
      const entity = new UserEntity(data, notification)
      return Promise.resolve(entity)
    })

    const useCase = new CreateUserUseCase(repository)
    const inserted = await useCase.execute(inputData)
    const expectResult = {
      id,
      ...inputData
    }
    expect(inserted).toMatchObject(expectResult)
  })

  it('Should return an error on try to create an invalid user', async () => {
    for (const field of builder.fields) {
      builder.setInValidField(field)
      const inputData: UserCreateDto = {
        ...builder
      }
      const useCase = new CreateUserUseCase(repository)
      await useCase
        .execute(inputData)
        .catch(async (response: NotificationError) => {
          const notification = new Notification()
          const mockEntity = new UserEntity(inputData, notification)
          await mockEntity.validate()
          const { message, code } = response
          expect(message).toEqual(
            mockEntity.notification.getPlainMessageErrors()
          )
          expect(code).toEqual(422)
        })
    }
  })
})
