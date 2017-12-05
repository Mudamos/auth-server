## Mudamos auth server

Aplicação responsável pelo login Mudamos.

## Variáveis de Ambiente

Durante o desenvolvimento pode ser feito o uso de um arquivo de exemplo de env vars.

```
$ cp .env.sample .env
```

Configure agora as env vars de acordo com sua necessidade.

- AUTHORIZATION_CODE_EXPIRATION_TIME_IN_MINUTES: tempo em minutos que o token (code) do fluxo de *authorization grant* expirará.
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
