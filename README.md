# Generated

Neste documento você encontrará as informações de como desenvolver novas funcionalidades ao projeto.

## 1 - Instale as dependências do projeto
```yarn install```

## 2 - Duplique o arquivo env.example com o nome .env, em seguida configure-o para seu ambiente.
Por padrão este arquivo já está configurado para funcionar com as variáveis de ambiente necessárias, sendo preciso somente adicionar a variável
***DATABASE_SYNCHRONIZE=true*** ao novo arquivo.
Esta variável fará com que haja uma sincronização da estrutura do banco de dados com as entidades criadas no código sempre que a aplicação for executada.

### ***ATENÇÃO***: Nunca usar esta variável como ***true*** em ambiente de produção, pois poderá haver perda de dados.

Em tempo de desenvolvimento e testes está sendo utilizado o banco de dados *sqlite* rodando os dados em memória ( *:memory:*).

Caso deseja persistir os dados em disco, troque a variável _DATABASE_NAME_ por um nome de arquiv. *Ex: database.db*

## 3 - Criando um módulo
Antes de tudo é preciso entender a arquitetura desenvolvida e disponibilizada na pasta @core.
Leia com atenção o README desta pasta e os demais materiais e links indicados.

Apesar de estarmos utilizando o Nestjs como framework, os módulos criados são
independentes dele.

Seu novo módulo deverá possuir uma estrutura similar à seguinte:

```
MODULO
|---+ application
|   |---+ dto
|   |---+ presenter
|   |---+ use-case
|---+ domain
|   |---+ entity
|   |---+ repository
|---+ infra
|   |---+ db
|   |---|---+ typeorm
```

Poderão existir situações onde mais pastas/arquivos ou menos pastas/arquivos
sejam necessárias para atendimento ao negócio.
O importante é sempre ter em mente que os códigos criados devem ser
facilmente testados, evoluídos e possuindo baixo acoplamento.

***TESTES NÃO SÃO OPCIONAIS, MAS SIM OBRIGATÓRIOS***


## 4 - PASSO A PASSO
Vamos tomar como exemplo a criação de um módulo de ***user*** responsável pelo cadastramento de usuários.

### 4.1 - Entities

Sendo a ***entity*** o coração das regras de negócio, presente na camada de domínio da aplicação, a recomendação é que se inicie por ela.
Lembre-se, esta entity não é necessariamente uma tabela do banco de dados.

Crie os seguintes arquivos:
```
user
|---+ domain
|   |---+ entity
|   |---|---+ user.entity.spec.ts
|   |---|---+ user.entity.ts
```

Crie o arquivo ***user.entity.ts** e defina as propriedades e métodos desta classe estendendo-a da classe Entity
presente no @core.

````
export default class UserEntity extends Entity {
@IsNotEmpty({
    message: 'Nome é obrigatório'
  })
  @IsString({
    message: 'Nome deve ser um texto'
  })
  @MinLength(3, {
    message: 'Nome deve ter pelo menos 3 letras'
  })
  @MaxLength(80, {
    message: 'Nome deve ter no máximo 80 caracteres'
  })
  name: string

  @IsEmail(
    {},
    {
      message: 'Email inválido'
    }
  )
  @MaxLength(120, {
    message: 'E-mail deve ter no máximo 120 caracteres'
  })
  @IsOptional()
  email: string | null

  getPlainClass(): any {
    return UserEntity
  }
  constructor(user: UserInput, notification: NotificationInterface) {
    super(notification, user?.id || null)
    this.name = user?.name
    this.email = user?.email
  }
}
````

Crie os métodos e propriedades conforme as regras do negócio.
Atenção aos _decorators_ nas propriedades da classe, eles são responsáveis pelas validações a cerca do preenchimento. Lembre-se, se necessário crie métodos de get e set para o preenchimento de alguma propriedade que exija uma lógica específica.

