// Активировать вкладку
UIKit.Tabs.setActive('#device-tabs', 'net');

// Получить активную
const tabId = UIKit.Tabs.getActive('#device-tabs');

// Отключить вкладку
UIKit.Tabs.setDisabled('#device-tabs', 'net', true);
