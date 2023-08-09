import { SignUpUseCase } from '@core/auth/application/use-case/sign-up.use-case'
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters
} from '@nestjs/common'
import { SignUpDTO } from '@core/auth/application/dto/sign-up.dto'
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SignUpResultDto } from '@core/auth/application/dto/sign-up-result.dto'
import { NotificationErrorExceptionFilter } from '../exceptionFilter'

@ApiTags('Auth')
@UseFilters(NotificationErrorExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private signUpUseCase: SignUpUseCase) {}

  @ApiBody({
    description: 'Auth - Create a record',
    type: () => SignUpDTO
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => SignUpResultDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() createAuthDto: SignUpDTO) {
    return this.signUpUseCase.execute(createAuthDto)
  }
}
