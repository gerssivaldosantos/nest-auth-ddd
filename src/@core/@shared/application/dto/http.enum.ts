export enum HttpErrorCode {
  CONTINUE = 100, // Continuar — O servidor recebeu a solicitação inicial e ainda está processando
  SWITCHING_PROTOCOLS = 101, // Mudando protocolos — O servidor concorda em trocar protocolos solicitados pelo cliente
  PROCESSING = 102, // Processando — O servidor está processando a solicitação, mas ainda não tem uma resposta completa
  EARLY_HINTS = 103, // Dicas iniciais — O servidor está enviando dicas adicionais antes de enviar a resposta final

  OK = 200, // OK — A solicitação foi bem—sucedida
  CREATED = 201, // Criado — A solicitação foi bem—sucedida e um novo recurso foi criado como resultado
  ACCEPTED = 202, // Aceito — A solicitação foi aceita para processamento, mas ainda não foi concluída
  NON_AUTHORITATIVE_INFORMATION = 203, // Informações não autorizadas — A resposta foi bem—sucedida, mas pode ser de outra fonte
  NO_CONTENT = 204, // Sem conteúdo — A solicitação foi bem—sucedida, mas não há conteúdo para retornar
  RESET_CONTENT = 205, // Redefinir conteúdo — A solicitação foi bem—sucedida, mas o cliente deve redefinir a exibição
  PARTIAL_CONTENT = 206, // Conteúdo parcial — A resposta é uma resposta parcial, conforme solicitado pelo cliente
  MULTI_STATUS = 207, // Múltiplos estados — A resposta do DAV (Web Distributed Authoring and Versioning) contém vários códigos de status
  ALREADY_REPORTED = 208, // Já relatado — A resposta já foi relatada em uma parte anterior da resposta
  IM_USED = 226, // IM Usado — O servidor cumpriu uma solicitação GET para a instância do recurso
  MULTIPLE_CHOICES = 300, // Múltipla escolha — A solicitação tem várias opções disponíveis
  MOVED_PERMANENTLY = 301, // Movido permanentemente — A página solicitada foi movida permanentemente para um novo local
  FOUND = 302, // Encontrado — A página solicitada foi temporariamente movida para um novo local
  SEE_OTHER = 303, // Veja outros — A resposta à solicitação pode ser encontrada em um diferente URI
  NOT_MODIFIED = 304, // Não modificado — A página não foi modificada desde a última solicitação
  USE_PROXY = 305, // Usar proxy — A solicitação deve ser acessada por meio de um proxy localizado em outro local
  TEMPORARY_REDIRECT = 307, // Redirecionamento temporário — A solicitação deve ser redirecionada temporariamente para outro URI
  PERMANENT_REDIRECT = 308, // Redirecionamento permanente — A solicitação deve ser redirecionada permanentemente para outro URI

  BAD_REQUEST = 400, // Requisição inválida — A solicitação possui sintaxe inválida ou não pode ser entendida pelo servidor
  UNAUTHORIZED = 401, // Não autorizado — A solicitação requer autenticação ou as credenciais fornecidas não são válidas
  PAYMENT_REQUIRED = 402, // Pagamento necessário — O pagamento é necessário para acessar o recurso solicitado
  FORBIDDEN = 403, // Proibido — O servidor entendeu a solicitação, mas se recusa a atendê—la
  NOT_FOUND = 404, // Não encontrado — O recurso solicitado não pôde ser encontrado no servidor
  METHOD_NOT_ALLOWED = 405, // Método não permitido — O método de solicitação utilizado não é suportado para o recurso solicitado
  NOT_ACCEPTABLE = 406, // Não aceitável — O servidor não é capaz de gerar conteúdo que atenda aos critérios fornecidos na solicitação
  PROXY_AUTHENTICATION_REQUIRED = 407, // Autenticação de proxy necessária — A autenticação é necessária para acessar o proxy solicitado
  REQUEST_TIMEOUT = 408, // Tempo limite da solicitação — O servidor encerrou a conexão devido a tempo limite da solicitação
  CONFLICT = 409, // Conflito — A solicitação não pôde ser concluída devido a um conflito com o estado atual do recurso
  GONE = 410, // Indisponível — O recurso solicitado não está mais disponível e não será novamente
  LENGTH_REQUIRED = 411, // Comprimento necessário — A solicitação não especificou o comprimento do conteúdo, que é necessário pelo servidor
  PRECONDITION_FAILED = 412, // Pré—condição falhou — Uma ou mais condições estabelecidas na solicitação foram violadas
  PAYLOAD_TOO_LARGE = 413, // Carga útil muito grande — O servidor não pode processar a solicitação porque o payload é muito grande
  URI_TOO_LONG = 414, // URI muito longo — O URI solicitado é muito longo e, portanto, o servidor não pode processar a solicitação
  UNSUPPORTED_MEDIA_TYPE = 415, // Tipo de mídia não suportado — O formato da mídia da solicitação não é suportado pelo servidor
  RANGE_NOT_SATISFIABLE = 416, // Faixa não satisfatória — O servidor não pode satisfazer a faixa de bytes solicitada
  EXPECTATION_FAILED = 417, // Expectativa falhou — A expectativa indicada na solicitação não pode ser atendida pelo servidor
  MISDIRECTED_REQUEST = 421, // Solicitação direcionada erroneamente — O servidor está direcionado a um servidor não capaz de produzir uma resposta
  UNPROCESSABLE_ENTITY = 422, // Entidade não processável — A solicitação está bem—formada, mas não pode ser processada devido a erros semânticos
  LOCKED = 423, // Fechado — O recurso está bloqueado e, portanto, não está disponível
  FAILED_DEPENDENCY = 424, // Dependência falhou — A solicitação falhou devido a falha em uma dependência necessária
  TOO_EARLY = 425, // Muito cedo — A solicitação não pode ser processada devido a uma condição anterior que é temporária ou transitória
  UPGRADE_REQUIRED = 426, // Atualização necessária — O cliente deve fazer a atualização para obter a resposta solicitada
  PRECONDITION_REQUIRED = 428, // Pré—condição necessária — O servidor exige que a solicitação seja condicional
  TOO_MANY_REQUESTS = 429, // Muitas solicitações — O usuário enviou muitas solicitações em um determinado período de tempo
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431, // Campos de cabeçalho da solicitação muito grandes — O servidor não pode processar a solicitação porque os campos de cabeçalho são muito grandes
  UNAVAILABLE_FOR_LEGAL_REASONS = 451, // Indisponível por motivos legais — O acesso ao recurso está indisponível devido a restrições legais

  INTERNAL_SERVER_ERROR = 500, // Erro interno do servidor — O servidor encontrou uma situação inesperada que o impediu de atender à solicitação
  NOT_IMPLEMENTED = 501, // Não implementado — O servidor ainda não suporta a funcionalidade solicitada
  BAD_GATEWAY = 502, // Gateway ruim — O servidor está atuando como um gateway ou proxy e recebeu uma resposta inválida do servidor upstream
  SERVICE_UNAVAILABLE = 503, // Serviço indisponível — O servidor está temporariamente indisponível (em manutenção, sobrecarregado etc.)
  GATEWAY_TIMEOUT = 504, // Tempo limite do gateway — O servidor está atuando como um gateway ou proxy e não recebeu uma resposta oportuna do servidor upstream
  HTTP_VERSION_NOT_SUPPORTED = 505, // Versão do HTTP não suportada — A versão do protocolo HTTP utilizado na solicitação não é suportada pelo servidor
  VARIANT_ALSO_NEGOTIATES = 506, // Variante também negocia — O servidor selecionou uma representação de recurso em um formato não suportado para a solicitação
  INSUFFICIENT_STORAGE = 507, // Armazenamento insuficiente — O servidor não pode armazenar a representação necessária para completar a solicitação
  LOOP_DETECTED = 508, // Detecção de ‘loop’ — O servidor detectou um loop infinito enquanto processava a solicitação
  NOT_EXTENDED = 510, // Não estendido — A solicitação precisa de mais extensões para ser concluída
  NETWORK_AUTHENTICATION_REQUIRED = 511 // Autenticação de rede necessária — O cliente deve autenticar—se para obter a resposta solicitada
}
