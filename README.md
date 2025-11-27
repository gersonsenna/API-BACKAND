# API-BACKAND
# API de Tarefas - TRABALHO FINAL
# GRUPO : GERSON; THIAGO; HUGO

## Descrição
API de Contatos – Projeto Final (Node.js + Express + MongoDB + JWT)

API RESTful completa construída com Node.js, Express, MongoDB e autenticação JWT.
Projeto desenvolvido seguindo as práticas exigidas pela disciplina, incluindo:

Arquitetura MVC
JWT Authentication
CRUD completo
Testes automatizados
Swagger Documentation
MongoDB com Mongoose

### Tecnologias Utilizadas

Node.js
Express
MongoDB Atlas
Mongoose
JWT (jsonwebtoken)
Bcryptjs
Nodemon
Jest
Supertest
MongoMemoryServer (testes em memória)
Swagger UI + YAML

# Como Rodar o Projeto
Clonar o repositório
git clone <[URL do repositório](https://github.com/gersonsenna/API-BACKAND.git)>
cd praticaFinal

## Instalar dependências
npm install

### Configurar o arquivo .env
Crie um arquivo .env dentro da pasta praticaFinal:

MONGODB_USER=usrTarefas
MONGODB_PSWD=sennaa220
MONGODB_HOST=cluster0.d57rcct.mongodb.net
MONGODB_DATABASE=pratica10

JWT_SECRET=abcd1234
JWT_EXPIRES=60

#### Rodar o servidor
npm run dev


Server rodará em:
http://localhost:3000

##### Rodar os testes
npm test

Os testes utilizam o MongoMemoryServer, então nenhum dado real é alterado.

# Documentação (Swagger)

URL:
http://localhost:3000/api-docs


Inclui:
Listagem de endpoints
Schemas
Autenticação
Exemplos
Validações

Autenticação
A API usa JWT nas rotas de contatos.

Obter token
POST /usuarios/login


Body:

{
  "email": "email@exemplo.com",
  "senha": "abcd1234"
}


Resposta:

{
  "token": "..."
}


Envie o token no header:

Authorization: Bearer SEU_TOKEN


# EndPoints Principais
# Usuários
POST /usuarios/registrar

Cria usuário.

POST /usuarios/login

Retorna token JWT.

# Contatos (Protegidos)
GET /api/contatos

Lista o contato do usuário.

GET /api/contatos/:id

Retorna contato específico.

POST /api/contatos

Cria um contato.

PUT /api/contatos/:id

Atualiza um contato.

DELETE /api/contatos/:id

Remove um contato.

# Testes Automatizados

Os testes cobrem:

✔ Registrar usuário
✔ Login
✔ Criar contato
✔ Listar contatos
✔ Buscar por ID
✔ Atualizar
✔ Deletar
✔ Validações
✔ Segurança JWT

Bancos reais não são usados nos testes (MongoMemoryServer).

# Arquitetura da Aplicação
praticaFinal/
│
├── app.js
├── bin/www
├── controllers/
├── middlewares/
├── models/
├── routes/
├── tests/
├── swagger.yaml
├── package.json
└── README.md


Totalmente padrão MVC + REST + Clean Code.

# Integrantes do Grupo

## Gerson França Senna

Estrutura inicial do projeto

Rotas base

Organização do repositório

Setup do Swagger

Revisão e integração final

## 

Implementação dos controllers

Modelos do MongoDB

Middlewares de autenticação

## 
Testes automatizados

Ajustes de validação

Revisão Swagger

