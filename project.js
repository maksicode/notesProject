/* -------------------------------------------------------model ------------------------------------------------------*/
const model = {
    tasks: [],

    addTask(title, description) {
        const id = Date.now();
        const newTask = { id: id, title: title, description: description, isFavorite: false };
        this.tasks.unshift(newTask);
        view.renderTasks(this.tasks);
    },

    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        view.renderTasks(this.tasks);
    },

    favoriteTask(taskId) {
        const task = this.tasks.find((task) => task.id === taskId);
        if (task) {
            task.isFavorite = !task.isFavorite; // Переключаем состояние isFavorite
            view.updateTask(task);
        }
    },
}


/* ------------------------------------------------------ view -------------------------------------------------------*/
const view = {
    init() {
        this.renderTasks(model.tasks);

        const form = document.querySelector('.form');
        const inputTitle = document.querySelector('.input-title');
        const inputDescription = document.querySelector('.input-description');
        const defaultText = document.querySelector('.default-text'); // Текст при отсутствии заметок
        const list = document.querySelector('.list');
        const favoriteFilter = document.querySelector('.favorite-filter') // Блок добавления в избранное
        const quantity = document.querySelector('.quantity'); // Счетчик заметок
        const favoriteCheckbox = document.querySelector('.favorite-checkbox');


        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const title = inputTitle.value;
            const description = inputDescription.value;

            controller.addTask(title, description);

            if (title !== '' && description !== '') {
                inputTitle.value = '';
                inputDescription.value = '';
            }

            defaultText.classList.add('hidden');
            quantity.textContent = `Всего заметок: ${model.tasks.length}`;

            if (model.tasks.length === 0) {
                favoriteFilter.classList.add('hidden');
            } else {
                favoriteFilter.classList.remove('hidden');
            }
        });

        list.addEventListener('click', (event) => {
            event.preventDefault();
            const taskId = +event.target.closest('.item').id;

            if (event.target.classList.contains('delete-button')) {
                controller.deleteTask(taskId);
                quantity.textContent = `Всего заметок: ${model.tasks.length}`;
                defaultText.classList.toggle('hidden', model.tasks.length !== 0);
                favoriteFilter.classList.toggle('hidden', model.tasks.length === 0);
            }

            if (event.target.classList.contains('favorite-button')) {
                controller.favoriteTask(taskId);
            }
        });

        favoriteCheckbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                const favoriteTasks = model.tasks.filter((task) => task.isFavorite); // Фильтруем избранные задачи
                view.renderTasks(favoriteTasks); // Показываем только избранные
            } else {
                view.renderTasks(model.tasks); // Показываем все задачи
            }
        });
    },

    renderTasks(tasks) {
        const list = document.querySelector('.list');
        list.innerHTML = tasks.map(task => `
        <li id="${task.id}" class="item ${task.isFavorite ? 'favorite' : ''}">
            <b class="task-title">${task.title}</b>
            <button class="favorite-button" type="button">
                ${task.isFavorite ? 'В избранном' : 'В избранное'}
            </button>
            <button class="delete-button" type="button">Удалить</button>
            <div class="item-body">
                <p class="task-description">${task.description}</p>
            </div>
        </li>
    `).join('');
    },

    updateTask(task) {
        const taskElement = document.getElementById(task.id);
        if (taskElement) {
            taskElement.querySelector('.favorite-button').textContent = task.isFavorite ? 'В избранном' : 'В избранное';
            taskElement.classList.toggle('favorite', task.isFavorite);
        }
    },
    displayMessage(message, isError = false) {
        const messageBox = document.querySelector('.message-box');
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.classList.remove('hidden');

            if (isError) {
                messageBox.classList.remove('success');
                messageBox.classList.add('error');
            } else {
                messageBox.classList.remove('error');
                messageBox.classList.add('success');
            }

            setTimeout(() => {
                messageBox.classList.add('hidden');
            }, 3000);
        }
    }
}


/* -------------------------------------------------- controller -----------------------------------------------------*/
const controller = {
    addTask(title, description) {
        if (title.trim() !== '' && description.trim() !== '') {
            model.addTask(title, description);
            view.displayMessage('Заметка добавлена');
        } else {
            view.displayMessage('Заполните все поля!', true);
        }
    },

    deleteTask(taskId) {
        model.deleteTask(taskId);
        view.displayMessage('Заметка удалена', false);
    },

    favoriteTask(taskId) {
        model.favoriteTask(taskId);
    },
}


/* ----------------------------------------------------- init --------------------------------------------------------*/
function init() {
    view.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}