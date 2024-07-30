// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// funções

    // adicionar e salvar tarefas
const saveTodo = (text, done = 0, save = 1) =>{
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn);

    
    // Utilizando dados da localStorage
    if (done){
        todo.classList.add("done");
    };

    if(save){
        saveTodoLocalStorage({text, done});
    };

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();
};

    // ocultar/mostrar div de edição das tarefas
const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

    // alterar/atualizar tarefas
const updateTodo = (text) =>{

    const todos = document.querySelectorAll(".todo");
    
    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("h3");

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text;

            updateTodoLocalStorage(oldInputValue, text);
        };
    });
};

    // busca
const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");
    
    todos.forEach((todo) =>{
        let todoTitle = todo.querySelector("h3").innerText.toLocaleLowerCase();
        
        const normalizedSearch = search.toLocaleLowerCase();

        todo.style.display = "flex";

        if(!todoTitle.includes(normalizedSearch)){
            todo.style.display = "none";
        };
    });
};

    // filtros
    const filterTodos = (filterValue) => {
        const todos = document.querySelectorAll(".todo");

        switch (filterValue) {
            case "all":
            todos.forEach((todo) => (todo.style.display = "flex"));
            
            break;

        case "done":
            todos.forEach((todo) =>
                todo.classList.contains("done")
                ? (todo.style.display = "flex")
                : (todo.style.display = "none")
            );

            break;

        case "todo":
            todos.forEach((todo) =>
                !todo.classList.contains("done")
                ? (todo.style.display = "flex")
                : (todo.style.display = "none")
            );
            break;

            default:
            break;
        }
};




// Eventos

    // salvar evento
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if(inputValue){
        saveTodo(inputValue)
    }
});

    // botões de editar, remover e finalizar tarefas
document.addEventListener("click", (e) => {
    const targerEl = e.target;
    const parentEl = targerEl.closest("div");
    let todoTitle;
    
    if(parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    };

    if(targerEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");

        updateTodoStatusLocalStorage(todoTitle);
    };

    if(targerEl.classList.contains("remove-todo")) {
        parentEl.remove();

        removeTodoLocalStorage(todoTitle);
    };

    if(targerEl.classList.contains("edit-todo")) {
        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
        
    };
});

    // cancelar edição
cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForms();
});

    // inserir edições
editForm.addEventListener("submit", (e) =>{
    e.preventDefault();

    const edtInputValue = editInput.value;

    if(edtInputValue){
        // atualizar
        updateTodo(edtInputValue);
    };

    toggleForms();
});

    // busca
searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearchTodos(search);
});

    //botão apagar busca
eraseBtn.addEventListener("click", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
});

    // filtros
filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterTodos(filterValue);
});


// Local Storage
const getTodoLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];

    return todos;
};

const loadTodos = () =>{
    const todos = getTodoLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    });
};

const saveTodoLocalStorage = (todo) => {
    
    // todos os todos da ls
    const todos = getTodoLocalStorage();

    // add o novo todo n arr
    todos.push(todo);

    // salvar tudo na ls
    localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (todoText) => {
    const todos = getTodoLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text != todoText);

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodoLocalStorage();

    todos.map((todo) => 
        todo.text === todoText ? (todo.done = !todo.done) : null 
    );

    localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodoLocalStorage();

    todos.map((todo) => 
        todo.text === todoOldText ? (todo.text = todoNewText) : null 
    );

    localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();