//buttons
const input = document.querySelector("input");
const save = document.querySelector(".save");
const dlt = document.querySelector(".delete");
const finished = document.querySelector(".finished");
const pendingTasks = document.querySelector(".pending-tasks");

const todoDataList = document.querySelector("#todo-data-list");

let todos = [];
let todoId = 0;

//save button is disabled initiallly
save.classList.add("opacity-50", "pointer-events-none", "disabled");

function addToDo(todo) {
  const rowDiv = document.createElement("div");
  const numberH4 = document.createElement("h4");
  const itemH4 = document.createElement("h4");
  const statusDiv = document.createElement("div");
  const statusH4 = document.createElement("h4");
  const actionDiv = document.createElement("div");
  const deleteButtonDiv = document.createElement("button");
  const finishedButtonDiv = document.createElement("button");
  const editButtonDiv = document.createElement("button");

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";

  //adding classes
  rowDiv.className = "row flex gap-10 h-16 border-b-2 border-slate-300 flex items-center";
  numberH4.className = "w-[5%] grow";
  itemH4.className = "w-[30%] grow break-words overflow-auto h-12 flex items-center";
  hiddenInput.className = "w-[30%] grow h-8 flex items-center px-2 -ml-2 border-2 border-blue-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";
  statusDiv.className = "w-[17%] grow flex items-start gap-2";

  actionDiv.className = "w-[40%] grow flex gap-2";
  deleteButtonDiv.className = "delete text-xs font-semibold bg-red-600  py-2 rounded text-white w-24 text-center cursor-pointer";
  finishedButtonDiv.className = "finished text-xs font-semibold bg-green-600 py-2 rounded text-white w-24 text-center cursor-pointer";
  editButtonDiv.className = "edit text-xs font-semibold bg-yellow-600 py-2 rounded text-white w-24 text-center cursor-pointer";

  //adding text contents
  numberH4.textContent = todo.todoIndex;
  itemH4.textContent = todo.todoText;

  statusH4.textContent = todo.status;
  let pendingIcon = `<i class="ri-progress-5-line text-xl text-yellow-300"></i>`;
  let finishedIcon = `<i class="ri-check-double-fill text-xl text-green-400"></i>`;
  statusDiv.append(statusH4);
  if (todo.status == "Finished") {
    statusDiv.insertAdjacentHTML("beforeend", finishedIcon);
  } else {
    statusDiv.insertAdjacentHTML("beforeend", pendingIcon);
  }

  deleteButtonDiv.textContent = "DELETE";
  finishedButtonDiv.textContent = todo.finishedBtnText;
  editButtonDiv.textContent = "EDIT";

  //setting attributes
  deleteButtonDiv.setAttribute("todo-id", todo.todoId);
  finishedButtonDiv.setAttribute("todo-id", todo.todoId);
  editButtonDiv.setAttribute("todo-id", todo.todoId);
  itemH4.setAttribute("todo-id", todo.todoId);
  hiddenInput.setAttribute("todo-id", todo.todoId);

  actionDiv.append(deleteButtonDiv);
  actionDiv.append(finishedButtonDiv);
  actionDiv.append(editButtonDiv);

  rowDiv.append(numberH4);
  rowDiv.append(itemH4);
  rowDiv.append(hiddenInput);
  rowDiv.append(statusDiv);
  rowDiv.append(actionDiv);

  todoDataList.append(rowDiv);

  // hiddenInput.addEventListener("keypress", (e) => {
  //   const itemId = e.target.getAttribute("todo-id");
  //   const itemToEdit = document.querySelector(`h4[todo-id="${itemId}"]`);
  //   if (e.key == "Enter") {
  //     itemToEdit.textContent = e.target.value;
  //     itemToEdit.classList.remove("hidden");
  //     e.target.value = "";
  //     e.target.type = "hidden";

  //     const itemToUpdate = todos.find((todo) => todo.todoId == itemId);
  //     itemToUpdate.todoText = itemToEdit.textContent;
  //   }
  // });
}

