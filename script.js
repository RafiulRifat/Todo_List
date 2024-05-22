const addBtn = document.querySelector("#add-btn");
const clearAllBtn = document.querySelector("#clear-all-btn"); 
const newTaskInput = document.querySelector("#wrapper input");
const tasksContainer = document.getElementById("tasks-container");

const error = document.getElementById("error");
const countValue = document.querySelector(".count-value");
let taskCount = 0;
let tasks = [];

const displayCount = (taskCount) => {
  countValue.innerText = taskCount;
};

const saveTasksToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    tasks.forEach((task) => {
      tasksContainer.insertAdjacentHTML("beforeend", task);
      taskCount++;
    });
    displayCount(taskCount);
  }
};

const addTask = () => {
  const taskName = newTaskInput.value.trim();
  error.style.display = "none";
  if (!taskName) {
    setTimeout(() => {
      error.style.display = "block";
    }, 200);
    return;
  }

  const task = `<div class="task">
    <input type="checkbox" class="task-check">
    <span class="taskname">${taskName}</span>
    <button class="edit">
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button class="delete">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>`;

  tasks.push(task);
  saveTasksToLocalStorage();

  tasksContainer.insertAdjacentHTML("beforeend", task);

  const deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) => {
    button.onclick = () => {
      const taskIndex = Array.from(button.parentNode.parentNode.children).indexOf(button.parentNode);
      tasks.splice(taskIndex, 1);
      saveTasksToLocalStorage();
      button.parentNode.remove();
      taskCount -= 1;
      displayCount(taskCount);
    };
  });

  const editButtons = document.querySelectorAll(".edit");
  editButtons.forEach((editBtn) => {
    editBtn.onclick = (e) => {
      let targetElement = e.target;
      if (!(e.target.className == "edit")) {
        targetElement = e.target.parentElement;
      }
      newTaskInput.value = targetElement.previousElementSibling?.innerText;
      const taskIndex = Array.from(targetElement.parentNode.parentNode.children).indexOf(targetElement.parentNode);
      tasks.splice(taskIndex, 1);
      saveTasksToLocalStorage();
      targetElement.parentNode.remove();
      displayCount(taskCount);
    };
  });

  const tasksCheck = document.querySelectorAll(".task-check");
  tasksCheck.forEach((checkbox) => {
    checkbox.onchange = () => {
      checkbox.nextElementSibling.classList.toggle("completed");
      if (checkbox.checked) {
        taskCount += 1;
      } else {
        taskCount -= 1;
      }
      displayCount(taskCount);
    };
  });

  taskCount += 1;
  displayCount(taskCount);
  newTaskInput.value = "";
};

const clearAllTasks = () => {
  tasksContainer.innerHTML = ""; 
  taskCount = 0; 
  tasks = []; // Clear tasks array
  saveTasksToLocalStorage(); // Update local storage
  displayCount(taskCount); 
};

addBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAllTasks);

window.onload = () => {
  loadTasksFromLocalStorage(); // Load tasks from local storage
};

