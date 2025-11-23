// toggle.js
// UI Toggle switch
// Требует jQuery 3.7.0+

(function ($) {
    if (!$) {
        console.error('UIToggle: jQuery not found');
        return;
    }

    const UIToggle = {
        init() {
            const self = this;

            // Первичная синхронизация всех тумблеров
            $('.ui-toggle__input').each(function () {
                self._syncState(this);
            });

            // Обновляем при изменении
            $(document).on('change', '.ui-toggle__input', function () {
                self._syncState(this);
            });

            // Навесим demo-кнопки на странице примера
            this._bindDemoControls();
        },

        /**
         * Синхронизирует классы обёртки по состоянию input.
         * @param {HTMLElement} input
         * @private
         */
        _syncState(input) {
            const $input = $(input);
            const $wrapper = $input.closest('.ui-toggle');
            if (!$wrapper.length) return;

            const checked = $input.prop('checked');
            const disabled = $input.prop('disabled');

            $wrapper.toggleClass('ui-toggle_on', !!checked);
            $wrapper.toggleClass('ui-toggle_disabled', !!disabled);
        },

        /**
         * Установить состояние on/off.
         * @param {HTMLElement|jQuery|string} el  input или .ui-toggle или селектор
         * @param {boolean} value
         */
        set(el, value) {
            const $input = this._resolveInput(el);
            if (!$input.length) return;

            $input.prop('checked', !!value);
            this._syncState($input[0]);
        },

        /**
         * Получить состояние.
         * @param {HTMLElement|jQuery|string} el
         * @returns {boolean}
         */
        isOn(el) {
            const $input = this._resolveInput(el);
            if (!$input.length) return false;
            return !!$input.prop('checked');
        },

        /**
         * Переключить состояние.
         * @param {HTMLElement|jQuery|string} el
         */
        toggle(el) {
            const $input = this._resolveInput(el);
            if (!$input.length) return;

            const val = !$input.prop('checked');
            $input.prop('checked', val);
            this._syncState($input[0]);
        },

        /**
         * Включить/выключить disabled.
         * @param {HTMLElement|jQuery|string} el
         * @param {boolean} disabled
         */
        setDisabled(el, disabled) {
            const $input = this._resolveInput(el);
            if (!$input.length) return;

            $input.prop('disabled', !!disabled);
            this._syncState($input[0]);
        },

        /**
         * Разрешить input[type=checkbox] из wrapper или селектора.
         * @param el
         * @returns {jQuery}
         * @private
         */
        _resolveInput(el) {
            let $el = $(el);
            if (!$el.length) return $();

            if ($el.is('input[type=checkbox].ui-toggle__input')) {
                return $el;
            }

            if ($el.hasClass('ui-toggle')) {
                return $el.find('input[type=checkbox].ui-toggle__input').first();
            }

            const $inner = $el.find('input[type=checkbox].ui-toggle__input').first();
            if ($inner.length) return $inner;

            return $();
        },

        /**
         * Демонстрационные кнопки (только для toggle.html).
         * @private
         */
        _bindDemoControls() {
            const self = this;
            const $demo = $('#toggle-demo');

            $('#btn-on').on('click', function () {
                self.set($demo, true);
            });

            $('#btn-off').on('click', function () {
                self.set($demo, false);
            });

            $('#btn-toggle').on('click', function () {
                self.toggle($demo);
            });

            $('#btn-disable').on('click', function () {
                self.setDisabled($demo, true);
            });

            $('#btn-enable').on('click', function () {
                self.setDisabled($demo, false);
            });
        }
    };

    // Экспорт в глобальный namespace
    window.UIKit = window.UIKit || {};
    window.UIKit.Toggle = UIToggle;

    $(function () {
        UIToggle.init();
        console.log('UIToggle: init done');
    });

})(window.jQuery);
