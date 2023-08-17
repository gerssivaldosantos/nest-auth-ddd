import {
  UseCaseInterface,
  UseCaseOutputInterface
} from '@core/@shared/application/use-case/use-case.interface'

/*
Base class for use cases
 */
export class UseCase implements UseCaseInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute (args?: any): Promise<UseCaseOutputInterface | any> {
    return Promise.reject(new Error('Not implemented'))
  }

  public static clearValidationErrors (data: Record<string, any>) {
    for (const [key] of Object.entries(data)) {
      if (data[key] && data[key].invalid) data[key].invalid = false
      if (data[key] && data[key].context) data[key].context = ''
      if (data[key] && data[key].messages) data[key].messages = ''
    }
    return data
  }
}
