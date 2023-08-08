# Arquitetura do projeto

A arquitetura deste projeto está baseada em princípios e conceitos amplamente difundidos na disciplina de Engenharia de Software.

Este documento não pretende esmiuçar todos os conceitos dos padrões utilizados, os quais podem ser facilmente encontrados
em pesquisas na Web.

Esta arquitetura do software foi idealizada utilizando-se dos seguintes padrões:

- SOLID
- Clean Architecture
- Onion Architecture
- Domain Driven Design (DDD)
- Boas práticas de codificação em TypeScript

Alguns destes conceitos podem ser encontrados nos endereços:
- https://github.com/vitorfreitas/clean-code-typescript
- https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- https://www.youtube.com/watch?v=vFZkOyaPK4E
- https://www.youtube.com/watch?v=YaGVURjB33I

## Arquitetura em cebola?? (Onion Architecture)
A `Onion Architecture` é base de várias arquiteturas concebidas como `Clean Architecture` e `Port and Adapters`.

Conceitualmente a principal regra, ou *Regra de Outro* diz que as dependências do código-fonte só podem apontar
para o centro das camadas. Nada em um círculo interno pode saber da existência concreta de algo de um círculo externo.
Em particular, algo declarado em um círculo externo não deve ser mencionado pelo código em um círculo interno.
Isso inclui, funções, classes, variáveis ou qualquer outra entidade de Software nomeada.
Programe sempre para `interfaces` (SOLID). Além disso, o fluxo da informação entra de fora para centro.

Exemplo: `Clean Architecture`
![Clean Architecture](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)

## Arquitetura do projeto
```
+@shared
|---+ application
|   |---+ presenter
|   |---+ use-cases
|---+ domain
|   |---+ entity
|   |---+ notification
|   |---+ repository
|---+ infra
|   |---+ db   
|   |---+ ....
```

### Application
Esta camada é responsável por implementar os códigos específicos para a aplicação a ser desenvolvida.
O módulo @shared/application contém códigos base para serem utilizados pela camada *application* específica de cada aplicação.

Aqui colocaremos os casos de uso com as intenções da aplicação.

### Domain
Nesta camada é onde implementamos as regras de negócio mais puras da aplicação.
As entities, seus repositórios para acesso aos dados e qualquer código que vise garantir a integridade destas regras devem ser implementados
nesta camada.


### Infra
Esta camada é responsável por implementar os códigos mais externos da aplicação.
O módulo @shared/infra contém códigos base para serem utilizados pela camada *application* específica
de cada módulo.

Neste ambiente deverá residir, por exemplo, as implementações para acesso a banco, drivers, protocolos de comunicação e interfaces com o mundo externo.

### Presenter
A camada de apresentação (presenter) é responsável por formatar a entrada e saída dos dados para o core da aplicação.
Nesta camada são feitas as transformações específicas para cada consumidor, como exemplo um formulário do Vuejs ou do React.


### Módulos
Os módulos representam um domínio de negócio a ser implantado. Ele deverá ser criado de acordo com o sentido da aplicação para um determinado assunto.
Podemos citar, por exemplo, o cadastro de usuários. Neste cenário o módulo ```usuario``` iria conter as implementações geraris para
satisfazer as necessidades do cadastro de usuário.
Cada módulo a ser criado deverá respeitar esta estrutura e seus conceitos, fazendo uso das classes
disponibilizadas em @share.


## Conceitos
### Entities vs domain
Aqui precisamos tomar bastante cuidado com os conceitos trazidos pelo `Robert Martin (Uncle Bob)`, criador da `Clean Architecture` e
pelo `Eric Evans` criador do `Domain Driven Design`.
Entities não são *entidades de banco de dados*, isso é a primeira coisa que precisa ficar claro. Em seguida, também é preciso entender
a diferença deste conceito nas arquiteturas propostas.
Para a `Clean Architecture`, `Entities` é uma camada completa que encapsula as regras mais puras do domínio do negócio.
Nesta camada podemos ter várias classes e conceitos para garantir estas regras mais gerais, por exemplo, a classe Entity,
a classe Repository e qualquer outra ou padrão necessário para garantir a consistência das regras mais puras do negócio.

Todos os objetos presentes nesta camada não deverem ser afetados por uma alteração na navegação da página ou na segurança, por exemplo.
Nenhuma alteração operacional em nenhum aplicativo específico deve afetar a camada de entidade.

Tomemos como exemplo a entidade `Usuario` em um sistema. Supondo que ela tenha os seguintes atributos:
- Nome
- Email
- Senha

Podemos visualizar facilmente que algumas regras básicas precisam ser seguidas, por exemplo:
1. [x] Email não poderá ser vazio e deve ser um formato válido para Email
2. [x] Nome não pode ser vazio
3. [x] Senha pode ser vazia (A depender da regra do negócio, supondo que o cadastro será feito por terceiros e a senha preenchida depois)


### Casos de Uso (Use Cases)
Caso de uso representam *intenções*. Implementa fortemente o conceito de SRP (Single Responsibility Principle) as
intenções mudam por razões diferentes. Exemplo: Inserir algo, difere de Alterar algo, elas podem mudar por
razões distintas. ATENÇÃO !!! Tome cuidado com a duplicação real vs duplicação acidental. Muitas vezes a duplicação
é `INTENCIONAL` e `NECESSÁRIA`. Se o código tiver razões diferentes para mudar, ele pode ser duplicado.


Esta camada deve conter regras de negócios específicas do aplicativo (não confundir com as regras da entidade).
Os casos de uso orquestram o fluxo de dados de e para as entidades e orientam essas entidades a usar
suas regras de negócios para atingir os objetivos do caso de uso.

Como exemplo, voltaremos à entidade `Usuario`. Como vimos, a propriedade `Senha` não necessariamente precisa ser preenchida na entidade.
Porém, podemos implementar um novo sistema onde o próprio usuário realizaria seu cadastro no sistema e, neste caso, seria
obrigado a preencher a propriedade `Senha`. Esta regra é específica deste sistema então deverá ser implementada
em um caso de uso.

Não esperamos que mudanças nesta camada afetem as entidades (que estão mais ao centro no diagrama).
Também não esperamos que essa camada seja afetada por alterações em camadas externas, como o banco de dados.

Esta camada pode conhecer as implementações concretas de `Entidades` mas não devem conhecer implementações externas.




