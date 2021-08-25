const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const exists = users.find(user => user.username === username);
  if (!exists) {
    response.status(404).json({error: "Username not found!"});
  }
  
  request.username = username;
  
  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  
  const exists = users.find(user => user.username === username);
  if (exists) {
    response.status(400).json({error: "Username already exists!"});
  }
  
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };
  
  users.push(user);
  
  response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request;
  
  const user = users.find(user => user.username === username);
  
  response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { username } = request;
  
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  const user = users.find(user => user.username === username);
  user.todos.push(todo);
  
  response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { username } = request;

  const user = users.find(user => user.username === username);
  const todo = user.todos.find(todo => todo.id === id);
  
  if (!todo) {
    response.status(404).json({error: "Todo not exists!"});
  }
  
  todo.title = title;
  todo.deadline = new Date(deadline);

  response.status(200).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request;
  const { id } = request.params;

  const user = users.find(user => user.username === username);
  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    response.status(404).json({error: "Todo not exists!"});
  }
  
  todo.done = true;
  
  response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request;
  const { id } = request.params;

  const user = users.find(user => user.username === username);
  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    response.status(404).json({error: "Todo not exists!"});
  }
  
  user.todos = user.todos.filter(todo => todo.id !== id);
  
  response.status(204).send();
});

module.exports = app;