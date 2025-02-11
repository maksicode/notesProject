const model = {
tasks: [],

addTask(title, description) {
    const id = Math.random();
    const newTask = {id, title, description}
    this.tasks.push(newTask);

    view.renderTasks(this.tasks);
    },
}


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
        });

    //     const list = document.querySelector('.list');
    //
    //     list.addEventListener('click', (event) => {
    //         event.preventDefault();
    //         if (event.target.classList.contains('delete-button')) {
    //             const movieId = +event.target.parentElement.id;
    //             controller.deleteMovie(movieId);
    //         }
    //     })
    },

    renderTasks(tasks) {
        const list = document.querySelector('.list');
        let tasksHTML = '';

        for (const task of tasks) {
            tasksHTML += `
        <li id="${task.id}" class="item">
          <b class="task-title">${task.title}</b>
          <p class="task-description">${task.description}</p>
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
            messageBox.classList.remove('success');
            messageBox.classList.add('error');
        } else {
            messageBox.classList.remove('error');
            messageBox.classList.add('success');
        }
    },

}



const controller = {
    addTask(title, description) {
        if (title.trim() !== '' && description.trim() !== '') {
            model.addTask(title, description);
            view.displayMessage('Заметка добавлена');
        } else {
            view.displayMessage('Заполните все поля!', true);
        }
    },
}

function init() {
    view.init();
}

document.addEventListener('DOMContentLoaded', init);