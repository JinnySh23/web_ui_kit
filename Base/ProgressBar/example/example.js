// Установить значение в "единицах" (0–100 по умолчанию)
UIKit.Progress.set('#task-progress', 55);

// Получить значение
const v = UIKit.Progress.get('#task-progress');

// Задать диапазон
UIKit.Progress.setRange('#task-progress', 0, 500);
UIKit.Progress.set('#task-progress', 125);

// Indeterminate вкл/выкл
UIKit.Progress.setIndeterminate('#task-progress', true);

// Сменить подпись
UIKit.Progress.setLabel('#task-progress', 'Новое состояние');

// Отключить / включить
UIKit.Progress.setDisabled('#task-progress', true);
