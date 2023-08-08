import NotificationError from '@core/@shared/domain/notification/notification.error'
import { NotificationErrorOutput } from '@core/@shared/domain/notification/notification.interface'

describe('Notification error tests', () => {
  it('should return an errors message', () => {
    const notificationResult: Record<string, NotificationErrorOutput> = {
      name: {
        messages: ['notification error'],
        context: 'User',
        invalid: true,
        value: 'joao'
      }
    }
    const notification = new NotificationError(
      'Test error',
      111,
      notificationResult
    )

    expect(notification.errors).toMatchObject(notificationResult)
  })

  it('should return a JSON', () => {
    const notificationResult: Record<string, NotificationErrorOutput> = {
      name: {
        messages: ['notification error'],
        context: 'User',
        invalid: true,
        value: 'joao'
      }
    }
    const notification = new NotificationError(
      'Test error',
      111,
      notificationResult
    )
    const json = notification.toJSON()

    expect(json).toEqual({
      code: 111,
      errors: {
        name: {
          messages: ['notification error'],
          context: 'User',
          invalid: true,
          value: 'joao'
        }
      },
      message: 'Test error'
    })
  })
})
