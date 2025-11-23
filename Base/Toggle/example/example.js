// Включить
UIKit.Toggle.set('#power-toggle', true);

// Узнать состояние
const isOn = UIKit.Toggle.isOn('#power-toggle');

// Переключить
UIKit.Toggle.toggle('#power-toggle');

// Отключить управление
UIKit.Toggle.setDisabled('#power-toggle', true);
