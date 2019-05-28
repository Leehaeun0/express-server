const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

let todos = [
  { id: 3, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 1, content: 'Javascript', completed: false }
];

const generateId = () => Math.max(...todos.map(todo => todo.id)) + 1;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send(`<h1>${req.protocol}://${req.get('host')}${req.originalUrl}</h1>`));

app.get('/todos', (req, res) => {
  console.log('[GET]');
  res.send(todos);
});

app.get('/todo/:id', (req, res) => {
  const { id } = req.params;
  console.log('[GET] req.params.id => ', req.params.id);

  res.send(todos.filter(todo => todo.id === +id));
});

app.post('/todo', (req, res) => {
  const { content } = req.body;
  console.log('[POST] req.body => ', content);

  todos = [{ id: generateId(), content, completed: false }, ...todos];
  res.send(todos);
});

app.delete('/todo/:id', (req, res) => {
  const { id } = req.params;
  console.log('[DELETE] req.params.id => ', req.params.id);

  todos = todos.filter(todo => todo.id !== +id);
  res.send(todos);
});

// 갱신
app.put('/todo/:id', (req, res) => {
  const { id } = req.params;
  console.log('[PUT] req.params.id => ', req.params.id);

  todos = todos.map(todo => todo.id === +id ? {...todo, completed: !todo.completed } : todo);
  res.send(todos);
});

// 전체 일괄 갱신
app.patch('/todo', (req, res) => {
  const { completed } = req.body;
  console.log('[PATCH] req.body => ', completed);

  todos = todos.map(todo => ({...todo, completed }));
  res.send(todos);
});

app.listen(9000, () => console.log('Simple Rest API Server listening on port 9000'));
