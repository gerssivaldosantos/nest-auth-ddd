import NotificationInterface from '@core/@shared/domain/notification/notification.interface'

export interface EntityInterface {
  notification: NotificationInterface
  validate(): void
  getPlainClass?(): any
  toJSON(): any
  getName(): string
}
