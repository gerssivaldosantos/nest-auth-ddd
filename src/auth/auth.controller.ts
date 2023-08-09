import { SignUpUseCase } from '@core/auth/application/use-case/sign-up.use-case'
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters
} from '@nestjs/common'
import { AuthCreateDto } from '@core/auth/application/dto/auth-create.dto'
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthCreateResultDto } from '@core/auth/application/dto/auth-create-result.dto'
import { NotificationErrorExceptionFilter } from '../exceptionFilter'

@ApiTags('Auth')
@UseFilters(NotificationErrorExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private signUpUseCase: SignUpUseCase) {}

  @ApiBody({
    description: 'Auth - Create a record',
    type: () => AuthCreateDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => AuthCreateResultDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() createAuthDto: AuthCreateDto) {
    return this.signUpUseCase.execute(createAuthDto)
  }
}
