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
import { SignInResultDto } from '@core/auth/application/dto/sign-in-result.dto'
import { SignInDTO } from '@core/auth/application/dto/sign-in.dto'
import { SignInUseCase } from '@core/auth/application/use-case/sign-in.use-case'

@ApiTags('Auth')
@UseFilters(NotificationErrorExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private signUpUseCase: SignUpUseCase,
    private signInUseCase: SignInUseCase
  ) {}

  @ApiBody({
    description: 'Sign Up',
    type: () => SignUpDTO
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => SignUpResultDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  signUp(@Body() data: SignUpDTO) {
    return this.signUpUseCase.execute(data)
  }

  @ApiBody({
    description: 'Sign In',
    type: () => SignUpDTO
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => SignInResultDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-in')
  signIn(@Body() data: SignInDTO) {
    return this.signInUseCase.execute(data)
  }
}
