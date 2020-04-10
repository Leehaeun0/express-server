// State
let todos = [];
let active = 'all';

const $inputTodo = document.querySelector('.input-todo');
const $todos = document.querySelector('.todos');
const $completeAll = document.querySelector('.complete-all');
const $clearCompleted = document.querySelector('.clear-completed > .btn');
const $activeTodos = document.querySelector('.active-todos');
const $navActive = document.querySelector('.input-todo + .nav');


const clearCompleted = () => {
  $clearCompleted.firstElementChild.textContent = todos.filter(todo => todo.completed).length;
};

const activeTodos = () => {
  $activeTodos.textContent = todos.filter(todo => !todo.completed).length;
};

const render = () => {
  let html = '';

  const _todos = todos.filter(todo => (active === 'active' ? !todo.completed : (active === 'completed' ? todo.completed : todo)));

  _todos.forEach(todo => {
    html += ` <li id="${todo.id}" class="todo-item">
    <input id="ck-${todo.id}" class="checkbox"${todo.completed ? ' checked' : ''} type="checkbox">
    <label for="ck-${todo.id}">${todo.content}</label>
    <i class="remove-todo far fa-times-circle"></i>
  </li>`;
  });

  $todos.innerHTML = html;
  clearCompleted();
  activeTodos();
};


// const promiseAjax = (method, url, payload) => {

//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open(method, url);
//     xhr.setRequestHeader('content-type', 'application/json');
//     xhr.send(JSON.stringify(payload));

//     xhr.onload = () => {
//       if (xhr.status === 200 || xhr.status < 400) {

//         resolve(JSON.parse(xhr.response));

//       } else {
//         reject(new Error(xhr.status));
//       }
//     };
//   });

// };


const getTodos = async () => {
  await axios.get('/todos')
    .then(data => todos = data)
    .then(_todos => _todos.sort((todo1, todo2) => todo2.id - todo1.id))
    .then(render)
    .catch(console.error);
};


window.onload = getTodos;

const newId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 0);


$inputTodo.onkeyup = e => {
  if (e.keyCode !== 13 || $inputTodo.value.trim() === '') return;

  promiseAjax('POST', '/todos', { id: newId(), content: $inputTodo.value.trim(), completed: false })
    .then(data => todos = data)
    .then(() => $inputTodo.value = '')
    .then(render)
    .catch(console.error);
};


$todos.onchange = ({ target }) => {
  const { id } = target.parentNode;
  const completed = target.checked;

  promiseAjax('PATCH', `/todos/${id}`, { completed })
    .then(data => todos = data)
    .then(render)
    .catch(console.error);
};


$todos.onclick = ({ target }) => {
  if (!target.matches('.todos > li > .remove-todo')) return;
  const { id } = target.parentNode;

  promiseAjax('DELETE', `/todos/${id}`)
    .then(data => todos = data)
    .then(render)
    .catch(console.error);
};

$clearCompleted.onclick = () => {

  promiseAjax('DELETE', '/todos/completed')
    .then(data => todos = data)
    .then(render)
    .catch(console.error);
};

$completeAll.onchange = () => {
  const completed = $completeAll.firstElementChild.checked;

  promiseAjax('PATCH', '/todos', { completed })
    .then(data => todos = data)
    .then(render)
    .catch(console.error);
};

$navActive.onclick = ({ target }) => {
  if (!target.matches('.nav > li:not(.active)')) return;
  active = target.id;
  [...$navActive.children].forEach($nav => $nav.classList.toggle('active', $nav.id === active));
  render();
};

const _getTodos = async () => {
};
_getTodos();