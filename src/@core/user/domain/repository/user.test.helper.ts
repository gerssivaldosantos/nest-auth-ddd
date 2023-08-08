// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Notification from '@core/@shared/domain/notification/notification'
import { DataSource } from 'typeorm'

export const clearUserBeforeEach = async (dataSource: DataSource) => {
  jest.setTimeout(10000) // 10 seconds
  await dataSource
    .getRepository('user')
    .query('TRUNCATE user RESTART IDENTITY CASCADE;')
  /*
    
    */
}

export const createUserRelations = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dataSource: DataSource
) => {
  return {}
}
