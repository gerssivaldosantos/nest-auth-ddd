import Notification from '@core/@shared/domain/notification/notification'
import {
  NotificationErrorInput,
  NotificationErrorOutput
} from '@core/@shared/domain/notification/notification.interface'
import { describe, it, expect } from 'vitest'
describe('Notification tests', () => {
  it('should return an errors message', () => {
    const notification = new Notification()
    const error: NotificationErrorInput = {
      message: 'notification error',
      target: 'name',
      context: 'User',
      value: 'joao'
    }
    notification.addError(error)
    expect(() => {
      notification.getErrors()
    }).toHaveProperty('name')

    const notificationResult: Record<string, NotificationErrorOutput> = {
      name: {
        messages: ['notification error'],
        context: 'User',
        invalid: true,
        value: 'joao'
      }
    }
    expect(notification.getErrors()).toEqual(notificationResult)
  })

  it('should return two erros message', () => {
    const notification = new Notification()
    const errorRequired: NotificationErrorInput = {
      message: 'name is required',
      target: 'name',
      context: 'User',
      value: 'joao'
    }

    const errorMin: NotificationErrorInput = {
      message: 'name must be greater than 4',
      target: 'name',
      context: 'User',
      value: 'joao'
    }
    notification.addError(errorRequired)
    notification.addError(errorMin)
    expect(() => {
      notification.getErrors()
    }).toHaveProperty('name')

    const notificationResult: Record<string, NotificationErrorOutput> = {
      name: {
        messages: ['name is required', 'name must be greater than 4'],
        context: 'User',
        value: 'joao',
        invalid: true
      }
    }
    expect(notification.getErrors()).toEqual(notificationResult)
  })

  it('should return true when hasError', () => {
    const notification = new Notification()
    const error: NotificationErrorInput = {
      message: 'notification error',
      target: 'name',
      context: 'User',
      value: 'joao'
    }
    notification.addError(error)
    expect(() => {
      notification.hasError()
    }).toBeTruthy()
  })

  it('should return false when has no error', () => {
    const notification = new Notification()
    expect(notification.hasError()).toBeFalsy()
  })

  it('should return an error messages string', () => {
    const notification = new Notification()
    const error: NotificationErrorInput = {
      message: 'notification error',
      target: 'name',
      context: 'User',
      value: 'joao'
    }
    notification.addError(error)
    const error2: NotificationErrorInput = {
      message: 'notification error2',
      target: 'name',
      context: 'User',
      value: 'joao'
    }
    notification.addError(error2)
    const error3: NotificationErrorInput = {
      message: 'notification error3',
      target: 'name2',
      context: 'User2',
      value: 'joao'
    }
    notification.addError(error3)
    expect(() => {
      notification.getErrors()
    }).toHaveProperty('name')

    expect(notification.getPlainMessageErrors()).toEqual(
      'notification error, notification error2, notification error3'
    )
  })

  it('should return a plain text error message', () => {
    const notification = new Notification()
    const errorRequired: NotificationErrorInput = {
      message: 'name is required',
      target: 'name',
      context: 'User',
      value: 'joao'
    }

    const errorMin: NotificationErrorInput = {
      message: 'name must be greater than 4',
      target: 'name',
      context: 'User',
      value: 'joao'
    }
    notification.addError(errorRequired)
    notification.addError(errorMin)
    expect(() => {
      notification.getErrors()
    }).toHaveProperty('name')

    const notificationResult: Record<string, NotificationErrorOutput> = {
      name: {
        messages: 'name is required, name must be greater than 4',
        context: 'User',
        value: 'joao',
        invalid: true
      }
    }
    expect(notification.getFlatMessagesErrors()).toEqual(notificationResult)
  })

  it('should clear all errors', () => {
    const notification = new Notification()
    const errorRequired: NotificationErrorInput = {
      message: 'name is required',
      target: 'name',
      context: 'User',
      value: 'joao'
    }

    const errorMin: NotificationErrorInput = {
      message: 'name must be greater than 4',
      target: 'name',
      context: 'User',
      value: 'joao'
    }
    notification.addError(errorRequired)
    notification.addError(errorMin)
    expect(() => {
      notification.getErrors()
    }).toHaveProperty('name')

    const notificationResult: Record<string, NotificationErrorOutput> = {
      name: {
        messages: 'name is required, name must be greater than 4',
        context: 'User',
        value: 'joao',
        invalid: true
      }
    }
    expect(notification.getFlatMessagesErrors()).toEqual(notificationResult)
    notification.clearErrors()
    expect(notification.hasError()).toBeFalsy()
  })
})
