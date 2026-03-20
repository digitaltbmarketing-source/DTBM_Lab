const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }
}

async function readTasks() {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(data || '[]');
}

async function saveTasks(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

app.get('/api/tasks', async (_req, res) => {
  try {
    const tasks = await readTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível carregar as tarefas.' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'O título da tarefa é obrigatório.' });
    }

    const tasks = await readTasks();
    const task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false
    };

    tasks.push(task);
    await saveTasks(tasks);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível criar a tarefa.' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await readTasks();
    const task = tasks.find((item) => item.id === req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    task.completed = Boolean(req.body.completed);
    await saveTasks(tasks);

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível atualizar a tarefa.' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const tasks = await readTasks();
    const updatedTasks = tasks.filter((item) => item.id !== req.params.id);

    if (updatedTasks.length === tasks.length) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' });
    }

    await saveTasks(updatedTasks);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível excluir a tarefa.' });
  }
});

ensureDataFile()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao inicializar o servidor:', error);
    process.exit(1);
  });
