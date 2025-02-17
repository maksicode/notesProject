/* -------------------------------------------------------model ------------------------------------------------------*/
const model = {
    tasks: [],

    addTask(title, description) {
        const id = Math.random();
        const newTask = { id: id, title: title, description: description }
        this.tasks.unshift(newTask);

        view.renderTasks(this.tasks);
    },

    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);

        view.renderTasks(this.tasks);
    },

    // favoriteTask(taskId) {
    //     this.tasks = this.tasks.map((task) => {
    //         if (task.id === taskId) {
    //            return {...task, isFavorite: !task.isFavorite};
    //         }
    //         return task;
    //     })
    //     view.renderTasks(this.tasks);
    // },
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
        const item = document.querySelector('.item');

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const title = inputTitle.value;
            const description = inputDescription.value;

            controller.addTask(title, description);

            inputTitle.value = '';
            inputDescription.value = '';
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
            if (event.target.classList.contains('delete-button')) {
                const taskId = +event.target.parentElement.id;

                controller.deleteTask(taskId);

                quantity.textContent = `Всего заметок: ${model.tasks.length}`;

                if (model.tasks.length === 0) {
                    defaultText.classList.remove('hidden');
                    favoriteFilter.classList.add('hidden');
                } else {
                    defaultText.classList.add('hidden');
                }
            }

            // if (event.target.classList.contains('favorite-button')) {
            //     const taskId = +event.target.closest('.item').id;
            //
            //     controller.favoriteTask(taskId);
            //
            //     item.classList.toggle('favorite');
            // }
        });
    },

    renderTasks(tasks) {
        const list = document.querySelector('.list');
        let tasksHTML = '';

        for (const task of tasks) {
            tasksHTML += `
        <li id="${task.id}" class="item">
        
            <b class="task-title">${task.title}</b>
            <button class="favorite-button" type="button">Избранное</button>
            <button class="delete-button" type="button">Удалить</button>
       
            <div class="item-body">
                <p class="task-description">${task.description}</p>
            </div>
        </li>
      `
        }

        list.innerHTML = tasksHTML;
    },

    displayMessage(message, isError = false) {
        const messageBox = document.querySelector('.message-box');
        messageBox.textContent = message;

        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
        messageBox.classList.remove('hidden');


        if (isError) {
            // messageBox.classList.remove('success');
            messageBox.classList.add('error');
        } else {
            messageBox.classList.remove('error');
            // messageBox.classList.add('success');
        }
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

    // favoriteTask(taskId) {
    //     model.favoriteTask(taskId);
    //     view.displayMessage('Заметка добавлена в избранное', false);
    // },
}


/* ----------------------------------------------------- init --------------------------------------------------------*/

function init() {
    view.init();
}

document.addEventListener('DOMContentLoaded', init);