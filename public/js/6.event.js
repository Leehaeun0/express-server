// State
let todos = [];
let active = 'All';

const $inputTodo = document.querySelector('.input-todo');
const $todos = document.querySelector('.todos');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');
const $completeAll = document.querySelector('.complete-all');
const $removeCompleted = document.querySelector('.clear-completed > .btn');
const $navActive = document.querySelector('.input-todo + .nav');


const completedTodos = () => {
  $completedTodos.textContent = todos.filter(todo => todo.completed).length || 0;
};


const activeTodos = () => {
  $activeTodos.textContent = todos.filter(todo => !todo.completed).length || 0;
};


const render = () => {
  let html = '';

  const _todos = [...todos].filter(todo => (active === 'All' ? true : (active === 'Active' ? !todo.completed : todo.completed)));

  _todos.forEach(todo => {
    html += ` <li id="${todo.id}" class="todo-item">
    <input id="ck-${todo.id}" class="checkbox"${todo.completed ? ' checked' : ''} type="checkbox">
    <label for="ck-${todo.id}">${todo.content}</label>
    <i class="remove-todo far fa-times-circle"></i>
  </li>`;
  }); // input 의 아이디와 label의 아이디를 일치시킬 것

  $todos.innerHTML = html;

  completedTodos();
  activeTodos();
};


const getTodos = () => {
  todos = [
    { id: 1, content: 'HTML', completed: false },
    { id: 2, content: 'css', completed: true },
    { id: 3, content: 'Javascript', completed: false },
  ];
  
  todos.sort((todo1, todo2) => todo2.id - todo1.id);

  render();
};

window.onload = getTodos;


$inputTodo.onkeyup = e => {
  if (e.keyCode !== 13 || $inputTodo.value === '') return;

  const newId = todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
  const newTodo = { id: newId, content: $inputTodo.value, completed: false };
  todos = [newTodo, ...todos];

  $inputTodo.value = '';
  render();
};


$todos.onchange = e => {

  todos = todos.map(todo => {
    return todo.id === +e.target.parentNode.id ? { ...todo, completed: !todo.completed } : todo;
  });

  render();
};


$todos.onclick = e => {
  if (!e.target.matches('.todos > li > .far')) return;

  todos = todos.filter(todo => {
    return todo.id !== +e.target.parentNode.id;
  });

  render(); 
};


$completeAll.onchange = e => {
  // todos = todos.map(todo => ({ ...todo, completed: e.target.checked ? true : false }));
  todos = todos.map(todo => ({ ...todo, completed: !!e.target.checked }));
  // todos = todos.map(todo => ({ ...todo, completed }));

  render(); 
};


$removeCompleted.onclick = () => {
  todos = todos.filter(todo => !todo.completed);
  
  render();
};


$navActive.onclick = e => {
  if (!e.target.matches('.nav > li:not(.active)')) return;

  active = e.target.innerText;

  [...$navActive.children].forEach($nav => $nav.classList.toggle('active', $nav === e.target)); 
  
  render();
};