Atenção ao construtor que deverá invocar o método ***super*** da classe Entity.
Atenção também ao método getPlainClass que, caso não implementado, retornará erro em tempo de execução.

Crie o arquivo ***user.entity.spec.ts** para realização dos testes de unidade.

Lembre-se, é preciso criar situações que prevejam o caminho feliz e os caminhos de erro.

### IMPORTANTE: A entity ao ser criada ou alterada deverá invocar o método "validate" de sua classe base (Entity).

````
describe('Unit test Users', () => {
  it('should return an exception when email is invalid', async () => {
    const userData: UserInput = {
      id: '1',
      name: 'John',
      email: 'email@'
    }
    const notification = new Notification()
    const user = new UserEntity(userData, notification)
    await user.validate() // <- IMPORTANTE
    const notificationResult: Record<string, NotificationErrorOutput> = {
      email: {
        messages: ['Email inválido'],
        context: 'UserEntity',
        invalid: true,
        value: 'email@'
      }
    }
    expect(user.notification.getErrors()).toEqual(notificationResult)
  })
}
````

Para executar os testes, execute o comando:
````
yarn test
````

Para verificar o nível de cobertura dos testes execute o comando:
````
yarn test --coverage
````

Após verificar a cobertura, configura as linhas em que seus testes não estão contemplando o fluxo de sua implementação (branch).

Para manter a independência do seu código, crie uma ‘interface’ de repositório que deverá se implementada posteriormente na camada de ***infra***.
Isso irá possibilitar que seu código possa ser desenvolvimento sem esta implementação concreta agora.

Um repositório é uma abstração de como sua entidade acessará as camadas de mais baixo nível como banco de dados e api, por exemplo.

```
user
|---+ domain
|   |---+ entity
|   |---|---+ user.entity.spec.ts
|   |---|---+ user.entity.ts
|   |---+ repository
|   |---|---+ user.repository.interface.ts
```
A implementação de user.repository.interface.ts deverá se parecer com isso:
````
export interface UserRepositoryInterface
  extends RepositoryInterface<UserEntity> {}
````
Perceba que já existe uma 'interface' que expõe os principais métodos de um repositório, só estamos garantindo que nossos códigos terão sua própria
'interface' e assim nos protegendo de eventuais evoluções.

Com isso implementamos o básico de nossa camada de domínio. Lembre-se pode ser que em determinados momentos esta camada precise de mais implementações.


### 4.2 - Use Cases
A camada de caso de uso é onde a maioria da lógica acontece, pense nos casos de uso como o ponto de
entrada para sua aplicação.
É nesta camada que iremos consolidar as regras, mesclando, quando necessário, várias entidades.

Usaremos os repositórios, através da inversão de dependências, criados na camada de ***infra*** para acessarmos
os recursos de armazenamento, etc. Esta camada não deve conhecer a implementação concreta destas estruturas.
Diferentemente, ela pode conhecer as camadas abaixo dela, ou seja, a camada de domínio e suas 'entities'.

Como exemplo, veja uma implementação do caso de uso para cria um novo usuário.

```
user
|---+ application
|   |---+ dto
|   |---|---+ user-create.dto.ts
|   |---+ use-case
|   |---|---+ create-user.use-case.spec.ts
|   |---|---+ create-user.use-case.ts
|---+ domain
|   |---+ entity
|   |---|---+ user.entity.spec.ts
|   |---|---+ user.entity.ts
|   |---+ repository
|   |---|---+ user.repository.interface.ts
```

create-user.use-case.ts

````
export class CreateUserUseCase extends UseCase {
  constructor(private repository: UserRepositoryInterface) {
    super()
  }

  async execute(
    data: UserCreateDto
  ): Promise<UserCreateResultDto | NotificationError> {
    const entity: UserEntity = await UserPresenter.dataToEntity<UserEntity>(
      data,
      UserEntity
    )
    if (entity.notification.hasError()) {
      return Promise.reject(
        new NotificationError(entity.notification.getPlainMessageErrors())
      )
    } else {
      const userInserted = await this.repository.insert(entity)
      return UserPresenter.entityToData(userInserted)
    }
  }
}
````

Alguns pontos a se observar.

***a)*** O caso de uso estende a classe _UseCase_, que é a casse abstrata de todo caso de uso,
nos obrigando assim a implementar o método ***execute***.

