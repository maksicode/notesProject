/* ----------------model -----------------*/
const model = {
    tasks: [],

    addTask(title, description) {
        const id = Math.random();
        const newTask = {id, title, description}
        this.tasks.push(newTask);

        view.renderTasks(this.tasks);
    },

    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);

        view.renderTasks(model.tasks);
    },
}


/* ---------------- view ----------------*/
const view = {
    init() {
        this.renderTasks(model.tasks);

        const form = document.querySelector('.form');
        const inputTitle = document.querySelector('.input-title');
        const inputDescription = document.querySelector('.input-description');

        const hiddenText = document.querySelector('.default-text');

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const title = inputTitle.value;
            const description = inputDescription.value;
            controller.addTask(title, description);

            inputTitle.value = '';
            inputDescription.value = '';

            hiddenText.classList.add('hidden');

            let quantity = document.querySelector('.quantity');
            quantity.textContent = `Всего заметок: ${model.tasks.length}`;
        });

        const list = document.querySelector('.list');

        list.addEventListener('click', (event) => {
            event.preventDefault();
            if (event.target.classList.contains('delete-button')) {
                const taskId = +event.target.parentElement.id;
                controller.deleteTask(taskId);

                let quantity = document.querySelector('.quantity');
                quantity.textContent = `Всего заметок: ${model.tasks.length}`;
            }
        });




/* ------------------- favorite --------------------*/
        list.addEventListener('click', (event) => {
            event.preventDefault();
            if (event.target.classList.contains('favorite-button')) {
                const item = document.querySelector('.item');
                item.classList.toggle('favorite');

                // controller.favoriteTask(taskId);
            }
        });



    },

    renderTasks(tasks) {
        const list = document.querySelector('.list');
        let tasksHTML = '';

        for (const task of tasks) {
            tasksHTML += `
        <li id="${task.id}" class="item">
          <b class="task-title">${task.title}</b>
          <p class="task-description">${task.description}</p>
          <button class="favorite-button" type="button">Избранное &hearts;</button>
          <button class="delete-button" type="button">Удалить 🗑</button>
        </li>
      `
        }

        list.innerHTML = tasksHTML;
    },

    displayMessage(message, isError = false) {
        const messageBox = document.querySelector('.message-box');
        messageBox.textContent = message;
        if (isError) {
            // messageBox.classList.remove('success');
            messageBox.classList.add('error');
        } else {
            messageBox.classList.remove('error');
            // messageBox.classList.add('success');
        }
    },
}


/* ----------------- controller -------------------*/

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
}


/* --------------------- init ---------------------------*/

function init() {
    view.init();
}

document.addEventListener('DOMContentLoaded', init);