import { SignUpUseCase } from '@core/auth/application/use-case/sign-up.use-case'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseGuards
} from '@nestjs/common'
import { SignUpDTO } from '@core/auth/application/dto/sign-up.dto'
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SignUpResultDto } from '@core/auth/application/dto/sign-up-result.dto'
import { NotificationErrorExceptionFilter } from '../exceptionFilter'
import { SignInResultDto } from '@core/auth/application/dto/sign-in-result.dto'
import { SignInDTO } from '@core/auth/application/dto/sign-in.dto'
import { SignInUseCase } from '@core/auth/application/use-case/sign-in.use-case'
import { AccessTokenGuard } from './guards/access-token.guard'
import { AuthUser } from './decorator/decorator.auth_user'
import { LogoutUseCase } from '@core/auth/application/use-case/logout.use-case'

@ApiTags('Auth')
@UseFilters(NotificationErrorExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private signUpUseCase: SignUpUseCase,
    private signInUseCase: SignInUseCase,
    private logoutUseCase: LogoutUseCase
  ) {}

  @ApiBody({
    description: 'Sign Up',
    type: () => SignUpDTO,
    examples: {
      basic: {
        description: 'Exemplo básico',
        value: {
          email: 'exemplo@email.com',
          name: 'Nome do usuário',
          password: '#$@rR19m>M'
        }
      }
    }
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
    type: () => SignUpDTO,
    examples: {
      basic: {
        description: 'Exemplo básico',
        value: {
          email: 'exemplo@email.com',
          password: '#$@rR19m>M'
        }
      }
    }
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => SignInResultDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-in')
  signIn(@Body() data: SignInDTO) {
    return this.signInUseCase.execute(data)
  }

  @ApiConsumes('application/json')
  @ApiResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@AuthUser('sub') sub: string) {
    return this.logoutUseCase.execute(sub)
  }
}
