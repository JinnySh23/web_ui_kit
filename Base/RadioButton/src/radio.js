// radio.js
// UI Radio buttons
// Требует jQuery 3.7.0+

(function ($) {
    if (!$) {
        console.error('UIRadio: jQuery not found');
        return;
    }

    const UIRadio = {
        init() {
            const self = this;

            // Первичная синхронизация
            $('.ui-radio__input').each(function () {
                self._syncState(this);
            });

            // Обработка изменений
            $(document).on('change', '.ui-radio__input', function () {
                const $input = $(this);

                // Все радио с таким же name должны обновить состояние
                const name = $input.attr('name');
                if (name) {
                    $(`input.ui-radio__input[name="${CSS.escape(name)}"]`).each(function () {
                        self._syncState(this);
                    });
                } else {
                    self._syncState(this);
                }
            });

            // Демо-кнопки
            this._bindDemoControls();
        },

        /**
         * Синхронизирует wrapper-классы.
         * @param {HTMLElement} input
         * @private
         */
        _syncState(input) {
            const $input = $(input);
            const $wrapper = $input.closest('.ui-radio');
            if (!$wrapper.length) return;

            const checked = $input.prop('checked');
            const disabled = $input.prop('disabled');

            $wrapper.toggleClass('ui-radio_checked', !!checked);
            $wrapper.toggleClass('ui-radio_disabled', !!disabled);
        },

        /**
         * Получить значение выбранной радио-группы.
         * Можно передать:
         *  - строку name: "mode_js"
         *  - wrapper (селектор/DOM/jQuery), внутри которого искать name первой радио.
         * @param {string|HTMLElement|jQuery} group
         * @returns {string|null}
         */
        getGroupValue(group) {
            const $inputs = this._resolveGroupInputs(group);
            if (!$inputs.length) return null;

            const $checked = $inputs.filter(':checked').first();
            if (!$checked.length) return null;

            return $checked.val() ?? null;
        },

        /**
         * Установить значение в группе.
         * @param {string|HTMLElement|jQuery} group
         * @param {string} value
         */
        setGroupValue(group, value) {
            const $inputs = this._resolveGroupInputs(group);
            if (!$inputs.length) return;

            $inputs.each((_, el) => {
                const $el = $(el);
                const match = $el.val() == value;
                $el.prop('checked', match);
                this._syncState(el);
            });
        },

        /**
         * Отключить/включить одну радио или группу.
         * @param {HTMLElement|jQuery|string} target
         *  - .ui-radio__input
         *  - .ui-radio
         *  - wrapper (для всех радио внутри)
         * @param {boolean} disabled
         */
        setDisabled(target, disabled) {
            const $t = $(target);
            if (!$t.length) return;

            let $inputs;

            if ($t.is('input[type=radio].ui-radio__input')) {
                $inputs = $t;
            } else if ($t.hasClass('ui-radio')) {
                $inputs = $t.find('input[type=radio].ui-radio__input');
            } else {
                // любой контейнер — ищем внутри
                $inputs = $t.find('input[type=radio].ui-radio__input');
            }

            $inputs.each((_, el) => {
                $(el).prop('disabled', !!disabled);
                this._syncState(el);
            });
        },

        /**
         * Вспомогательная: получить все input[type=radio] в группе.
         * @param {string|HTMLElement|jQuery} group
         * @returns {jQuery}
         * @private
         */
        _resolveGroupInputs(group) {
            // Строка -> считаем как name группы
            if (typeof group === 'string') {
                // group = name
                return $(`input.ui-radio__input[name="${CSS.escape(group)}"]`);
            }

            // Иначе — это wrapper
            const $g = $(group);
            if (!$g.length) return $();

            let name = null;
            const $firstRadio = $g.find('input.ui-radio__input[type=radio]').first();
            if ($firstRadio.length) {
                name = $firstRadio.attr('name');
            }
            if (!name) return $();

            return $(`input.ui-radio__input[name="${CSS.escape(name)}"]`);
        },

        /**
         * Демо на радио.html.
         * @private
         */
        _bindDemoControls() {
            const self = this;

            $('#btn-set-heat').on('click', function () {
                self.setGroupValue('#mode-js-group', 'heat');
            });

            $('#btn-get-value').on('click', function () {
                const val = self.getGroupValue('#mode-js-group');
                $('#js-output').text('Текущее значение mode_js: ' + (val ?? 'ничего не выбрано'));
            });

            $('#btn-disable-group').on('click', function () {
                self.setDisabled('#mode-js-group', true);
            });

            $('#btn-enable-group').on('click', function () {
                self.setDisabled('#mode-js-group', false);
            });
        }
    };

    // Экспорт
    window.UIKit = window.UIKit || {};
    window.UIKit.Radio = UIRadio;

    $(function () {
        UIRadio.init();
        console.log('UIRadio: init done');
    });

})(window.jQuery);
