// demo.js
// Объединяющая логика демо-панели

$(function () {
    const logEl = $('#log-output');
    const statusIndicator = $('#app-status-indicator');

    let connected = false;
    let jobProgress = 0;
    let telemetryTimer = null;
    let jobTimer = null;

    function log(msg) {
        const ts = new Date().toISOString().split('T')[1].split('.')[0];
        const text = `[${ts}] ${msg}\n`;
        const prev = logEl.text();
        logEl.text(prev === 'Лог пуст...' ? text : prev + text);
        logEl.scrollTop(logEl[0].scrollHeight);
    }

    function setConnected(state) {
        connected = !!state;
        if (connected) {
            statusIndicator
                .removeClass('app__status-indicator_disconnected')
                .addClass('app__status-indicator_connected')
                .text('Подключено');
            log('Соединение установлено.');
            startTelemetry();
        } else {
            statusIndicator
                .removeClass('app__status-indicator_connected')
                .addClass('app__status-indicator_disconnected')
                .text('Отключено');
            log('Соединение разорвано.');
            stopTelemetry();
            stopJob();
            updateJobProgress(0);
        }
    }

    function startTelemetry() {
        stopTelemetry();
        telemetryTimer = setInterval(() => {
            if (!connected) return;
            const temp = (20 + Math.random() * 20).toFixed(1);
            const voltage = (12 + Math.random() * 0.5).toFixed(2);
            $('#kv-temp').text(temp + ' °C');
            $('#kv-voltage').text(voltage + ' V');

            const mode = UIKit.Combo.get('#combo-mode');
            $('#telemetry-text').text(
                `Темп: ${temp} °C, U: ${voltage} V, режим: ${mode || 'n/a'}`
            );
        }, 1500);
    }

    function stopTelemetry() {
        if (telemetryTimer) {
            clearInterval(telemetryTimer);
            telemetryTimer = null;
        }
        $('#telemetry-text').text('Ожидаем подключение...');
        $('#kv-temp').text('--.- °C');
        $('#kv-voltage').text('--.- V');
    }

    function updateJobProgress(value) {
        jobProgress = value;
        UIKit.Progress.set('#progress-job', value);
    }

    function startJob() {
        stopJob();
        updateJobProgress(0);
        UIKit.Progress.setLabel('#progress-job', 'Текущее задание');

        jobTimer = setInterval(() => {
            if (!connected) {
                stopJob();
                return;
            }
            let next = jobProgress + 7;
            if (next >= 100) {
                next = 100;
                updateJobProgress(next);
                log('Задание завершено.');
                stopJob();
                return;
            }
            updateJobProgress(next);
        }, 800);
    }

    function stopJob() {
        if (jobTimer) {
            clearInterval(jobTimer);
            jobTimer = null;
        }
    }

    // === Обработчики кнопок ===

    $('#btn-connect').on('click', function () {
        const addr = UIKit.LineEdit.getValue('#le-address');
        const port = UIKit.LineEdit.getValue('#le-port') || '502';
        const proto = UIKit.Combo.get('#combo-proto') || 'tcp';

        if (!addr) {
            UIKit.LineEdit.setError('#le-address', 'Адрес обязателен');
            log('Ошибка: не указан адрес устройства.');
            return;
        } else {
            UIKit.LineEdit.clearError('#le-address');
        }

        log(`Подключение к ${addr}:${port} по ${proto.toUpperCase()}...`);
        // Имитируем "задержку подключения" через loading-состояние кнопки
        UIKit.Button.setLoading('#btn-connect', true);

        setTimeout(() => {
            UIKit.Button.setLoading('#btn-connect', false);
            setConnected(true);
        }, 700);
    });

    $('#btn-disconnect').on('click', function () {
        setConnected(false);
    });

    $('#btn-apply').on('click', function () {
        if (!connected) {
            log('Нельзя применить настройки: устройство не подключено.');
            return;
        }
        const mode = UIKit.Combo.get('#combo-mode');
        const power = UIKit.Slider.get('#slider-power');
        const autostart = UIKit.Checkbox.isChecked('#chk-autostart');
        const autoreconnect = UIKit.Checkbox.isChecked('#chk-autoreconnect');

        log(
            `Применение настроек: режим=${mode}, мощность=${Math.round(
                power ?? 0
            )}%, автозапуск=${autostart ? 'да' : 'нет'}, ` +
            `автопереподключение=${autoreconnect ? 'да' : 'нет'}.`
        );

        // Кнопка уже умеет показывать loading через data-ui-btn-loading
        startJob();
    });

    $('#btn-reset').on('click', function () {
        UIKit.LineEdit.setValue('#le-address', '');
        UIKit.LineEdit.setValue('#le-port', '');
        UIKit.Combo.set('#combo-mode', 'normal');
        UIKit.Slider.set('#slider-power', 30);
        UIKit.Checkbox.set('#chk-autostart', false);
        log('Настройки сброшены к значениям по умолчанию.');
    });

    $('#toggle-power').on('change', '.ui-toggle__input', function () {
        const on = UIKit.Toggle.isOn('#toggle-power');
        $('#kv-power-state').text(on ? 'Вкл' : 'Выкл');
        log('Питание устройства: ' + (on ? 'включено' : 'выключено'));
    });

    $('#btn-log-clear').on('click', function () {
        logEl.text('Лог пуст...');
    });

    // Переключение вкладок через API (пример)
    $('#tabs-main').on('uitabs:change', function (e, payload) {
        log(`Переключение вкладки: ${payload.tabId}`);
    });

    // Инициализация стартовых значений
    UIKit.Slider.set('#slider-power', 30);
    UIKit.Progress.set('#progress-job', 0);
    $('#kv-power-state').text('Выкл');

    log('Демо панель загружена.');
});