***b)*** Perceba que o construtor recebe uma instância de _repository_, garantindo assim a ***inversão
de dependência***.

***c)*** O uso de uma class ***Presenter***, presente na camada de domínio pode ou não ser necessária.

***d)*** Aplique as regras e validações pertinentes ao objetivo do caso de uso.

### 4.3 - Infraestrutura
Nesta camada criamos os códigos que conversão com a infraestrutura escolhida para o projeto, como banco de dados, api externas e etc.
Neste projeto estamos adotando o ORM TypeOrm, porém é possível utilizar qualquer outro mecanismo de acesso a dados.

Crie os arquivos e pastas de acesso ao typeorm
```
user
|---+ application
|   |---+ dto
|   |---|---+ user-create.dto.ts
|   |---+ use-case
|   |---|---+ create-user.use-case.spec.ts
|   |---|---+ create-user.use-case.ts
|---+ domain
|   |---+ entity
|   |---|---+ user.entity.spec.ts
|   |---|---+ user.entity.ts
|   |---+ repository
|   |---|---+ user.repository.interface.ts
|---+ infra
|   |---+ db
|   |---|---+ typeorm
|   |---|---|---+ user.entity.schema.ts
|   |---|---|---+ user.repository.spec.ts
|   |---|---|---+ user.repository.ts
```

#### 4.3.1 - O Schema do banco
Lembrando que há uma diferença entre a ***entity*** do domínio do negócio da ***entidade*** do banco de dados.
A entidade do banco de dados deverá ser especificada no arquivo ".schema" do módulo.

Atenção às definições, tamanhos de campos e relacionamentos entre tabelas.

user.entity.schema.ts
````
export const UserEntitySchema = new EntitySchema<UserEntity>({
  name: 'user',
  columns: {
    id: {
      type: String,
      primary: true,
      nullable: false,
      length: 36
    },
    name: {
      type: String,
      length: 80,
      nullable: false
    },
    email: {
      type: String,
      length: 120
    }
  }
})
````

Com o schema criado, é necessário a geração dos arquivos "migrations" para serem aplicados ao banco de dados quando estiverem em ambiente de produção.
Lembre-se, com a variável _DATABASE_SYNCHRONIZE=true_ em ambiente de desenvolvimento a tabela será
criada automaticamente.

Execute o seguinte comando para gerar o arquivo "migration" do seu schema de tabela.

```
npm run  typeorm:generate-migration --name=MIGRATION_NAME
```
Não execute com ***yarn***, não vai funcionar.

Não esqueça de adicionar o arquivo gerado em src/database/migrations/NOME_ARQUIVO no GIT.

Caso precise criar uma migration manualmente, ou seja, sem que o próprio TypeOrm identifique as alterações do seu schema,
execute o seguinte comando:

```
npm run typeorm:run-create --name=MIGRATION_NAME
```
Novamente, não utilize ***yarn***, não vai funcionar.


Se precisar executar as migrations criada, faça o seguinte:

```
yarn|npm run typeorm:run-migrations
```

Caso seja necessário reverter uma migration executada, faça assim:

```
yarn|npm run typeorm:revert-migration
```

#### 4.3.2 - O repositório
Neste arquivo é onde são realmente implementados os métodos de manipulação do banco de dados utilizando-se, no nosso exemplo, o TypeOrm.

O repositório deverá implementar a 'interface' ***UserRepositoryInterface*** garantindo assim que
todas as classes que precisem utilizá-lo trabalhe com o contrato estabelecido,
criando então o desacoplamento.

