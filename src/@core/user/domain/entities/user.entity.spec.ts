import UserEntity from './user.entity'
import Notification from '../../../@shared/domain/notification/notification'
import NotificationInterface from '@core/@shared/domain/notification/notification.interface'
import { UserFakerDatabuilder } from '@core/user/domain/entities/user.faker.databuilder'

let notification: NotificationInterface
const builder = new UserFakerDatabuilder()
beforeEach(async () => {
  notification = new Notification()
})

describe('UserEntity', () => {
  it('Should return an instance of UserEntity', () => {
    const validInput = new UserFakerDatabuilder().buildValid()
    const entity = new UserEntity(validInput, notification)
    expect(entity).toBeInstanceOf(UserEntity)
  })

  it('Should return an instance of UserEntity with null ID', () => {
    const validInput = new UserFakerDatabuilder().buildValid()
    delete validInput.id
    const entity = new UserEntity(validInput, notification)
    expect(entity).toBeInstanceOf(UserEntity)
  })

  it('Should return an exception when id is invalid', async () => {
    const inputData = new UserFakerDatabuilder().buildValid()
    inputData.id = 1
    const notification = new Notification()
    const entity = new UserEntity(inputData, notification)
    await entity.validate()
    expect(entity.notification.getErrors().id.invalid).toBeTruthy()
  })

  it('Should return an notification error when a field is invalid', async () => {
    const fieldsToIgnore = [
      'updatedAt',
      'createdAt',
      'password',
      'refreshToken',
      'refreshTokenExpiration'
    ]
    const propertiesKeys = Object.keys(builder.buildValid()).filter(
      (key) => !fieldsToIgnore.includes(key)
    )
    for (const key of propertiesKeys) {
      const notification = new Notification()
      const inputInvalidData = builder.buildInValid([key])
      const entity = new UserEntity(inputInvalidData, notification)
      await entity.validate()
      expect(entity.notification.getErrors()).toHaveProperty(key)
      expect(entity.notification.getErrors()[key].invalid).toBeTruthy()
    }
  })

  it('Should return an instance of UserEntity using getPlainClass', () => {
    const inputData = new UserFakerDatabuilder().buildValid()
    const notification = new Notification()
    const entity = new UserEntity(inputData, notification)
    const ClassPlain = entity.getPlainClass()
    const UserClassPlain = new ClassPlain(inputData)
    expect(UserClassPlain).toBeInstanceOf(UserEntity)
  })

  it('Should return an instance of UserEntity with createdAt value when pass createdAt as parameter', () => {
    const validInput = new UserFakerDatabuilder().buildValid()
    validInput.createdAt = '2023-07-22T08:56:06.223Z'
    const entity = new UserEntity(validInput, notification)
    expect(entity).toBeInstanceOf(UserEntity)
    expect(entity.createdAt).toEqual(validInput.createdAt)
  })

  it('Should return an instance of UserEntity with createdAt value when not pass createdAt as parameter', () => {
    const validInput = new UserFakerDatabuilder().buildValid()
    delete validInput.createdAt
    const entity = new UserEntity(validInput, notification)
    expect(entity).toBeInstanceOf(UserEntity)
    expect(entity.createdAt).toBeDefined()
  })

  it('Should fill updatedAt value when create an instance of UserEntity', () => {
    const validInput = new UserFakerDatabuilder().buildValid()
    const entity = new UserEntity(validInput, notification)
    expect(entity).toBeInstanceOf(UserEntity)
    expect(entity.updatedAt).toBeDefined()
  })

  it('Should not fill updatedAt value when create an instance of UserEntity and pass it as parameter', () => {
    const validInput = new UserFakerDatabuilder().buildValid()
    validInput.updatedAt = '2023-07-22T08:56:06.223Z'
    const entity = new UserEntity(validInput, notification)
    expect(entity).toBeInstanceOf(UserEntity)
    expect(entity.updatedAt).not.toEqual(validInput.updatedAt)
  })
})
