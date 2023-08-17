import { CreateAuthUseCase } from '@core/auth/application/use-case/create-auth.use-case'
import Notification from '@core/@shared/domain/notification/notification'
import { AuthCreateDto } from '@core/auth/application/dto/auth-create.dto'
import { AuthTypeOrmRepository } from '@core/auth/infra/db/typeorm/auth.typeorm-repository'
import { TypeOrmFactory } from '@core/@shared/infra/db/typeorm/datasource'
import { DataSource } from 'typeorm'
import AuthEntity from '@core/auth/domain/entities/auth.entity'
import crypto from 'crypto'
import { AuthFakerDatabuilder } from '@core/auth/domain/entities/auth.faker.databuilder'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { describe, it, beforeEach, expect, vi } from 'vitest'
const builder = new AuthFakerDatabuilder().buildValid()

describe('CreateAuthUseCase', () => {
  let dataSource: DataSource
  let notification: Notification
  let repository: AuthTypeOrmRepository<AuthEntity>

  beforeEach(async () => {
    notification = new Notification()
    dataSource = await TypeOrmFactory.getDataSourceInstance('.env.test')
    repository = new AuthTypeOrmRepository(dataSource, notification)
  })

  it('Should insert a valid auth', async () => {
    const inputData: AuthCreateDto = {
      ...new AuthFakerDatabuilder().buildValid()
    }
    const id = crypto.randomUUID()
    vi.spyOn(repository, 'insert').mockImplementation((): Promise<any> => {
      const data = {
        id,
        ...inputData
      }
      const entity = new AuthEntity(data, notification)
      return Promise.resolve(entity)
    })

    const useCase = new CreateAuthUseCase(repository)
    const inserted = await useCase.execute(inputData)
    const expectResult = {
      id,
      ...inputData
    }
    expect(inserted).toMatchObject(expectResult)
  })

  it('Should return an error on try to create an invalid auth', async () => {
    for (const field of builder.fields) {
      builder.setInValidField(field)
      const inputData: AuthCreateDto = {
        ...builder
      }
      const useCase = new CreateAuthUseCase(repository)
      await useCase.execute(inputData).catch(async (response: NotificationError) => {
        const notification = new Notification()
        const mockEntity = new AuthEntity(inputData, notification)
        await mockEntity.validate()
        const { message, code } = response
        expect(message).toEqual(mockEntity.notification.getPlainMessageErrors())
        expect(code).toEqual(422)
      })
    }
  })
})
