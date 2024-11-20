function getVersion() {
    let version = localStorage.getItem('ab_version');
    if (!version) {
        version = Math.random() < 0.5 ? 'a' : 'b'; // С вероятностью 50% выбираем 'a' или 'b'
        localStorage.setItem('ab_version', version);
    }
    return version;
}

// В зависимости от выбранной версии загружаем нужный контент
function loadVersion() {
    const version = getVersion();
    if (version === 'a') {
        // Включаем версию с онбордингом
        
        // Подключаем и запускаем онбординг
        import('./node_modules/light-onboarding-tour/OnboardingTour.js').then(({ OnboardingTour }) => {
            const tour = new OnboardingTour();

            tour.StartNewTour([
                {
                    element: '#el1',
                    popover: {
                        title: "Добро пожаловать",
                        description: "ХАй ЗЯБЛ",
                        position: 'right'
                    }
                }
            ]);
        });
    } else {
        // Включаем версию без онбординга
        document.getElementById('onboarding-container').innerHTML = '';
    }

    // Отправляем данные о версии в Яндекс.Метрику
    ym(YOUR_COUNTER_ID, 'params', { version: version });
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
