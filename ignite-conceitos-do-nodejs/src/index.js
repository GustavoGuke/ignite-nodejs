const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = users.find((user) => user.username === username)

  if (!user) {
    return response.status(404).send({ error: "User Not found" })
  }

  request.username = user

  return next()

}

app.post('/users', (request, response) => {
  // Completo aqui
  const { name, username } = request.body

  const auntenticarUsers = users.some((user) => user.username === username)

  if (auntenticarUsers) {
    return response.status(400).send({ error: "User exists" })
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todo: []

  })

  return response.status(201).send(users)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Completo aqui
  const { username } = request
  return response.json(username.todo)


});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body
  const { username } = request

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  username.todo.push(newTodo)

  response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Completo aqui
  const id = request.params.id
  const { title, deadline } = request.body
  const { username } = request

  const update = username.todo.findIndex((user) => user.id == id)

  username.todo[update].title = title
  username.todo[update].deadline = deadline

  return response.status(201).send()

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Completo aqui
  const id = request.params.id
  const { username } = request

  const updateDoneTodo = username.todo.some((userId) => userId.id === id)
  if(!updateDoneTodo){
    return response.status(404).json({error: "Todo not found"})
  }

  const updateDone = username.todo.findIndex((user) => user.id == id)
  username.todo[updateDone].done = true

  return response.status(201).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const id = request.params.id
  const { username } = request

  const deleteTodo = username.todo.some((userId) => userId.id === id)
  if(!deleteTodo){
    return response.status(404).json({error: "Todo not found"})
  }
  username.todo = username.todo.filter((userId) => userId.id !== id)

  return response.status(204).send()
});

module.exports = app;


