import { IsOptional, IsString, MaxLength, validate } from 'class-validator'
import NotificationInterface from '@core/@shared/domain/notification/notification.interface'
import { EntityInterface } from '@core/@shared/domain/entity/entity.interface'
import { v4 as uuidv4 } from 'uuid'

export abstract class Entity implements EntityInterface {
  @IsOptional()
  @IsString({
    message: 'ID deve ser uma string'
  })
  @MaxLength(36, {
    message: 'ID deve ter no máximo 36 caracteres'
  })
  public readonly id?: string | null

  public notification: NotificationInterface

  protected constructor (notification: NotificationInterface, id?: string) {
    this.notification = notification
    this.id = id || uuidv4()
  }

  public getFilledProperties (): string[] {
    const json = this.toJSON()
    delete json.id
    return Object.entries(json)
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value
      )
      .map(([key]) => key)
  }

  public getPlainClass (): any {
    throw new Error('Method "getPlainClass" was not implemented')
  }

  public getName () {
    /**
     * Está sendo usado um replace no caso raro aonde o nome da classe estava voltando com um "_" no começo,
     * por exemplo, "_UserEntity" ao invés de "UserEntity"
     */
    return (<any> this).constructor.name.replace('_', '')
  }

  /**
   * Apply validations rules based on class-validator decorators
   */
  public async validate () {
    const result = await validate(this)
    for (const error of result) {
      for (const key in error.constraints) {
        const msg = error.constraints[key]
        this.notification.addError({
          context: this.getName(),
          target: error.property,
          value: error.value,
          message: msg
        })
      }
    }
    const data: any = {}
    for (const [key, value] of Object.entries(this.toJSON())) {
      data[key] = { value, invalid: false }
    }
    return {
      ...data,
      ...this.notification.getFlatMessagesErrors(),
      validated: this.notification.hasError()
    }
  }

  /**
   * Returns a JSON representation of entity object
   */
  toJSON () {
    const proto = Object.getPrototypeOf(this)
    const jsonObj: any = Object.assign({}, this)

    Object.entries(Object.getOwnPropertyDescriptors(proto))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      // eslint-disable-next-line array-callback-return
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_' && key[0] !== 'notification') {
          const val = (this as any)[key]
          jsonObj[key] = val
          delete jsonObj['_' + key]
        }
      })
    delete jsonObj?.notification
    return jsonObj
  }

  /**
   * Returns an object with all property without methods
   */
  toOutput () {
    const output = this.toJSON()
    for (const [key, value] of Object.entries(output)) {
      output[key] = { value }
    }
    return output
  }

  /*
      Convert Date to string without timezone to ISO format
       */
  public dateToStringISO (date: Date | string): string {
    // Extract data components
    if (typeof date === 'string' || !(date instanceof Date)) {
      return date // .replace(/(?<=\d)T|(?<=\d)Z/g, ' ').trim()
    }
    const year = date.getFullYear().toString().padStart(4, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0')

    // Create string formatted
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`
  }
}
