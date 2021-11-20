const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];


// middleware - checar se o username existe
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = users.find((user) => user.username === username)
  if (!user) {
    return response.status(404).send({ error: "User Not found" })
  }
  request.username = user
  return next()
}

// Criar usuário passando name e username pelo body, criar objeto com id,name,username,todo
app.post('/users', (request, response) => {
  const { name, username } = request.body

  // teste: autenticar se o usuário existe
  const auntenticarUsers = users.some((user) => user.username === username)
  if (auntenticarUsers) {
    return response.status(400).json({ error: "User exists" })
  }

  // criação do objeto
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(newUser)

  return response.status(201).json(newUser)
});

// Retornar todo de um usuário. 
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request
  return response.json(username.todos)
});

// Criar todo: title e deadline passado pelo corpo
app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body
  const { username } = request

  // Criação do obejto todo
  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  // passando objeto todo para a lista do usuário
  username.todos.push(newTodo)

  response.status(201).json(newTodo)
});

// Update do title e deadline do todo
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Completo aqui
  const id = request.params.id
  const { title, deadline } = request.body
  const { username } = request

  // Busca pelo user.id === id 
  const update = username.todos.find((user) => user.id == id)
  // teste: verificar se o id do usuário existe
  if(!update){
    return response.status(404).send({error: "ID not exists"})
  }
  update.title = title
  update.deadline = new Date(deadline)

  return response.json(update)

});

// Marcar um todo como feito
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // pegar o id na rota
  const id = request.params.id
  const { username } = request

  // busca o indice do todo e na chave done altera para true
  const updateDoneTodo = username.todos.find((userId) => userId.id === id)
  // teste : verificar se o id do todo existe
  if(!updateDoneTodo){
    return response.status(404).json({error: "Todo not found"})
  }
  updateDoneTodo.done = true

  return response.json(updateDoneTodo)
});

// Deletar um usuário
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const id = request.params.id
  const { username } = request

  // teste : verifica se o todo existe
  const deleteTodo = username.todos.some((userId) => userId.id === id)
  if(!deleteTodo){
    return response.status(404).json({error: "Todo not found"})
  }

  // busca o id e exclui
  username.todos = username.todos.filter((userId) => userId.id !== id)

  return response.status(204).send()
});

module.exports = app;


