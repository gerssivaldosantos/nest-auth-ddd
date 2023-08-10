import UserEntity from '@core/user/domain/entities/user.entity'
import { UseCase } from '@core/@shared/application/use-case/use-case'
import NotificationError from '@core/@shared/domain/notification/notification.error'
import { UserTypeOrmRepository } from '@core/user/infra/db/typeorm/user.typeorm-repository'
import { HttpErrorCode } from '@core/@shared/application/dto/http.enum'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserPresenter } from '@core/user/application/presenter/user.presenter'

export class LogoutUseCase extends UseCase {
  constructor(
    private repository: UserTypeOrmRepository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    super()
  }

  async execute(id: string): Promise<boolean | NotificationError> {
    const resultFindByEmail = await this.repository.findById(id)
    if (!resultFindByEmail) {
      return Promise.reject(
        new NotificationError('Email não cadastrado', HttpErrorCode.BAD_REQUEST)
      )
    }
    const entityUpdated = await UserPresenter.dataToEntity<UserEntity>(
      {
        ...resultFindByEmail,
        refreshToken: null
      },
      UserEntity
    )
    await this.repository.update(entityUpdated)

    return true
  }
}
