import React from 'react';

const Home: React.FC = () => {
  return (
    <div id="home" className="container-fluid">
      <div className="row content-header">
        <div className="col-sm-12">
          <h2>Home</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <h5>Sobre a ferramenta</h5>
          <br />
          Esta aplicação tem como objetivo permitir que o usuário faça o gerenciamento de uma lista
          de tarefas, divisão de tarefas, com definição de prazo e a possibilidade de marcar a
          tarefa como feita, além da possibilidade de compartilhar a lista criada com um ou mais
          usuários para que possam colaborar.
          <br />
          <br />
          <h5>
            Para gerenciar as suas listas e as que foram compartilhadas com você, naveque até a
            página &quot;Tarefas&quot; e siga as seguintes instruções:
          </h5>
          <br />
          <h5>1. Criar uma nova lista</h5>
          <br />- Clique no botão &quot;Adicionar&quot;
          <br />- Digite um nome e um endereço para a sua lista
          <br />- Clique no botão &quot;Salvar&quot;
          <br />- Se a adição for bem sucedida, você será redirecionado para a página de edição da
          lista
          <br />
          <br />
          <h5>2. Editar uma lista existente</h5>
          <br />- Clique sobre o nome da lista que deseja deseja editar, para navegar até a sua
          página de edição
          <br />- Digite um nome e selecione um prazo e clique no botão adicionar para inserir uma
          tarefa na lista
          <br />- Com uma tarefa selecionada, digite um nome e clique no botão adicionar inserir uma
          tarefa como sub-tarefa da tarefa selecionada
          <br />- Clique no botão com um &quot;x&quot;, ao lado direito da tarefa, para removê-la,
          desde tenha sido você quem a criou
          <br />- Clique sobre o box de checagem, na linha corresponde à tarefa que deseja editar,
          para marcá-la como concluída
          <br />
          <br />
          <h5>3. Compartilhar uma lista</h5>
          <br />- Clique sobre o botão com o íconde compartilhar correspondente à lista que deseja
          compartilhar
          <br />- Será aberta uma janela modal
          <br />- Digite uma palavra-chave para pesquisar por usuários
          <br />- Clique sobre o nome do usuário desejado na lista que aparecerá
          <br />- Pronto, o usuário selecionado já poderá colaborar com a sua lista
          <br />
          <br />
          <h5>4. Excluir</h5>
          <br />- Clique no botão com um &quot;x&quot;, ao lado direito da lista correspondente,
          para excluí-la, desde que tenha sido você quem a criou
          <br />- Esta ação é irreversível
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Home;
