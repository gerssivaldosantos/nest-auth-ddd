import NotificationInterface, {
  NotificationErrorInput,
  NotificationErrorOutput
} from './notification.interface'

export default class Notification implements NotificationInterface {
  private errors: Record<string, NotificationErrorOutput> = {}

  addError (error: NotificationErrorInput): void {
    if (this.errors[error.target]) {
      this.errors[error.target].value = error.value
      this.errors[error.target].invalid = true
      ;(this.errors[error.target].messages as string[]).push(error.message)
      this.errors[error.target].context = error.context
    } else {
      this.errors[error.target] = {
        value: error.value,
        invalid: true,
        messages: [error.message],
        context: error.context
      }
    }
  }

  getErrors (): Record<string, NotificationErrorOutput> {
    return this.errors
  }

  getFlatMessagesErrors (): Record<string, NotificationErrorOutput> {
    const errors: Record<string, NotificationErrorOutput> = JSON.parse(
      JSON.stringify(this.errors)
    )
    for (const [key] of Object.entries(errors)) {
      errors[key].messages = (errors[key].messages as string[]).join(', ')
    }
    return errors
  }

  getPlainMessageErrors () {
    const error = []
    for (const key in this.errors) {
      error.push(`${(this.errors[key].messages as string[]).join(', ')}`)
    }
    return error.join(', ')
  }

  hasError (): boolean {
    return Object.keys(this.errors).length > 0
  }

  clearErrors () {
    this.errors = {}
  }
}
