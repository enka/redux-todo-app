(function() {
    const { createStore } = Redux;

    let store;

    const initialState = [];

    document.addEventListener('DOMContentLoaded', event => {
        initApp();
    });

    const reducer = (state, action) => {
        switch (action.type) {
            case 'ADD_TASK':
                return [...state, action.payload];
            case 'DELETE_TASK':
                return state.filter(function(element) {
                    return element.id !== action.payload.id;
                });
            case 'TOGGLE_TASK':
                return state.map(function(element) {
                    if (element.id === action.payload.id) {
                        element.completed = !element.completed;
                    }
                    return element;
                });
            default:
                return state;
        }
    };

    function initApp() {
        store = createStore(
            reducer,
            initialState,
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        );

        addEventListeners();

        store.subscribe(handleChange);

        render();

        this.deleteTask = deleteTask.bind(this);
        this.toggleTask = toggleTask.bind(this);
    }

    function addEventListeners(){      
        addFormEventListener();
        addFilterEventListener();
        hashChangeEventListener();
    }

    function addFormEventListener(){
        const $form = document.getElementById('form');
        $form.addEventListener('submit', event => {
            event.preventDefault();
            addTask(new FormData($form));
        });
    }

    function addFilterEventListener() {
        const $filters = document.getElementById('filters').getElementsByTagName('a');
        for (var i = 0; i < $filters.length; i++) {
            $filters[i].addEventListener('click', function() {
                var current = document.getElementsByClassName('selected');
                current[0].className = current[0].className.replace('selected', '');
                this.className += 'selected';
            });
        }
    }

    function hashChangeEventListener(){
        window.onhashchange = function() {
            render();
        };
    }
    
    function addTask(data) {
        const newId = store.getState().length;
        const action = {
            type: 'ADD_TASK',
            payload: {
                id: newId,
                text: data.get('text'),
                completed: false
            }
        };

        store.dispatch(action);
        clearInput();
    }

    function clearInput() {
        const $input = document.getElementById('new-todo');
        $input.value = '';
    }

    function deleteTask(id) {
        const action = {
            type: 'DELETE_TASK',
            payload: {
                id: id
            }
        };
        store.dispatch(action);
    }

    function toggleTask(id) {
        const action = {
            type: 'TOGGLE_TASK',
            payload: {
                id: id
            }
        };
        store.dispatch(action);
    }

    function handleChange() {
        render();
    }

    function render() {
        const todos = store.getState();
        const filter = location.hash.slice(1) || '/';
        const filteredTodos = applyFilter(todos, filter);

        renderTodos(filteredTodos);
    }

    function applyFilter(todos, filter) {
        switch (filter) {
            case '/active':
                return todos.filter(function(element) {
                    return !element.completed;
                });
            case '/completed':
                return todos.filter(function(element) {
                    return element.completed;
                });
            default:
                return todos;
        }
    }

    function renderTodos(todos) {
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
        <input class="toggle" type="checkbox" onClick="toggleTask(${todo.id})" ${todo.completed ? 'checked' : ''}>
        <label>${todo.text}</label>
        <button class="destroy" onClick="deleteTask(${todo.id})"></button>
      </div>
    </li>`;
    }
})();
