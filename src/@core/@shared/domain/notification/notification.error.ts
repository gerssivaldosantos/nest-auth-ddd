import { NotificationErrorOutput } from '@core/@shared/domain/notification/notification.interface'

export default class NotificationError extends Error {
  get errors(): Record<string, NotificationErrorOutput> {
    return this._errors
  }

  set errors(value: Record<string, NotificationErrorOutput>) {
    this._errors = value
  }

  get code(): number {
    return this._code
  }

  set code(value: number) {
    this._code = value
  }

  private _code: number
  private _errors: Record<string, NotificationErrorOutput>

  constructor(
    message: string,
    code = 500,
    errors?: Record<string, NotificationErrorOutput>
  ) {
    super(message)
    this.name = 'NotificationError'
    this.code = code
    this.errors = errors
  }

  public toJSON(): Record<
    string,
    string | number | Record<string, NotificationErrorOutput>
  > {
    return {
      code: this.code,
      errors: this.errors,
      message: this.message
    }
  }
}
