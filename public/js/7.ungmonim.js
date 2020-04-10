let todos = [];
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const get = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.send();
  xhr.onload = () => {
    if (xhr.status === 200) {
      callback(JSON.parse(xhr.response));
    } else {
      console.error(`${xhr.status} ${xhr.statusText}`);
    }
  };
};
const post = (url, payload, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url);
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.send(JSON.stringify(payload));
  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 201) {
      callback(JSON.parse(xhr.response));
    } else {
      console.error(`${xhr.status} ${xhr.statusText}`);
    }
  };
};
const render = () => {
  let html = '';
  todos.forEach(({ id, content, completed }) => {
    html += `<li id="${id}">
        <input type="checkbox" ${completed ? 'checked' : ''}>
        <span>${content}</span>
        <button>X</button>
      </li>`;
  });
  $todos.innerHTML = html;
};
const getTodos = () => {
  get('/todos', data => {
    todos = data;
    render();
  });
}
window.onload = getTodos;
$inputTodo.onkeyup = e => {
  const content = e.target.value;
  if (e.keyCode !== 13 || content.trim() === '') return;
  // todos = [{ id: 4, content, completed: false }, ...todos];
  post('/todos', { id: 4, content, completed: false }, data => {
    todos = [data, ...todos]
    render();
  });
};







// 이웅모  2:20 PM
const ajax = (() => {
  const requst = (method, url, callback, payload) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(payload));
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        callback(JSON.parse(xhr.response));
      } else {
        console.error(`${xhr.status} ${xhr.statusText}`);
      }
    };
  };
  return {
    get(url, callback) {
      requst('GET', url, callback);
    },
    post(url, payload, callback) {
      requst('POST', url, callback, payload);
    },
    patch(url, payload, callback) {
      requst('PATCH', url, callback, payload);
    },
    delete(url, callback) {
      requst('DELETE', url, callback);
    }
  }
})();








// 이웅모  4:39 PM
let todos = [];
// 현재 선택된 nav 상태(현재 active 상태인 nav 요소의 자식 요소의 id)
let navState = 'all'; // 'all' / 'active' / 'completed'
// DOMs
const $todos = document.querySelector('.todos');
const $input = document.querySelector('.input-todo');
const $checkbox = document.querySelector('.complete-all > .checkbox');
const $clearCompleted = document.querySelector('.clear-completed > .btn');
const $completedTodos = document.querySelector('.completed-todos');
const $activeTodos = document.querySelector('.active-todos');
const $nav = document.querySelector('.nav');
const render = () => {
  const _todos = todos.filter(({ completed }) => (navState === 'all' ? true : navState === 'active' ? !completed : completed));
  let html = '';
  _todos.forEach(({ id, content, completed }) => {
    html += `
      <li id="${id}" class="todo-item">
        <input class="checkbox" type="checkbox" id="ck-${id}" ${completed ? 'checked' : ''}>
        <label for="ck-${id}">${content}</label>
        <i class="remove-todo far fa-times-circle"></i>
      </li>`;
  });
  $todos.innerHTML = html;
  $completedTodos.textContent = todos.filter(todo => todo.completed).length;
  $activeTodos.textContent = todos.filter(todo => !todo.completed).length;
};
const ajax = (() => {
  const req = (method, url, callback, payload) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(payload));
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        callback(JSON.parse(xhr.response));
      } else {
        console.error('Error', xhr.status, xhr.statusText);
      }
    };
  };
  return {
    get(url, cb) {
      req('GET', url, cb);
    },
    post(url, payload, cb) {
      req('POST', url, cb, payload);
    },
    patch(url, payload, cb) {
      req('PATCH', url, cb, payload);
    },
    delete(url, cb) {
      req('DELETE', url, cb);
    }
  };
})();
const generateid = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);
const getTodos = () => {
  ajax.get('/todos', _todos => {
    todos = _todos;
    console.log('[getTodos]', todos);
    render();
  });
};
const addTodo = content => {
  ajax.post('/todos', { id: generateid(), content, completed: false }, _todos => {
    todos = _todos;
    console.log('[addTodo]', todos);
    render();
  });
};
const toggleCompleted = id => {
  const completed = !todos.find(todo => todo.id === +id).completed;
  ajax.patch(`/todos/${id}`, { completed }, _todos => {
    todos = _todos;
    console.log('[toggleCompleted]', todos);
    render();
  });
};
const removeTodo = id => {
  ajax.delete(`/todos/${id}`, _todos => {
    todos = _todos;
    console.log('[removeTodo]', todos);
    render();
  });
};
const changeNav = id => {
  // $navItem의 id가 e.target의 id와 같으면 active 클래스를 추가하고 아니면 active 클래스를 제거
  [...$nav.children].forEach($navItem => {
    $navItem.classList.toggle('active', $navItem.id === id);
  });
  navState = id;
  console.log('[navState]', navState);
  render();
};
const toggleCompletedAll = completed => {
  ajax.patch('/todos', { completed }, _todos => {
    todos = _todos;
    console.log('[toggleCompletedAll]', todos);
    render();
  });
};
const removeCompleted = () => {
  ajax.delete('/todos/completed', _todos => {
    todos = _todos;
    console.log('[removeCompleted]', todos);
    render();
  });
};
// Event bindings
window.onload = getTodos;
$input.onkeyup = ({ target, keyCode }) => {
  const content = target.value.trim();
  if (!content || keyCode !== 13) return;
  target.value = '';
  addTodo(content);
};
$todos.onchange = ({ target }) => {
  toggleCompleted(target.parentNode.id);
};
$todos.onclick = ({ target }) => {
  if (!target.matches('.todos > li.todo-item > .remove-todo')) return;
  removeTodo(target.parentNode.id);
};
$nav.onclick = ({ target }) => {
  if (!target.matches('.nav > li')) return;
  changeNav(target.id);
};
// todo.completed 일괄 토글
$checkbox.onchange = ({ target }) => {
  toggleCompletedAll(target.checked);
};
// todo.completed 일괄 제거
$clearCompleted.onclick = removeCompleted;