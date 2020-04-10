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



const getTodos = () => {
  fetch('/todos') // 패치가 response 객체를 만들어서 매개변수 res로 전달해 준다.
    .then(res => res.json())
    // response 객체 중에서 body부분만 필요하니 그것만 걸러내는 res.json 작업이 필요하다. 
    // 이 값은 프로미스 객체가 되는데 then() 메소드는 반환값이 프로미스인 경우 또다시 프로미스 객체로 싸지 않는다. 
    .then(data => todos = data)
    .then(render)
    .catch(error => console.error('Error:', error));
};


window.onload = getTodos; // 온로드 없어도 되나?

const newId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 0);


$inputTodo.onkeyup = e => {
  const inputValue = $inputTodo.value.trim();
  if (e.keyCode !== 13 || inputValue === '') return;
  $inputTodo.value = '';

  fetch('/todos', {
    method: 'POST',
    body: JSON.stringify({ id: newId(), content: inputValue, completed: false }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => todos = data)
    .then(render)
    .catch(error => console.error('Error:', error));
};


$todos.onchange = ({ target }) => {
  const { id } = target.parentNode;
  const completed = target.checked;

  fetch(`/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
    headers: { 'Content-Type': 'application/json' } 
  })
    .then(res => res.json())
    .then(data => todos = data)
    .then(render)
    .catch(error => console.error('Error:', error));
};


$todos.onclick = ({ target }) => {
  if (!target.matches('.todos > li > .remove-todo')) return;
  const { id } = target.parentNode;

  fetch(`/todos/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => todos = data)
    .then(render)
    .catch(console.error);
};

$clearCompleted.onclick = () => {

  fetch('/todos/completed', {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => todos = data)
    .then(render)
    .catch(console.error);
};

$completeAll.onchange = () => {
  const completed = $completeAll.firstElementChild.checked;

  fetch('/todos', {
    method: 'PATCH',
    body: JSON.stringify({ completed }),
    headers: { 'Content-Type': 'application/json' } 
  })
    .then(res => res.json())
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
