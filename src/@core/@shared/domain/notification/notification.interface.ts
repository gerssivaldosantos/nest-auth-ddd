export type NotificationErrorInput = {
  message: string
  context: string
  target: string
  value: any
}

export type NotificationErrorOutput = {
  messages: string[] | string
  context: string
  value: any
  invalid: boolean
}

export default interface NotificationInterface {
  addError(error: NotificationErrorInput): void
  hasError(): boolean
  getErrors(): Record<string, NotificationErrorOutput>
  getPlainMessageErrors(): string
  getFlatMessagesErrors(): Record<string, NotificationErrorOutput>
}
