(function() {

  const { createStore } = Redux;

  let store;

  const initialState = [
    {
      id: 1,
      completed: true,
      text: 'Task 1'
    },
    {
      id: 2,
      completed: false,
      text: 'Task 2'
    }
  ];

  document.addEventListener('DOMContentLoaded', event => {
      initApp();
  });

  function initApp() {
    store = createStore(
      (state) => state,
      initialState,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
    
    //renderTodos(initialState);
  }

  function renderTodos(todos){
    const $container = document.getElementById('todo-list');
    $container.innerHTML = '';

    let todosHtml = '';
    todos.forEach(todo => {
      todosHtml += renderTodo(todo);
    });
    $container.innerHTML = todosHtml;
  }

  function renderTodo(todo) {
      return `
      <li data-id="${todo.id}" class="${todo.completed}">
        <div class="view">
          <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
          <label>${todo.text}</label>
          <button class="destroy"></button>
        </div>
      </li>`;
  }
})();
