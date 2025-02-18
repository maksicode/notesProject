/*------------------------------------------------------- model ------------------------------------------------------*/
const model = {
    tasks: [], // Массив для хранения задач

    // Метод для добавления новой задачи
     addTask(title, description) {
        const id = Date.now(); // Генерация уникального ID с использованием текущего времени
        const newTask = { id: id, title: title, description: description, isFavorite: false }; // Создание новой задачи
        this.tasks.unshift(newTask); // Добавление задачи в начало массива
        view.renderTasks(this.tasks); // Обновление интерфейса
    },

    // Метод для удаления задачи
    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId); // Фильтрация массива, удаление задачи по ID
        view.renderTasks(this.tasks); // Обновление интерфейса
    },

    // Метод для переключения состояния "избранное"
    favoriteTask(taskId) {
        const task = this.tasks.find((task) => task.id === taskId); // Поиск задачи по ID
        if (task) {
            task.isFavorite = !task.isFavorite; // Переключение состояния isFavorite
            view.updateTask(task); // Обновление интерфейса для конкретной задачи
        }
    },
};


/*--------------------------------------------------------- view -----------------------------------------------------*/
const view = {
    // Инициализация представления
    init() {
        this.renderTasks(model.tasks); // Первоначальное отображение задач

        // Получение элементов DOM
        const form = document.querySelector('.form');
        const inputTitle = document.querySelector('.input-title');
        const inputDescription = document.querySelector('.input-description');
        const defaultText = document.querySelector('.default-text'); // Текст при отсутствии заметок
        const list = document.querySelector('.list');
        const favoriteFilter = document.querySelector('.favorite-filter'); // Блок добавления в избранное
        const quantity = document.querySelector('.quantity'); // Счетчик заметок
        const favoriteCheckbox = document.querySelector('.favorite-checkbox'); // Чекбокс для фильтрации избранных

        // Обработчик отправки формы
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Предотвращение перезагрузки страницы
            const title = inputTitle.value;
            const description = inputDescription.value;

            controller.addTask(title, description); // Добавление задачи через контроллер

            // Очистка полей ввода, если данные были введены
            if (title !== '' && description !== '') {
                inputTitle.value = '';
                inputDescription.value = '';
            }

            // Обновление интерфейса
            defaultText.classList.add('hidden'); // Скрытие текста "Нет задач"
            quantity.textContent = `Всего заметок: ${model.tasks.length}`; // Обновление счетчика задач

            // Показ/скрытие фильтра избранного
            if (model.tasks.length === 0) {
                favoriteFilter.classList.add('hidden');
            } else {
                favoriteFilter.classList.remove('hidden');
            }
        });

        // Обработчик кликов по списку задач
        list.addEventListener('click', (event) => {
            event.preventDefault(); // Предотвращение стандартного поведения
            const taskId = +event.target.closest('.item').id; // Получение ID задачи

            // Удаление задачи
            if (event.target.classList.contains('delete-button')) {
                controller.deleteTask(taskId); // Удаление задачи через контроллер
                quantity.textContent = `Всего заметок: ${model.tasks.length}`; // Обновление счетчика задач
                defaultText.classList.toggle('hidden', model.tasks.length !== 0); // Показ/скрытие текста "Нет задач"
                favoriteFilter.classList.toggle('hidden', model.tasks.length === 0); // Показ/скрытие фильтра избранного
            }

            // Переключение состояния "избранное"
            if (event.target.classList.contains('favorite-button')) {
                controller.favoriteTask(taskId); // Переключение состояния через контроллер
            }
        });

        // Обработчик изменения состояния чекбокса "Показать только избранные"
        favoriteCheckbox.addEventListener('change', () => {
            view.updateTaskList(); // Теперь фильтр обновляется корректно
        });
    },

    // Метод для отображения списка задач
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
        `).join(''); // Преобразование массива задач в HTML-строку
    },

    // Метод для обновления конкретной задачи
    updateTask(task) {
        const taskElement = document.getElementById(task.id); // Поиск элемента задачи по ID
        if (taskElement) {
            // Обновление текста кнопки "Избранное"
            taskElement.querySelector('.favorite-button').textContent = task.isFavorite ? 'В избранном' : 'В избранное';
            // Переключение класса "favorite" для визуального выделения
            taskElement.classList.toggle('favorite', task.isFavorite);
        }
    },

    displayMessage(message, isError = false) {
        const toastContainer = document.querySelector('.toast-container');

        // Создаем уведомление
        const toast = document.createElement('div');
        toast.classList.add('toast', isError ? 'error' : 'success');
        toast.textContent = message;

        // Добавляем в контейнер
        toastContainer.appendChild(toast);

        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    // Метод для обновления списка задач в зависимости от фильтра "избранное"
    updateTaskList() {
        const favoriteCheckbox = document.querySelector('.favorite-checkbox');
        if (favoriteCheckbox.checked) {
            const favoriteTasks = model.tasks.filter(task => task.isFavorite);
            this.renderTasks(favoriteTasks); // Отображение только избранных задач
        } else {
            this.renderTasks(model.tasks); // Отображение всех задач
        }
    },
};


/*----------------------------------------------------- controller ---------------------------------------------------*/
const controller = {
    // Метод для добавления задачи
    addTask(title, description) {
        if (title.trim() !== '' && description.trim() !== '') {
            model.addTask(title, description);
            // После добавления задачи обновляем отображение в зависимости от фильтра
            view.updateTaskList();
            view.displayMessage('Заметка добавлена');
        } else {
            view.displayMessage('Заполните все поля!', true);
        }
    },

    // Метод для удаления задачи
    deleteTask(taskId) {
        model.deleteTask(taskId);
        view.updateTaskList(); // Обновляем список задач в зависимости от фильтра
        view.displayMessage('Заметка удалена', false);
    },

    // Метод для переключения состояния "избранное"
    favoriteTask(taskId) {
        model.favoriteTask(taskId); // Переключаем статус избранного
        view.updateTaskList(); // Обновляем список задач в зависимости от фильтра
    },
};


/*------------------------------------------------------ init --------------------------------------------------------*/
function init() {
    view.init(); // Инициализация представления
}

// Запуск инициализации после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}