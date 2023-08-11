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
  UseFilters,
  UseGuards
} from '@nestjs/common'
import { SignUpDTO } from '@core/auth/application/dto/sign-up.dto'
import {
  ApiBody,
  ApiConsumes,
  ApiProperty,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { SignUpResultDto } from '@core/auth/application/dto/sign-up-result.dto'
import { NotificationErrorExceptionFilter } from '../exceptionFilter'
import { SignInResultDto } from '@core/auth/application/dto/sign-in-result.dto'
import { SignInDTO } from '@core/auth/application/dto/sign-in.dto'
import { SignInUseCase } from '@core/auth/application/use-case/sign-in.use-case'
import { AccessTokenGuard } from './guards/access-token.guard'
import { AuthUser } from './decorator/decorator.auth_user'
import { LogoutUseCase } from '@core/auth/application/use-case/logout.use-case'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import { RefreshTokenUseCase } from '@core/auth/application/use-case/refresh-token.use-case'
import { CreateAuthUseCase } from '@core/auth/application/use-case/create-auth.use-case'
import { FindByIdAuthUseCase } from '@core/auth/application/use-case/findById-auth.use-case'
import { SearchAuthUseCase } from '@core/auth/application/use-case/search-auth.use-case'
import { UpdateAuthUseCase } from '@core/auth/application/use-case/update-auth.use-case'
import { DeleteAuthUseCase } from '@core/auth/application/use-case/delete-auth.use-case'
import { AuthCreateDto } from '@core/auth/application/dto/auth-create.dto'
import { AuthCreateResultDto } from '@core/auth/application/dto/auth-create-result.dto'
import { AuthUpdateDto } from '@core/auth/application/dto/auth-update.dto'
import { AuthGetOneResultDto } from '@core/auth/application/dto/auth-get-one-result.dto'
import { AuthSearchDto } from '@core/auth/application/dto/auth-search.dto'
import { SearchResultDto } from '@core/@shared/application/dto/search-result.dto'

@ApiTags('Auth')
@UseFilters(NotificationErrorExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(
    private signUpUseCase: SignUpUseCase,
    private signInUseCase: SignInUseCase,
    private logoutUseCase: LogoutUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private insertAuthUseCase: CreateAuthUseCase,
    private findByIdAuthUsecase: FindByIdAuthUseCase,
    private searchAuthUseCase: SearchAuthUseCase,
    private updateAuthUseCase: UpdateAuthUseCase,
    private deleteAuthUseCase: DeleteAuthUseCase
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

  @ApiConsumes('application/json')
  @ApiResponse({ type: SignInResultDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(
    @AuthUser('sub') sub: string,
    @AuthUser('refreshToken') refreshToken: string
  ) {
    return this.refreshTokenUseCase.execute({ id: sub, refreshToken })
  }

  @ApiBody({
    description: 'Auth - Create a record',
    type: () => AuthCreateDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => AuthCreateResultDto })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createAuthDto: AuthCreateDto) {
    return this.insertAuthUseCase.execute(createAuthDto)
  }

  @ApiBody({
    description: 'Auth - Update a record',
    type: () => AuthUpdateDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => AuthUpdateDto })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: AuthUpdateDto) {
    const changeToData = { ...updateDto, id }
    return await this.updateAuthUseCase.execute(changeToData)
  }

  @ApiProperty({
    description: 'Auth - Delete a record'
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => Boolean })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.deleteAuthUseCase.execute(id)
    if (!result) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
  }

  @ApiConsumes('application/json')
  @ApiResponse({ type: () => AuthGetOneResultDto })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.findByIdAuthUsecase.execute(id)
  }

  @ApiProperty({
    description: 'Auth - Search',
    type: () => AuthSearchDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => SearchResultDto })
  @HttpCode(HttpStatus.OK)
  @Post('search')
  async search(@Body() searchAuthDto: AuthSearchDto) {
    try {
      return await this.searchAuthUseCase.execute(searchAuthDto)
    } catch (e) {
      throw new HttpException(
        { name: e.name, message: e.message },
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
