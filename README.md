## Mudamos auth server

Aplicação responsável pelo login Mudamos.

## Variáveis de Ambiente

Durante o desenvolvimento pode ser feito o uso de um arquivo de exemplo de env vars.

```
$ cp .env.sample .env
```

Configure agora as env vars de acordo com sua necessidade.

- ACCESS_TOKEN_EXPIRATION_DURATION_IN_DAYS: tempo em dias que o token de acesso (access token) expirará
- AUTHORIZATION_CODE_EXPIRATION_DURATION_IN_MINUTES: tempo em minutos que o token (code) do fluxo de *authorization grant* expirará
- DB_HOST: host do banco postgres primário
- DB_USER: usuário do banco
- DB_PASS: password do banco
- DB_PORT: porta do banco
- DB_NAME: nome do banco
- DB_POOL_MAX_CONNECTIONS: número máximo de conexões do pool do banco
- DB_POOL_MIN_CONNECTIONS: número mínimo de conexões do pool do banco
- DB_LOGGING: boleano (loga queries do banco)
- NODE_ENV: environment da app
- PORT: porta que o serviço web rodará
- REFRESH_TOKEN_EXPIRATION_DURATION_IN_DAYS: tempo em dias que o resfresh token expirará
- SESSION_SECRET_KEYS: valor separado por vírgulas que representa chaves que irão ser utilizadas para encriptar o cookie de sessão do usuário
  - obs: por padrão a primeira chave será usada em novos cookies, mas as chaves antigas podem ser utilizadas para desencriptar cookies antigos

### Arquitetura

A aplicação usa um banco primário *postgres*.

### Oauth server

Os fluxos implementados atualmente são:

- Authorization code grant: Utilizado para obter um código que posteriormente pode ser trocado por um token de acesso.

### Desenvolvimento

#### Env vars
  Configure a variáveis de ambiente conforme necessidade (ver `.env.sample`).

#### Yarn (package manager)

Este projeto utiliza o package manager `yarn`. Veja como instalar [no site do yarn](https://yarnpkg.com/en/docs/install).

Obs. **Não** use o npm.

#### Instalar dependências

Rode,

```
$ yarn
```

#### Hot reload durante desenvolvimento

```
$ nodemon
```

ou

```
$ yarn run hotreload
```

#### Lint

```
$ yarn run lint
```

#### Console

Acesse um console REPL com grande partes das funcionalidades carregadas. Você também pode usar o auto complete.


```
$ ./bin/console
```

### Rodando migrações

Para executar as migrações:


```
$ sequelize db:migrate
```

Desfazer a última migração:

```
$ sequelize db:migrate:undo
```

Mais informações com:

```
$ sequelize --help
```

### Criando um novo cliente oauth

Abra o *console*,


```
$ ./bin/console
```

Agora execute passando os dados de acordo com o necessário

```
$ createClient({
  // both response types allowed and grants
  grants: ["authorization_code", "password", "refresh_token", "code", "token"],
  name: "A nice client",
  redirectUris: ["http://localhost:4001/result", "http://localhost:4001/resultoauth"],
})
```

O result será o um modulo de cliente e o mais importante seu secret, que deve ser sálvo uma vez que é **impossível** recuperá-lo. Esse secret deve ser passado ao cliente e deve ser usado por ele para se autenticar na api.

Exemplo:

```
{ client:
   { id: '4',
     createdAt: 2017-12-05T10:45:18.416Z,
     grants: [ 'authorization_code', 'password', 'refresh_token', 'code', 'token' ],
     name: 'A nice client',
     redirectUris:
      [ 'http://localhost:4001/result',
        'http://localhost:4001/resultoauth' ],
     secret: '$2a$10$bXNCgncUy2J69HJoEwMGoeSQzf1//9GOYWwVVY2NYkoL4//lHKeKS',
     updatedAt: 2017-12-05T10:45:18.416Z },
  secret: 'eafe99f0b5ce045a1c1ed9ce2f4ca4244a148d0f995d1ca36eef9bad80522883' }
```
