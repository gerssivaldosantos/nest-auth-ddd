import AuthEntity from './auth.entity'
import Notification from '../../../@shared/domain/notification/notification'
import NotificationInterface from '@core/@shared/domain/notification/notification.interface'
import { AuthFakerDatabuilder } from '@core/auth/domain/entities/auth.faker.databuilder'

let notification: NotificationInterface
const builder = new AuthFakerDatabuilder()
beforeEach(async () => {
  notification = new Notification()
})

describe('AuthEntity', () => {
  it('Should return an instance of AuthEntity', () => {
    const validInput = new AuthFakerDatabuilder().buildValid()
    const entity = new AuthEntity(validInput, notification)
    expect(entity).toBeInstanceOf(AuthEntity)
  })

  it('Should return an instance of AuthEntity with null ID', () => {
    const validInput = new AuthFakerDatabuilder().buildValid()
    delete validInput.id
    const entity = new AuthEntity(validInput, notification)
    expect(entity).toBeInstanceOf(AuthEntity)
  })

  it('Should return an exception when id is invalid', async () => {
    const inputData = new AuthFakerDatabuilder().buildValid()
    inputData.id = 1
    const notification = new Notification()
    const entity = new AuthEntity(inputData, notification)
    await entity.validate()
    expect(entity.notification.getErrors().id.invalid).toBeTruthy()
  })

  it('Should return an notification error when a field is invalid', async () => {
    const fieldsToIgnore = []
    const propertiesKeys = Object.keys(builder.buildValid()).filter(
      (key) => !fieldsToIgnore.includes(key)
    )
    for (const key of propertiesKeys) {
      const notification = new Notification()
      const inputInvalidData = builder.buildInValid([key])
      const entity = new AuthEntity(inputInvalidData, notification)
      await entity.validate()
      expect(entity.notification.getErrors()).toHaveProperty(key)
      expect(entity.notification.getErrors()[key].invalid).toBeTruthy()
    }
  })

  it('Should return an instance of AuthEntity using getPlainClass', () => {
    const inputData = new AuthFakerDatabuilder().buildValid()
    const notification = new Notification()
    const entity = new AuthEntity(inputData, notification)
    const ClassPlain = entity.getPlainClass()
    const AuthClassPlain = new ClassPlain(inputData)
    expect(AuthClassPlain).toBeInstanceOf(AuthEntity)
  })
})
