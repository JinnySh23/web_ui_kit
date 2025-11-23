// Установить значение
UIKit.Slider.set('#temp-slider', 60);

// Получить значение
const val = UIKit.Slider.get('#temp-slider');

// Изменить диапазон
UIKit.Slider.setRange('#temp-slider', 10, 80);

// Выключить / включить
UIKit.Slider.setDisabled('#temp-slider', true);
UIKit.Slider.setDisabled('#temp-slider', false);
