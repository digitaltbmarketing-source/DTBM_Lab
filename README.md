# Sistema Web de Lista de Tarefas

Aplicação web simples de lista de tarefas com frontend em **HTML + CSS + JavaScript** e backend em **Node.js + Express**. As tarefas são salvas localmente em um arquivo JSON.

## Funcionalidades

- Adicionar tarefa
- Marcar tarefa como concluída
- Excluir tarefa
- Persistência local em `data/tasks.json`

## Estrutura do projeto

```text
.
├── data/
│   └── tasks.json
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── package.json
└── server.js
```

## Requisitos

- Node.js 18+ instalado
- npm instalado

## Como rodar o projeto

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor:

   ```bash
   npm start
   ```

3. Abra no navegador:

   ```text
   http://localhost:3000
   ```

## API disponível

- `GET /api/tasks` — lista as tarefas
- `POST /api/tasks` — cria uma nova tarefa
- `PATCH /api/tasks/:id` — atualiza o status de conclusão
- `DELETE /api/tasks/:id` — remove uma tarefa

## Observação

As tarefas ficam armazenadas no arquivo `data/tasks.json`, permitindo manter os dados mesmo após reiniciar o servidor.
