import Notification from '@core/@shared/domain/notification/notification'
import { EntityInterface } from '@core/@shared/domain/entity/entity.interface'
import { Entity } from '@core/@shared/domain/entity/entity'

export abstract class Presenter {
  static entityToData (entity: EntityInterface): any {
    return entity.toJSON()
  }

  static async dataToEntity<E extends Entity> (
    data: Record<string, any>,
    EntityClass: new (data?: any, notification?: any) => E
  ): Promise<E> {
    const notification = new Notification()
    const entity = new EntityClass(data, notification)
    await entity.validate()
    return entity
  }

  static flatObject (input, reference?, output?) {
    output = output || {}
    for (let key in input) {
      const value = input[key]
      key = reference ? reference + '.' + key : key
      if (
        typeof value === 'object' &&
        value !== null &&
        typeof value.getTime !== 'function'
      ) {
        this.flatObject(value, key, output)
      } else {
        output[key] = value
      }
    }
    return output
  }
}
