import { OnboardingTour } from "./libs/OnboardingTour.js";


function getVersion() {
    let version = localStorage.getItem('ab_version');
    if (!version) {
        version = Math.random() < 0.5 ? 'a' : 'b'; // С вероятностью 50% выбираем 'a' или 'b'
        localStorage.setItem('ab_version', version);
    }
    
    return version;
}

console.log('Выбранная версия:', getVersion());



function loadVersion() {

    document.addEventListener('DOMContentLoaded', () => {
        const version = getVersion();
        const el = document.querySelector('#el1'); // Используем const для объявления переменной
        if (!el) {
            console.error('Элемент #el1 не найден в DOM.');
            return; // Прерываем выполнение, если элемент отсутствует
        }
        console.log('Элемент #el1 найден:', el);
    
        if (version === 'a') {
            const tour = new OnboardingTour();
            tour.StartNewTour([
                {
                    element: '#el1', // Существующий элемент в HTML
                    popover: {
                        title: "Добро пожаловать",
                        description: "Хай ЗЯБЛ",
                        position: 'right',
                    },
                },
            ]);
        } else {
            console.log('Версия B: без онбординга.');
        }
    
        // Отправляем данные о версии в Яндекс.Метрику
        const counterId = 98237847;
        ym(counterId, 'params', { version: version });
    });
    
}

loadVersion();



document.getElementById('booking-button').addEventListener('click', function() {
    document.getElementById('booking-form').style.display = 'block'; // Показываем форму
});

document.getElementById('close-button').addEventListener('click', function() {
    document.getElementById('booking-form').style.display = 'none'; // Скрываем форму
});

// Обработчик отправки формы
document.getElementById('form').onsubmit = function(e) {
    e.preventDefault(); // Предотвращаем стандартное поведение отправки формы
    alert('Форма отправлена!'); // Здесь вы можете добавить свою логику отправки данных
    var form = document.getElementById('booking-form');
    form.classList.add('hidden'); // Закрыть форму после отправки
};
