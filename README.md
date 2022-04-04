# TodoList

## Avaliação do Escopo

Foi feita a avaliação do pedido do cliente, e após trocas de mensagens para esclarecer alguns pontos, partimos para a etapa de planejamento, e após o detalhamento das atividades a serem executadas, estimamos que serão necessárias 80 horas de trabalho, distribuídas ao longo de 13 dias úteis, sendo que as atividades foram divididas da seguinte forma:

- Definição do escopo e plano de trabalho: 4 horas

- Modelagem de dados e operacionalização dos esquemas no sistema gerenciador: 4 horas

Deverá ser possível ao usuário criar uma conta e se autenticar no aplicativo: 12 horas, assim distribuídas:
- Criação da conta: 4 horas
- Autenticação no aplicativo: 4 horas
- Validação de token criado no processo de autenticação: 2 horas
- Logout, com destruição do token criado no processo de autenticação: 2 horas

Durante o carregamento inicial da aplicação, será mostrada uma tela de boas-vindas, enquanto é verificado em background se há um token válido armazenado em um cookie do navegador: 4 horas

O usuário autenticado deverá visualizar no topo da tela um menu, em que deverá haver os links para as páginas “Tela Inicial”, “Sobre” e “Atividades”, além de um avatar, o nome do usuário logado e um botão para efetuar logout: 4 horas

O usuário autenticado deverá visualizar uma tela inicial, com explicações sobre como criar uma nova lista, editar uma já existente e excluir: 4 horas

Deverá ser possível ao usuário autenticado criar e gerenciar uma lista de tarefas, bem como compartilhá-la com outros usuários: 40 horas, assim distribuídas:
- Enumerar as listas criadas pelo usuário e as que tenham sido compartilhadas com ele: 4 horas
- Criação da lista, com informação do nome e url: 6 horas
- Visualização da lista vazia, após a sua criação: 2 horas
- Inserir uma atividade na lista ou uma sub-atividade como item filho de uma atividade: 4 horas
- Remover da lista uma atividade ou subatividade que seja sua: 4 horas
- Transformar uma atividade em sub-atividade, e vice-versa, através de movimentos com o mouse: 4 horas
- Marcar/desmarcar como feita uma atividade ou sub-atividade: 2 horas
- Excluir uma lista que seja sua: 4 horas
- Compartilhar uma lista por e-mail, para uma ou mais pessoas: 6 horas

Testes automatizados: 12 horas

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
$ git clone https://git.vibbra.com.br/danilo-1647822560/to-do-list.git

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
$ cd to-do-list

# Fazer o build das imagens e criar os containers
$ docker-compose up -d --build
```

### Com containers isolados

```bash
# Entrar no diretório do projeto
$ cd to-do-list

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
$ git clone https://git.vibbra.com.br/danilo-1647822560/to-do-list.git

# Entrar no diretório do projeto
$ cd to-do-list

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
$ cd to-do-list

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
$ cd to-do-list

# Execução do servidor de testes do backend em ambiente de testes
$ cd backend && npm run dev-test

# Execução dos testes
$ cd frontend && npm run test
```

---
Desenvolvido por @DaniloAntunes - 2022

