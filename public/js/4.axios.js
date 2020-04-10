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


const getTodos = () => {
  axios.get('/todos')
    // .then(res => todos = res.data) // 아래와 같다.
    .then(({ data }) => todos = data)
    .then(render)
    .catch(console.error);
};


window.onload = getTodos; 

const newId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 0);


$inputTodo.onkeyup = e => {
  const inputValue = $inputTodo.value.trim();
  if (e.keyCode !== 13 || inputValue === '') return;
  $inputTodo.value = '';

  axios.post('/todos', { id: newId(), content: inputValue, completed: false })
    .then(({ data }) => todos = data)
    .then(render)
    .catch(console.error);
};


$todos.onchange = ({ target }) => {
  const { id } = target.parentNode;
  const completed = target.checked;

  axios.patch(`/todos/${id}`, { completed })
    .then(({ data }) => todos = data)
    .then(render)
    .catch(console.error);
};


$todos.onclick = ({ target }) => {
  if (!target.matches('.todos > li > .remove-todo')) return;
  const { id } = target.parentNode;

  axios.delete(`/todos/${id}`)
    .then(({ data }) => todos = data)
    .then(render)
    .catch(console.error);
};

$clearCompleted.onclick = () => {

  axios.delete('/todos/completed')
    .then(({ data }) => todos = data)
    .then(render)
    .catch(console.error);
};

$completeAll.onchange = () => {
  const completed = $completeAll.firstElementChild.checked;

  axios.patch('/todos', { completed })
    .then(({ data }) => todos = data)
    .then(render)
    .catch(console.error);
};

$navActive.onclick = ({ target }) => {
  if (!target.matches('.nav > li:not(.active)')) return;
  active = target.id;
  [...$navActive.children].forEach($nav => $nav.classList.toggle('active', $nav.id === active));
  render();
};
