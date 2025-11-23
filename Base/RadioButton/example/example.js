// Получить выбранное
const mode = UIKit.Radio.getGroupValue('#mode-group');     // или 'mode'

// Установить
UIKit.Radio.setGroupValue('#mode-group', 'manual');

// Отключить всю группу
UIKit.Radio.setDisabled('#mode-group', true);
