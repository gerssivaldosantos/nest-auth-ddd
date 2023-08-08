/* eslint-disable no-unused-vars */
import Notification from '@core/@shared/domain/notification/notification'
import { Presenter } from '@core/@shared/application/presenter/presenter'
import { Entity } from '@core/@shared/domain/entity/entity'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'
import NotificationInterface from '@core/@shared/domain/notification/notification.interface'

export class TestPresenter extends Presenter {}

export type TestInput = {
  id?: string | null
  name: string
  email: string
}

export class TestEntity extends Entity {
  @IsNotEmpty({
    message: 'Nome é obrigatório'
  })
  @IsString({
    message: 'Nome deve ser um texto'
  })
  @MinLength(3, {
    message: 'Nome deve ter pelo menos 3 letras'
  })
  name: string

  @IsEmail(
    {},
    {
      message: 'Email inválido'
    }
  )
  @IsOptional()
  email: string | null

  getPlainClass(): any {
    return TestEntity
  }

  constructor(test: TestInput, notification: NotificationInterface) {
    super(notification, test?.id || null)
    this.name = test?.name
    this.email = test?.email
  }
}

describe('Common Presenter', () => {
  it('should convert data to entity', async () => {
    const inputData = {
      id: '1',
      name: 'John',
      email: 'john@example.com'
    }
    const entity = await TestPresenter.dataToEntity<TestEntity>(
      inputData,
      TestEntity
    )
    expect(entity).toBeInstanceOf(TestEntity)
  })

  it('should get an error when try to convert invalid data to entity', async () => {
    const inputData = {
      id: '1',
      email: 'john@example.com'
    }
    const entity: TestEntity = await TestPresenter.dataToEntity(
      inputData,
      TestEntity
    )
    expect(entity.notification.hasError()).toBeTruthy()
    expect(entity.notification.getPlainMessageErrors()).toEqual(
      'Nome deve ter pelo menos 3 letras, Nome deve ser um texto, Nome é obrigatório'
    )
  })

  it('should convert entity to data', async () => {
    const notification = new Notification()
    const entity: TestEntity = new TestEntity(
      {
        id: '1',
        name: 'John',
        email: 'john@example.com'
      },
      notification
    )
    const inputData = {
      id: '1',
      name: 'John',
      email: 'john@example.com'
    }
    await expect(TestPresenter.entityToData(entity)).toEqual(inputData)
  })

  it('should convert a regular object into a flatObject', () => {
    const regularObject = {
      car: 'Honda',
      model: 'Civic'
    }
    expect(TestPresenter.flatObject(regularObject)).toEqual(regularObject)
  })
  it('should convert a nested object into a flatObject', () => {
    const regularObject = {
      car: 'Honda',
      model: 'Civic',
      type: {
        coupe: true,
        sedan: false
      }
    }
    expect(TestPresenter.flatObject(regularObject)).toEqual({
      car: 'Honda',
      model: 'Civic',
      'type.coupe': true,
      'type.sedan': false
    })
  })
})