function rerender(filteredtodos) {
  todoDataList.innerHTML = "";
  filteredtodos.forEach((el, idx) => {
    el.todoIndex = idx + 1; // Recalculate the visible index
    addToDo(el);
  });
}

input.addEventListener("keyup", () => {
  if (input.value.trim() == "") {
    if (save.classList.contains("disabled")) return;
    save.classList.add("opacity-50", "pointer-events-none", "disabled");
  } else if (save.classList.contains("disabled")) save.classList.remove("opacity-50", "pointer-events-none", "disabled");
});

save.addEventListener("click", () => {
  if (input.value.trim() == "") {
    save.classList.add("opacity-50", "pointer-events-none", "disabled");
    return;
  }

  let todo = {
    todoId: todoId++,
    todoText: input.value,
    todoIndex: todos.length + 1,
    status: "In progress",
    finishedBtnText: "FINISHED",
  };
  todos.push(todo); //keeping track of all todos
  addToDo(todo);
  input.value = "";
  save.classList.add("opacity-50", "pointer-events-none", "disabled"); //adding intial disabled again
});

//using event delegation
todoDataList.addEventListener("click", (e) => {
  //  -> removing a todo
  if (e.target.classList.contains("delete")) {
    let itemId = e.target.getAttribute("todo-id");
    todos = todos.filter((todo) => {
      return todo.todoId != itemId;
    });

    // Check the current state of the pendingTasks button
    if (pendingTasks.textContent.trim() == "GET ALL TASKS") {
      console.log("only pending");
      let pendingToDos = todos.filter((todo) => todo.status !== "Finished");
      console.log(pendingToDos);
      rerender(pendingToDos);
    } else {
      rerender(todos);
    }
  }
  //-> marking a todo as finished
  if (e.target.classList.contains("finished")) {
    let todoId = e.target.getAttribute("todo-id");
    let item = todos.find((el) => el.todoId == todoId);

    if (item.status == "In progress") {
      item.status = "Finished";
      item.finishedBtnText = "UNDO";
    } else if (item.status == "Finished") {
      item.status = "In progress";
      item.finishedBtnText = "FINISHED";
    }

    todos.sort((a, b) => {
      if (a.status == "Finished") return 1; // 1 means`a` comes after `b`
      return -1;
    });

    // Check the current state of the pendingTasks button
    if (pendingTasks.textContent.trim() == "GET ALL TASKS") {
      let pendingToDos = todos.filter((todo) => todo.status !== "Finished");
      rerender(pendingToDos);
    } else {
      rerender(todos);
    }
  }
  //->edit a todo
  if (e.target.classList.contains("edit")) {
    let itemId = e.target.getAttribute("todo-id");
    let itemToEdit = document.querySelector(`h4[todo-id="${itemId}"]`);
    let hiddenInputToDispaly = document.querySelector(`input[todo-id="${itemId}"]`);

    itemToEdit.classList.add("hidden");
    hiddenInputToDispaly.type = "text";
    hiddenInputToDispaly.value = itemToEdit.textContent;
  }
});

//to edit a todo
todoDataList.addEventListener("keypress", (e) => {
  if (e.target.nodeName === "INPUT" && e.key === "Enter") {
    const itemId = e.target.getAttribute("todo-id");
    const itemToEdit = document.querySelector(`h4[todo-id="${itemId}"]`);

    itemToEdit.textContent = e.target.value;
    itemToEdit.classList.remove("hidden");
    e.target.value = "";
    e.target.type = "hidden";

    const itemToUpdate = todos.find((todo) => todo.todoId == itemId);
    itemToUpdate.todoText = itemToEdit.textContent;
  }
});

pendingTasks.addEventListener("click", () => {
  let string = pendingTasks.textContent.trim();
  if (string == "GET PENDING TASKS") {
    pendingTasks.textContent = "GET ALL TASKS";
    let pendingToDos = todos.filter((todo) => todo.status !== "Finished");
    rerender(pendingToDos);
  } else {
    pendingTasks.textContent = "GET PENDING TASKS";
    rerender(todos);
  }
});
