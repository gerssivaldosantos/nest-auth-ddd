import { SignUpUseCase } from '@core/auth/application/use-case/sign-up.use-case'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseFilters
} from '@nestjs/common'
import { AuthCreateDto } from '@core/auth/application/dto/auth-create.dto'
import {
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
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
  @Post()
  signUp(@Body() createAuthDto: AuthCreateDto) {
    return this.signUpUseCase.execute(createAuthDto)
  }
}
