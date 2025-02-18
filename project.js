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
            view.renderTasks(this.tasks); // Перерисовываем задачи
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

            inputTitle.value = '';
            inputDescription.value = '';
            defaultText.classList.add('hidden');
            quantity.textContent = `Всего заметок: ${model.tasks.length}`;

            if (model.tasks.length === 0) {
                favoriteFilter.classList.add('hidden');
            } else {
                favoriteFilter.classList.remove('hidden');
            }

            controller.addTask(title, description);
        });

        list.addEventListener('click', (event) => {
            event.preventDefault();
            if (event.target.classList.contains('delete-button')) {
                const taskId = +event.target.parentElement.id;
                quantity.textContent = `Всего заметок: ${model.tasks.length}`;
                if (model.tasks.length === 0) {
                    defaultText.classList.remove('hidden');
                    favoriteFilter.classList.add('hidden');
                } else {
                    defaultText.classList.add('hidden');
                }

                controller.deleteTask(taskId);
            }

            if (event.target.classList.contains('favorite-button')) {
                const taskId = +event.target.closest('.item').id

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
        let tasksHTML = '';

        for (const task of tasks) {
            tasksHTML += `
        <li id="${task.id}" class="item ${task.isFavorite ? 'favorite' : ''}">
        
            <b class="task-title">${task.title}</b>
            <button class="favorite-button" type="button">${task.isFavorite ? 'В избранном' : 'В избранное'}</button>
            <button class="delete-button" type="button">Удалить</button>
       
            <div class="item-body">
                <p class="task-description">${task.description}</p>
            </div>
        </li>
      `
        }

        list.innerHTML = tasksHTML;
    },

    displayMessage(message) {
        const messageBox = document.querySelector('.message-box');
        messageBox.textContent = message;

        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
        messageBox.classList.remove('hidden');
    },
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