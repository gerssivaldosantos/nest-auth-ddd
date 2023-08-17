// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Notification from '@core/@shared/domain/notification/notification'
import { DataSource } from 'typeorm'

export const clearAuthBeforeEach = async (dataSource: DataSource) => {
  await dataSource.getRepository('auth')
    .query('TRUNCATE auth RESTART IDENTITY CASCADE;')
    /*
    await dataSource.getRepository('role')
    .query('TRUNCATE auth RESTART IDENTITY CASCADE;')await dataSource.getRepository('auth-role')
    .query('TRUNCATE auth RESTART IDENTITY CASCADE;')
    */
}

export const createAuthRelations = async (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  dataSource: DataSource
) => {
  return {

  }
}
