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
    return response.status(400).send({ error: "User exists" })
  }

  // criação do objeto
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todo: []
  }
  users.push(newUser)

  return response.status(201).send(newUser)
});

// Retornar todo de um usuário. 
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request
  return response.json(username.todo)
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
  username.todo.push(newTodo)

  response.status(201).json(newTodo)
});

// Update do title e deadline do todo
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Completo aqui
  const id = request.params.id
  const { title, deadline } = request.body
  const { username } = request

  // Busca pelo user.id === id 
  const update = username.todo.findIndex((user) => user.id == id)
  // teste: verificar se o id do usuário existe
  if(update === -1){
    return response.status(404).send({error: "ID not exists"})
  }
  username.todo[update].title = title
  username.todo[update].deadline = deadline

  return response.status(201).send()

});

// Marcar um todo como feito
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // pegar o id na rota
  const id = request.params.id
  const { username } = request

  // busca o indice do todo e na chave done altera para true
  const updateDoneTodo = username.todo.findIndex((userId) => userId.id === id)
  // teste : verificar se o id do todo existe
  if(updateDoneTodo === -1){
    return response.status(404).json({error: "Todo not found"})
  }
  username.todo[updateDoneTodo].done = true

  return response.status(201).send()
});

// Deletar um usuário
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const id = request.params.id
  const { username } = request

  // teste : verifica se o todo existe
  const deleteTodo = username.todo.some((userId) => userId.id === id)
  if(!deleteTodo){
    return response.status(404).json({error: "Todo not found"})
  }

  // busca o id e exclui
  username.todo = username.todo.filter((userId) => userId.id !== id)

  return response.status(204).send()
});

module.exports = app;