Aqui é onde ficará todo o código específico da 'lib' utilizada.
Um ponto de atenção, é importante sempre validar a ***entity*** nos métodos de persistência no
banco de dados, garantindo assim a integridade da aplicação.

user.repository.ts

````
export class UserRepository implements UserRepositoryInterface {
  repo
  notification: NotificationInterface
  constructor(
    private dataSource: DataSource,
    notification: NotificationInterface
  ) {
    // Create a repository TypeOrm from User Schema specification
    this.repo = this.dataSource.getRepository(UserEntitySchema)
    this.notification = notification
  }
  ...
  async insert(entity: UserEntity): Promise<UserEntity> {
    const toSave = new UserEntity(entity, entity.notification)
    // ATTENTION: Always validate the entity before inserting it
    await toSave.validate()
    if (!toSave.notification.hasError()) {
      await this.repo.insert(toSave)
      return toSave
    } else {
      throw new NotificationError(toSave.notification.getPlainMessageErrors())
    }
  }

}
````

Perceba que o construtor irá receber uma instância de 'Notification' e também de 'DataSource'.
Estas instâncias deverão ser injetadas pela aplicação, que neste caso será o Nestjs. Veremos adiante.
Por hora entenda que DataSource é um objeto do TypeOrm com as configurações de conexão ao banco de dados.


user.repository.spec.ts

````
describe('User Repository', () => {
  let dataSource: DataSource
  let notification: Notification
  const userData: UserInput = {
    id: crypto.randomUUID(),
    name: 'John',
    email: 'john@example.com'
  }

  beforeEach(async () => {
    // Factory for creating a TypeOrm DataSource
    dataSource = await TypeOrmFactory.getDataSourceInstance()
    notification = new Notification()
  })

  afterEach(() => {
    notification.clearErrors()
    return dataSource.destroy()
  })
  it('should create an user', async () => {
    const repository = new UserRepository(dataSource, notification)
    const entity = new UserEntity(userData, notification)
    const user: UserEntity = await repository.insert(entity)
    expect(user).toBeInstanceOf(UserEntity)
    const resultUser = user.toJSON()
    expect(resultUser).toEqual(userData)
  })
}
````

### 4.4 - Nestjs

O Nestjs é o framework utilizado para servir os códigos para construção de uma API REST.

#### 4.4.1 - Módulo

Na pasta "src" crie a pasta "user" com o arquivo user.module.ts.

A implementação básica dos módulos do Nestjs será a seguinte:

````
@Module({
  imports: [TypeOrmModule.forFeature([UserEntitySchema])],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepository,
      useFactory: async (dataSource: DataSource) => {
        const notification = new Notification()
        return new UserRepository(dataSource, notification)
      },
      inject: [getDataSourceToken()]
    },
    {
      provide: CreateUserUseCase,
      useFactory: async (repo: UserRepositoryInterface) => {
        return new CreateUserUseCase(repo)
      },
      inject: [UserRepository]
    }
  ]
})
export class UserModule {}
````

Repare na ***Injeção de dependências*** disponibilizada pelo Nestjs, onde iremos prover as instâncias
de objetos necessários para a execução do caso de uso, que será chamada na controller mais adiante.

São injetados como "providers" o repositório de usuário "UserRepository" as demais dependências para o caso de uso.

#### 4.4.2 - Controllers

Aqui é o ponto de entrada das chamadas API do Nestjs, neste ponto onde iremos "disparar" nossos casos de uso.

Crie o arquivo user.controller.ts com o seguinte código:

````
@Controller('user')
export class UserController {
  constructor(private insertUserUseCase: CreateUserUseCase) {}

