// checkbox.js
// Модуль для UI-checkbox'ов.
// Требует jQuery 3.7.0+

(function ($) {
    if (!$) {
        console.error('UICheckbox: jQuery not found');
        return;
    }

    const UICheckbox = {
        init() {
            const self = this;

            // Первичная синхронизация классов
            $('.ui-chk__input').each(function () {
                self._syncState(this);
            });

            // Обновляем классы при изменении
            $(document).on('change', '.ui-chk__input', function () {
                self._syncState(this);
            });

            // Пример работы API на демо-кнопках (можно убрать в реальном проекте)
            this._bindDemoControls();
        },

        /**
         * Синхронизирует классы .ui-chk_* с состоянием input.
         * @param {HTMLElement} input
         * @private
         */
        _syncState(input) {
            const $input = $(input);
            const $wrapper = $input.closest('.ui-chk');

            if (!$wrapper.length) return;

            const checked = $input.prop('checked');
            const disabled = $input.prop('disabled');
            const indeterminate = $input.prop('indeterminate');

            $wrapper.toggleClass('ui-chk_checked', !!checked);
            $wrapper.toggleClass('ui-chk_disabled', !!disabled);
            $wrapper.toggleClass('ui-chk_indeterminate', !!indeterminate);
        },

        /**
         * Установить состояние.
         * @param {HTMLElement|jQuery|string} el  input или .ui-chk (или селектор)
         * @param {boolean} value
         */
        set(el, value) {
            const $input = this._resolveInput(el);
            if (!$input.length) return;

            $input.prop('checked', !!value);
            $input.prop('indeterminate', false);
            this._syncState($input[0]);
        },

        /**
         * Получить состояние checked.
         * @param {HTMLElement|jQuery|string} el
         * @returns {boolean}
         */
        isChecked(el) {
            const $input = this._resolveInput(el);
            if (!$input.length) return false;
            return !!$input.prop('checked');
        },

        /**
         * Переключить состояние checked.
         * @param {HTMLElement|jQuery|string} el
         */
        toggle(el) {
            const $input = this._resolveInput(el);
            if (!$input.length) return;

            const newVal = !$input.prop('checked');
            $input.prop('checked', newVal);
            $input.prop('indeterminate', false);
            this._syncState($input[0]);
        },

        /**
         * Сделать чекбокс indeterminate (частично выделенный).
         * @param {HTMLElement|jQuery|string} el
         * @param {boolean} value
         */
        setIndeterminate(el, value) {
            const $input = this._resolveInput(el);
            if (!$input.length) return;

            $input.prop('indeterminate', !!value);
            if (value) {
                // Обычно indeterminate визуально не считается checked,
                // так что снимаем галку
                $input.prop('checked', false);
            }
            this._syncState($input[0]);
        },

        /**
         * Включить/выключить disabled.
         * @param {HTMLElement|jQuery|string} el
         * @param {boolean} value
         */
        setDisabled(el, value) {
            const $input = this._resolveInput(el);
            if (!$input.length) return;

            $input.prop('disabled', !!value);
            this._syncState($input[0]);
        },

        /**
         * Приведение любого элемента/селектора к input[type=checkbox].
         * Можно передать input или .ui-chk или селектор.
         * @param el
         * @returns {jQuery}
         * @private
         */
        _resolveInput(el) {
            let $el = $(el);
            if (!$el.length) return $();

            if ($el.is('input[type=checkbox].ui-chk__input')) {
                return $el;
            }

            if ($el.hasClass('ui-chk')) {
                return $el.find('input[type=checkbox].ui-chk__input').first();
            }

            // если передан что-то ещё по селектору — пытаемся найти внутри
            const $asWrapper = $el.find('input[type=checkbox].ui-chk__input').first();
            if ($asWrapper.length) return $asWrapper;

            return $();
        },

        /**
         * Демо-логика для кнопок управления на странице примера.
         * В реальном проекте можно удалить.
         * @private
         */
        _bindDemoControls() {
            const self = this;
            const $demo = $('#chk-demo');

            $('#btn-check').on('click', function () {
                self.set($demo, true);
            });

            $('#btn-uncheck').on('click', function () {
                self.set($demo, false);
            });

            $('#btn-toggle').on('click', function () {
                self.toggle($demo);
            });

            $('#btn-indeterminate').on('click', function () {
                self.setIndeterminate($demo, true);
            });
        }
    };

    // Экспорт в глобальный namespace
    window.UIKit = window.UIKit || {};
    window.UIKit.Checkbox = UICheckbox;

    $(function () {
        UICheckbox.init();
        console.log('UICheckbox: init done');
    });

})(window.jQuery);
