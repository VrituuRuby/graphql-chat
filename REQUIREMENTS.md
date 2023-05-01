# Usuário

**Regras Funcionais**

- [x] Deve ser possível criar um usuário novo
- [x] Deve ser possível atualizar informações do usuário (email, nome, senha)
- [x] Deve ser possível deletar um usuário

**Regras de Negócio**

- [x] Nao deve ser possível criar um usuário com email existente
- [x] Não deve ser possível atualizar informações de usuário inexistente
- [x] Não deve ser possível deletar um usuário inexistente
- [] Usuário deve estar autenticado para atualizar informações

# Salas

**Regras Funcionais**

- [] Deve ser possível criar uma sala nova apenas com o usuário dono
- [] Deve ser possível criar uma sala com mais de um usuário
- [] Deve ser possível adicionar usuários existentes a uma sala
- [] Deve ser possível adicionar permissões à usuários existentes
- [] Deve ser possível remover usuários existentes de uma sala

**Permissões para usuários de uma sala**

- Adicionar usuários
- Remover usuários
- Enviar mensagens
- Alterar permissões

**Regras de Negócio**

- [] Não deve ser possível criar uma sala se usuário não está autenticado
- [] Não deve ser possível adicionar usuários se não tiver a permissão
- [] Não deve ser possível adicionar usuários inexistentes à uma sala

- [] Não deve ser possível remover usuários se não tiver a permissão
- [] Não deve ser possível remover usuários inexistentes à uma sala

- [] Não deve ser possível criar mensagens se não tiver a permissão
- [] Não deve ser possível criar mensagens se não estiver autenticado

# Mensagens

**Regras Funcionais**

- [] Deve ser possível criar uma mensagem
- [] Deve ser possível listar todas as mensagens de uma sala
- [] Deve ser possível realizar uma assinatura (SUBSCRIPTION) para receber novas mensagens de uma sala

**Regras de negócio**

- [] Não deve ser possível criar uma mensagem se usuário não estiver autenticado
- [] Não deve ser possível criar uma mensagem em uma sala inexistente
- [] Não deve ser possível listar as mensagens se usuário não pertencer à sala
- [] Não deve ser possível listar as mensagens de usuário não estiver autenticado