  @ApiBody({
    description: 'User an user',
    type: () => UserCreateDto
  })
  @ApiConsumes('application/json')
  @ApiResponse({ type: () => UserCreateDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createUserDto: UserCreateDto) {
    return this.insertUserUseCase.execute(createUserDto)
  }
}
````

Veja que a função ***create*** apenas recebe o "dto" de entrada e repassa a execução para nosso caso de uso, onde
efetivamente toda a lógica acontece.

Os demais "decorators" são responsáveis pelo controle para servir a API REST e especificação "Swagger".

#### 4.4.3 - Testes

Neste ponto faremos 2 testes diferentes no Nest. Um teste de unidade,
que realizará a execução dos métodos da controller, sem passar pelas camadas superiores do
Nestjs como middlewares, interceptors, etc., e os testes de integração.

***a) Teste de unidade***

Aqui vamos garantir os cenários de execução do controller. Atenção para o caminho feliz e caminhos de erro.

````
describe('UserController', () => {
  let controller: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig],
          envFilePath: ['.env']
        }),
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService
        }),
        TypeOrmModule.forFeature([UserEntitySchema])
      ],
      controllers: [UserController],
      providers: [
        {
          provide: UserRepository,
          useFactory: async (dataSource: DataSource) => {
            const notification = new Notification()
            return new UserRepository(dataSource, notification)
          },
          inject: [getDataSourceToken()]
        },
        {
          provide: CreateUserUseCase,
          useFactory: async (repo: UserRepositoryInterface) => {
            return new CreateUserUseCase(repo)
          },
          inject: [UserRepository]
        }
      ]
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should insert a valid user', async () => {
    const userData: UserCreateDto = {
      name: 'user',
      email: 'user@example.com'
    }
    const inserted = await controller.create(userData)
    const userDataReturned = {
      name: 'user',
      email: 'user@example.com'
    }
    expect(inserted).toMatchObject(userDataReturned)
  })

  it('should return an error when entering an invalid user', async () => {
    const userData: UserCreateDto = {
      name: 'user',
      email: 'user'
    }

    await expect(controller.create(userData)).rejects.toThrow('Email inválido')
  })
})
````

***b) Teste de integração (e2e)***

Os testes e2e, diferentemente dos demais, são implementados na pasta ***test*** que fica na raiz do projeto.
Deve-se criar uma pasta referente ao módulo a ser testado (user, por exemplo).

Aqui será realmente realizado o consumo do "endpoint", com uma estância de servidor Nestjs em execução.

Veja o exemplo:

test/user/user.e2e.spec.ts

````
beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [databaseConfig],
        envFilePath: ['.env'] // IMPORTANT
      }),
      TypeOrmModule.forRootAsync({
        useClass: TypeOrmConfigService
      }),
      UserModule
    ]
  }).compile()
  app = module.createNestApplication()
  await app.init()
})

afterAll(async () => {
  await app.close()
})
describe('POST /user', () => {
  it('should create an user', async () => {
    const requestResult = await request(app.getHttpServer())
      .post('/user')
      .send({
        id: '6194edb3-6a39-4c0f-b105-2b41bae21920',
        name: 'teste',
        email: 'teste@example.com'
      })
      .expect(200)
    expect(requestResult.body.id).toBeDefined()
    expect(requestResult.body.name).toEqual('teste')
    expect(requestResult.body.email).toEqual('teste@example.com')
  })
})
````

Um ponto de atenção, para execução dos testes e2e é necessário rodar o seguinte comando:

````
yarn run test:e2e
````

## 5 - Antes de enviar seu Merge Request

Antes de enviar seu código para o repositório, realize as seguintes verificações:

1. [ ] Criei as migrations necessárias? É sempre necessário criar uma migration caso haja
mudança na estrutura de uma entidade do banco.
2. [ ] Executei o comando ***yarn test*** com sucesso?
3. [ ] Executei o comando ***yarn test --coverage*** e obtive uma cobertura superior a 90%?
4. [ ] Executei o comando ***yarn test:e2e*** com sucesso?

Caso todos os itens tenham sido realizados, pode abrir o merge request.



# nest-auth-ddd
