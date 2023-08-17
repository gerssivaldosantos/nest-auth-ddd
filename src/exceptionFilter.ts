import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'
import NotificationError from '@core/@shared/domain/notification/notification.error'

@Catch(NotificationError)
export class NotificationErrorExceptionFilter implements ExceptionFilter {
  catch (notificationError: NotificationError, host: ArgumentsHost) {
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(notificationError.code)
      .json(notificationError.toJSON())
  }
}
