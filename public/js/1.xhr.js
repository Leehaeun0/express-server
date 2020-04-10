// State
let todos = [];
let active = 'all';

const $inputTodo = document.querySelector('.input-todo');
const $todos = document.querySelector('.todos');
const $completeAll = document.querySelector('.complete-all');
const $clearCompleted = document.querySelector('.clear-completed > .btn');
const $activeTodos = document.querySelector('.active-todos');
const $navActive = document.querySelector('.input-todo + .nav');

const ajax = (() => {
  const request = (method, url, callback, payload ) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(payload));

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        console.log('Json response', JSON.parse(xhr.response));

        callback(JSON.parse(xhr.response));

      } else {
        console.error('Error', xhr.status, xhr.statusText);
      }
    };
  };
  return {
    get(url, callback) {
      request('GET', url, callback);
    },
    post(url, payload, callback) {
      request('POST', url, callback, payload);
    },
    patch(url, payload, callback) {
      request('PATCH', url, callback, payload);
    },
    delete(url, callback) {
      request('DELETE', url, callback);
    },
  };
})();


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
  ajax.get('/todos', data => {
    todos = data;
    // todos.sort((todo1, todo2) => todo2.id - todo1.id);
    console.log('Render getTodos', todos);
    render();
  });
};

window.onload = getTodos;

const newId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);

$inputTodo.onkeyup = e => {
  if (e.keyCode !== 13 || $inputTodo.value.trim() === '') return;
  ajax.post('/todos', { id: newId(), content: $inputTodo.value, completed: false }, data => {
    // todos = [data, ...todos];
    todos = data;
    $inputTodo.value = '';
    console.log('post', todos);
    render();
  });
};

$todos.onchange = ({ target }) => {
  const { id } = target.parentNode;
  const completed = target.checked;

  ajax.patch(`/todos/${id}`, { completed }, data => {
    // todos = todos.map(todo => (todo.id === +id ? data : todo));
    todos = data;
    console.log('patch', todos);
    render();
  });
};

$todos.onclick = ({ target }) => {
  if (!target.matches('.todos > li > .remove-todo')) return;
  const { id } = target.parentNode;

  ajax.delete(`/todos/${id}`, data => {
    // todos = todos.filter(todo => todo.id !== +id);
    todos = data;
    console.log('delete', todos);
    render();
  });
};

$clearCompleted.onclick = () => {

  ajax.delete('/todos/completed', data => {
    todos = data;
    render();
  });

};

$completeAll.onchange = () => {
  const completed = $completeAll.firstElementChild.checked;

  ajax.patch('/todos', { completed }, data => {
    // todos = todos.map(todo => (todo.id === element.id ? { ...todo, completed } : todo));
    todos = data;
    render();
  });

};

$navActive.onclick = ({ target }) => {
  if (!target.matches('.nav > li:not(.active)')) return;
  active = target.id;
  [...$navActive.children].forEach($nav => $nav.classList.toggle('active', $nav.id === active));
  render();
};