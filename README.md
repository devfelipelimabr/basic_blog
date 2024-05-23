# Blog - API RESTful

Esta é uma API RESTful desenvolvida em Node.js para gerenciar um blog de política. Ela utiliza o PostgreSQL como banco de dados, o Sequelize como ORM, o Express para criar as rotas e o Helmet para segurança. A API permite gerenciar usuários (assinantes, escritores e administradores), categorias e posts.

## Recursos

- **Autenticação:** Login e logout de usuários por sessão.
- **Usuários:** Criação, leitura, atualização e exclusão de usuários, com diferentes roles (assinante, escritor, administrador).
- **Categorias:** Criação, leitura, atualização e exclusão de categorias de posts.
- **Posts:** Criação, leitura, atualização e exclusão de posts, com associação ao autor e à categoria.
- **Segurança:** Utiliza Helmet para proteção contra vulnerabilidades comuns da web.
- **Validação de Dados:** Utiliza Express Validator para validar os dados enviados nas requisições.

## Pré-requisitos

- Node.js e NPM (ou Yarn) instalados.
- PostgreSQL instalado e configurado.

## Instalação

1. Clone este repositório: `git clone https://seu-repositorio.git`
2. Acesse a pasta do projeto: `cd basic_blog`
3. Instale as dependências: `npm install` (ou `yarn install`)
4. Crie o banco de dados PostgreSQL com o nome especificado em `.env`.
5. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:
    - `DB_HOST`
    - `DB_USER`
    - `DB_PASSWORD`
    - `DB_NAME`
    - `DB_PORT`
    - `SESSION_SECRET` (uma string aleatória para usar como chave secreta das sessões)
6. Rode as migrations para criar as tabelas: `npx sequelize-cli db:migrate` (ou `yarn sequelize db:migrate`)

## Uso

1. Inicie o servidor: `npm start` (ou `yarn start`)
2. A API estará disponível em `http://localhost:3000/api` (ou na porta que você configurou).

## Rotas da API

### Usuários

- `POST /api/users/login`: Faz login do usuário.
- `POST /api/users/logout`: Faz logout do usuário.
- `POST /api/users`: Cria um novo usuário.
- `GET /api/users`: Lista todos os usuários (apenas para administradores).
- `GET /api/users/:id`: Retorna os detalhes de um usuário (apenas para o próprio usuário ou administradores).
- `PUT /api/users/:id`: Atualiza um usuário (apenas para o próprio usuário ou administradores).
- `DELETE /api/users/:id`: Exclui um usuário (apenas para administradores).

### Categorias

- `GET /api/categories`: Lista todas as categorias.
- `GET /api/categories/:id`: Retorna os detalhes de uma categoria.
- `POST /api/categories`: Cria uma nova categoria (apenas para administradores).
- `PUT /api/categories/:id`: Atualiza uma categoria (apenas para administradores).
- `DELETE /api/categories/:id`: Exclui uma categoria (apenas para administradores).

### Posts

- `GET /api/posts`: Lista todos os posts.
- `GET /api/posts/:id`: Retorna os detalhes de um post.
- `POST /api/posts`: Cria um novo post (apenas para escritores).
- `PUT /api/posts/:id`: Atualiza um post (apenas para o autor do post ou administradores).
- `DELETE /api/posts/:id`: Exclui um post (apenas para o autor do post ou administradores).

## Contribuição

Sinta-se à vontade para contribuir para o projeto. Abra uma issue para relatar bugs ou sugerir melhorias. Faça um fork do repositório e envie um pull request com suas alterações.

## Licença

Este projeto está licenciado sob a licença ISC.