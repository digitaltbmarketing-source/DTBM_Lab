const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const message = document.getElementById('message');

async function fetchTasks() {
  const response = await fetch('/api/tasks');

  if (!response.ok) {
    throw new Error('Não foi possível buscar as tarefas.');
  }

  return response.json();
}

async function createTask(title) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar tarefa.');
  }
}

async function updateTask(id, completed) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao atualizar tarefa.');
  }
}

async function deleteTask(id) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao excluir tarefa.');
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'Nenhuma tarefa cadastrada ainda.';
    taskList.appendChild(emptyState);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = 'task-item';

    const content = document.createElement('div');
    content.className = 'task-content';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', async () => {
      try {
        clearMessage();
        await updateTask(task.id, checkbox.checked);
        await loadTasks();
      } catch (error) {
        showMessage(error.message);
        checkbox.checked = !checkbox.checked;
      }
    });

    const title = document.createElement('span');
    title.className = `task-title${task.completed ? ' completed' : ''}`;
    title.textContent = task.title;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Excluir';
    deleteButton.addEventListener('click', async () => {
      try {
        clearMessage();
        await deleteTask(task.id);
        await loadTasks();
      } catch (error) {
        showMessage(error.message);
      }
    });

    content.append(checkbox, title);
    item.append(content, deleteButton);
    taskList.appendChild(item);
  });
}

function showMessage(text) {
  message.textContent = text;
}

function clearMessage() {
  message.textContent = '';
}

async function loadTasks() {
  try {
    clearMessage();
    const tasks = await fetchTasks();
    renderTasks(tasks);
  } catch (error) {
    showMessage(error.message);
  }
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (!title) {
    showMessage('Digite uma tarefa antes de adicionar.');
    return;
  }

  try {
    clearMessage();
    await createTask(title);
    taskInput.value = '';
    await loadTasks();
  } catch (error) {
    showMessage(error.message);
  }
});

loadTasks();
