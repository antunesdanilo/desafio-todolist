# TodoList

## Sobre

Esta aplicação tem como objetivo permitir que o usuário faça o gerenciamento de uma lista de tarefas, divisão de tarefas, com definição de prazo e a possibilidade de marcar a tarefa como feita, além da possibilidade de compartilhar a lista criada com um ou mais usuários para que possam colaborar.

## Tecnologias Utilizadas

No desenvolvimento desta aplicação foram utilizadas as seguintes tecnologias:

- <a href="https://nodejs.org" target="_blank">NodeJS</a> - Interpretador javascript
- <a href="https://adonisjs.com" target="_blank">AdonisJS</a> - Framework backend
- <a href="https://pt-br.reactjs.org" target="_blank">ReactJS</a> - Framework frontend
- <a href="https://getbootstrap.com" target="_blank">Bootstrap</a> - Componentes estilizados

## Demonstração Online

A aplicação foi "containerizada", e as imagens criadas foram enviadas ao Elastic Container Registry, da AWS.

Foi usado o Elastic Container Service, também da AWS, para orquestração dos containeres.

A demonstração está  hospedada <a href="http://desafio-todolist.socialfitness.com.br" target="_blank">aqui</a>.

## Download

```bash
# Clonar o repositório
$ git clone https://github.com/antunesdanilo/desafio-todolist

# Instalar as dependências do backend
$ cd backend && npm install

# Instalar as dependências do frontend
$ cd frontend && npm install
```

## Configuração do banco de dados

Instale um sgbd da sua preferência

Entre na pasta do projeto, em seguida na pasta backend, e crie os arquivos “.env” e “.env.testing”, e configure as variáveis de ambiente seguindo o exemplo em “.env.example”

Execute:
```
node ace run:migration
```


## Instalação em container

Pré-requisitos

Docker<br/>
NodeJs<br/>
NPM

### Com docker compose

```bash
# Entrar no diretório do projeto
$ cd desafio-todolist

# Fazer o build das imagens e criar os containers
$ docker-compose up -d --build
```

### Com containers isolados

```bash
# Entrar no diretório do projeto
$ cd desafio-todolist

# Entrar no sub-diretório backend
$ cd backend

# Fazer o build da imagem
$ docker build -t todolist/backend .

# Executar o container
$ docker run -it -p 3333:3333 todolist/backend


# Entrar no sub-diretório frontend
$ cd frontend

# Fazer o build da imagem
$ docker build -t todolist/frontend .

# Executar o container
$ docker run -it -p 80:80 todolist/frontend
```

Acessar <a href="http://localhost" target="_blank">localhost</a>

## Instalação local

Pré-requisitos

NodeJS<br/>
NPM

```bash
# Clonar o repositório
$ git clone https://github.com/antunesdanilo/desafio-todolist

# Entrar no diretório do projeto
$ cd desafio-todolist

# Iniciar o backend
$ cd backend && npm run dev

# Iniciar o frontend
$ cd frontend && npm start
```

Acessar <a href="http://localhost" target="_blank">localhost</a>

## Testes

### Backend

```bash
# Entrar no diretório do projeto
$ cd desafio-todolist

# Entrar no sub-diretório backend
$ cd backend

# Execução do servidor de testes (necessário para a transpilação dos arquivos ts em js)
$npm run dev

# Execução dos testes
$ npm run test
```

### Frontend

```bash
# Entrar no diretório do projeto
$ cd desafio-todolist

# Execução do servidor de testes do backend em ambiente de testes
$ cd backend && npm run dev-test

# Execução dos testes
$ cd frontend && npm run test
```

---
Desenvolvido por @DaniloAntunes - 2022

