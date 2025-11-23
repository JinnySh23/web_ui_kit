// lineedit.js
// UI LineEdit (QLineEdit-style)
// Требует jQuery 3.7.0+

(function ($) {
    if (!$) {
        console.error('UILineEdit: jQuery not found');
        return;
    }

    const UILineEdit = {
        init() {
            const self = this;

            // Инициализация всех полей
            $('[data-ui-lineedit]').each(function () {
                self._initOne($(this));
            });

            // Демка
            this._bindDemoControls();
        },

        _initOne($wrap) {
            const $input = $wrap.find('.ui-lineedit__input').first();
            if (!$input.length) return;

            // Если wrapper имеет класс ui-lineedit_disabled — синхронизируем disabled
            if ($wrap.hasClass('ui-lineedit_disabled')) {
                $input.prop('disabled', true);
            }
        },

        /**
         * Приводим к .ui-lineedit
         * @param el
         * @returns {jQuery}
         * @private
         */
        _resolveWrapper(el) {
            let $el = $(el);
            if (!$el.length) return $();

            if ($el.hasClass('ui-lineedit')) {
                return $el.first();
            }

            const $parent = $el.closest('.ui-lineedit');
            if ($parent.length) return $parent.first();

            return $();
        },

        _getInput($wrap) {
            return $wrap.find('.ui-lineedit__input').first();
        },

        /**
         * Установить значение.
         * @param el
         * @param {string} value
         */
        setValue(el, value) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;
            const $input = this._getInput($wrap);
            if (!$input.length) return;

            $input.val(value ?? '');
        },

        /**
         * Получить значение.
         * @param el
         * @returns {string}
         */
        getValue(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return '';
            const $input = this._getInput($wrap);
            if (!$input.length) return '';
            return $input.val() ?? '';
        },

        /**
         * Установить текст ошибки и подсветку.
         * @param el
         * @param {string} message
         */
        setError(el, message) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            $wrap.addClass('ui-lineedit_error');

            let $hint = $wrap.find('.ui-lineedit__error-text').first();
            if (!$hint.length) {
                // если нет отдельного блока под ошибку — используем hint
                $hint = $wrap.find('.ui-lineedit__hint').first();
                if (!$hint.length) {
                    // создаём
                    $hint = $('<div class="ui-lineedit__hint ui-lineedit__error-text"></div>');
                    $wrap.append($hint);
                } else {
                    $hint.addClass('ui-lineedit__error-text');
                }
            }
            if (message != null) {
                $hint.text(message);
            }
        },

        /**
         * Убрать ошибку (подсветка + текст).
         * @param el
         */
        clearError(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            $wrap.removeClass('ui-lineedit_error');

            // Не всегда нужно удалять текст hint, но в демо давай чистить
            const $hintErr = $wrap.find('.ui-lineedit__error-text').first();
            if ($hintErr.length) {
                // либо очищаем текст, либо можно убрать класс
                $hintErr.text('');
            }
        },

        /**
         * Включить/выключить disabled.
         * @param el
         * @param {boolean} disabled
         */
        setDisabled(el, disabled) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;
            const $input = this._getInput($wrap);
            if (!$input.length) return;

            $input.prop('disabled', !!disabled);
            $wrap.toggleClass('ui-lineedit_disabled', !!disabled);
        },

        /**
         * Фокус в поле.
         * @param el
         */
        focus(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;
            const $input = this._getInput($wrap);
            if (!$input.length) return;

            $input.trigger('focus');
            // переносим курсор в конец
            const val = $input.val();
            if (typeof val === 'string') {
                const len = val.length;
                $input[0].setSelectionRange?.(len, len);
            }
        },

        /* ===== ДЕМО ДЛЯ lineedit.html ===== */

        _bindDemoControls() {
            const self = this;
            const $demo = $('#lineedit-js-demo');
            const $out = $('#lineedit-js-output');

            $('#btn-le-set').on('click', function () {
                self.setValue($demo, '192.168.0.100');
            });

            $('#btn-le-get').on('click', function () {
                const v = self.getValue($demo);
                $out.text('Текущее значение: ' + (v || 'пусто'));
            });

            $('#btn-le-error').on('click', function () {
                const v = self.getValue($demo);
                if (!v || !/^\d{1,3}(\.\d{1,3}){3}$/.test(v)) {
                    self.setError($demo, 'Ожидается IPv4 в формате x.x.x.x');
                } else {
                    self.setError($demo, 'Формально похоже на IPv4, но это просто демонстрация 🙂');
                }
            });

            $('#btn-le-clear-error').on('click', function () {
                self.clearError($demo);
            });

            $('#btn-le-disable').on('click', function () {
                self.setDisabled($demo, true);
            });

            $('#btn-le-enable').on('click', function () {
                self.setDisabled($demo, false);
            });

            $('#btn-le-focus').on('click', function () {
                self.focus($demo);
            });
        }
    };

    // Экспорт
    window.UIKit = window.UIKit || {};
    window.UIKit.LineEdit = UILineEdit;

    $(function () {
        UILineEdit.init();
        console.log('UILineEdit: init done');
    });

})(window.jQuery);
