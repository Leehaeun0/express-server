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


const promiseAjax = (method, url, payload) => {

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(payload));

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status < 400) {
        console.log('Json response', JSON.parse(xhr.response)); // 삭제

        resolve(JSON.parse(xhr.response));

      } else {
        reject(new Error(xhr.status));
      }
    };
  });

};


const getTodos = () => {
  promiseAjax('GET', '/todos')
    .then(data => todos = data) // resolve(todos = data) 그러므로 콜백함수의 반환값이 다음함수의 인자로 들어가는 이유다.
    // .then(_todos => _todos.sort((todo1, todo2) => todo2.id - todo1.id))
    .then(sortData => console.log('get', sortData)) // 삭제
    .then(render)
    .catch(console.error);
};


window.onload = getTodos; // 온로드 없어도 되나?

const newId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 0);


$inputTodo.onkeyup = e => {
  const inputValue = $inputTodo.value.trim(); // 여러곳에서 바라보는 값을 변수에 담으니 비동기처리 순서가 단순해졌다.
  if (e.keyCode !== 13 || inputValue === '') return;
  
  $inputTodo.value = '';
  
  promiseAjax('POST', '/todos', { id: newId(), content: inputValue, completed: false })
    // fetch() // 패치는 객체로 주기 떄문에 바디 이외 정보들을 뒤에 객체로 줘야한다. JSON 형식으로 파싱해주는거 잊지말아라
    // .then(data => todos = [data, ...todos])
    .then(data => todos = data)
    // .then(() => $inputTodo.value = '')
    .then(() => console.log('post', todos)) // 삭제
    .then(render)
    .catch(console.error);  
};


$todos.onchange = ({ target }) => {
  const { id } = target.parentNode;
  const completed = target.checked;

  promiseAjax('PATCH', `/todos/${id}`, { completed })
    // .then(data => todos = todos.map(todo => (todo.id === +id ? data : todo)))
    .then(data => todos = data)
    .then(() => console.log('patch', todos)) // 삭제
    .then(render)
    .catch(console.error);
};


$todos.onclick = ({ target }) => {
  if (!target.matches('.todos > li > .remove-todo')) return;
  const { id } = target.parentNode;

  promiseAjax('DELETE', `/todos/${id}`)
    // .then(() => todos = todos.filter(todo => todo.id !== +id))
    .then(data => todos = data)
    .then(() => console.log('delete', todos)) // 삭제
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
  [...$navActive.children].forEach($nav => $nav.classList.toggle('active', $nav.id === active)); // $nav === e.target
  render();
};
