// DOM Elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDue = document.getElementById('task-due');
const taskPriority = document.getElementById('task-priority');
const dateGroups = document.getElementById('date-groups');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const themeLabel = document.getElementById('theme-label');

// Load tasks
const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(addTaskToDOM);
};

// Save tasks
const saveTask = (task) => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Update tasks
const updateTasks = (tasks) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Remove empty date groups
const removeEmptyDateGroup = (dateGroup) => {
    const ul = dateGroup.querySelector('ul');
    if (ul && !ul.hasChildNodes()) {
        dateGroup.remove();
    }
};

// Add task to DOM
const addTaskToDOM = (task) => {
    const dateGroup = document.querySelector(`.date-group[data-date="${task.dueDate.split('T')[0]}"]`) || createDateGroup(task.dueDate.split('T')[0]);
    const ul = dateGroup.querySelector('ul');
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.innerHTML = `
        <span class="${task.completed ? 'completed' : ''}">
            ${task.name} - ${new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            <span class="priority-${task.priority.toLowerCase()}">${task.priority}</span>
        </span>
        <div>
            <button class="complete">✔</button>
            <button class="delete">✖</button>
        </div>
    `;
    ul.appendChild(li);
};

// Create date group
const createDateGroup = (date) => {
    const dateGroup = document.createElement('div');
    dateGroup.classList.add('date-group');
    dateGroup.dataset.date = date;
    dateGroup.innerHTML = `<h3>${new Date(date).toLocaleDateString()}</h3><ul></ul>`;
    dateGroups.appendChild(dateGroup);
    return dateGroup;
};

// Handle form submission
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = {
        id: Date.now(),
        name: taskInput.value,
        dueDate: taskDue.value,
        priority: taskPriority.value,
        completed: false,
    };
    addTaskToDOM(task);
    saveTask(task);
    taskForm.reset();
});

// Handle task actions
dateGroups.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    const dateGroup = e.target.closest('.date-group');
    if (!li || !dateGroup) return;

    const id = parseInt(li.dataset.id);
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (e.target.classList.contains('complete')) {
        const task = tasks.find((task) => task.id === id);
        task.completed = !task.completed;
        li.querySelector('span').classList.toggle('completed', task.completed);
    } else if (e.target.classList.contains('delete')) {
        tasks = tasks.filter((task) => task.id !== id);
        li.remove();
        removeEmptyDateGroup(dateGroup);
    }

    updateTasks(tasks);
});

// Toggle dark mode
darkModeToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
    themeLabel.textContent = e.target.checked ? 'Dark Mode' : 'Light Mode';
});

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);
