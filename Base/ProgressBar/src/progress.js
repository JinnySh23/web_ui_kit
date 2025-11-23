// progress.js
// UI Progress Bar (Qt-style)
// Требует jQuery 3.7.0+

(function ($) {
    if (!$) {
        console.error('UIProgress: jQuery not found');
        return;
    }

    const UIProgress = {
        init() {
            const self = this;

            // Инициализация всех прогрессов по атрибуту
            $('[data-ui-progress]').each(function () {
                self._initOne($(this));
            });

            // Демо-кнопки
            this._bindDemoControls();
        },

        /**
         * Инициализация одного прогресса
         * @param {jQuery} $wrap
         * @private
         */
        _initOne($wrap) {
            // читаем min/max/value из data- атрибутов
            const minAttr = $wrap.data('min');
            const maxAttr = $wrap.data('max');
            const valueAttr = $wrap.data('value');

            const min = (minAttr !== undefined) ? Number(minAttr) : 0;
            const max = (maxAttr !== undefined) ? Number(maxAttr) : 100;

            $wrap.data('min', isFinite(min) ? min : 0);
            $wrap.data('max', isFinite(max) ? max : 100);

            if (valueAttr !== undefined) {
                const v = Number(valueAttr);
                if (isFinite(v)) {
                    $wrap.data('value', v);
                }
            }

            this._updateVisuals($wrap);
        },

        /**
         * Обновляет ширину бара и текст процента.
         * @param {jQuery} $wrap
         * @private
         */
        _updateVisuals($wrap) {
            const $bar = $wrap.find('.ui-progress__bar').first();
            const $value = $wrap.find('.ui-progress__value').first();

            const isIndeterminate = $wrap.hasClass('ui-progress_indeterminate');

            if (isIndeterminate) {
                // В indeterminate шириной и числом рулит CSS, тут ничего не трогаем
                if ($value.hasClass('ui-progress__value_dim')) {
                    // уже есть "…" — ок
                } else if ($value.length && !$value.text()) {
                    $value.text('…');
                }
                return;
            }

            const min = Number($wrap.data('min') ?? 0);
            const max = Number($wrap.data('max') ?? 100);
            const rawVal = Number($wrap.data('value'));

            const safeMin = isFinite(min) ? min : 0;
            const safeMax = isFinite(max) ? max : 100;
            const clampedVal = isFinite(rawVal)
                ? Math.min(Math.max(rawVal, safeMin), safeMax)
                : safeMin;

            const pct = (clampedVal - safeMin) / (safeMax - safeMin || 1) * 100;

            if ($bar.length) {
                $bar.css('width', pct + '%');
            }
            if ($value.length) {
                // Можно кастомизировать отображение (целое / с суффиксом и т.п.)
                $value.text(Math.round(pct) + '%');
            }
        },

        /**
         * Установить значение прогресса.
         * @param {HTMLElement|jQuery|string} el  .ui-progress или селектор
         * @param {number} value
         */
        set(el, value) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            const v = Number(value);
            if (!isFinite(v)) return;

            $wrap.data('value', v);
            $wrap.removeClass('ui-progress_indeterminate');

            this._updateVisuals($wrap);
        },

        /**
         * Получить текущее значение (в "единицах", не в процентах).
         * @param el
         * @returns {number|null}
         */
        get(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return null;

            const v = Number($wrap.data('value'));
            return isFinite(v) ? v : null;
        },

        /**
         * Установить min/max.
         * @param el
         * @param {number} min
         * @param {number} max
         */
        setRange(el, min, max) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            const a = Number(min);
            const b = Number(max);
            if (!isFinite(a) || !isFinite(b) || a === b) {
                console.warn('UIProgress.setRange: invalid range');
                return;
            }

            const newMin = Math.min(a, b);
            const newMax = Math.max(a, b);

            $wrap.data('min', newMin);
            $wrap.data('max', newMax);

            // Перекладываем значение в новый диапазон (с клатчем)
            const v = this.get($wrap) ?? newMin;
            const clamped = Math.min(Math.max(v, newMin), newMax);
            $wrap.data('value', clamped);

            this._updateVisuals($wrap);
        },

        /**
         * Включить / выключить indeterminate.
         * @param el
         * @param {boolean} flag
         */
        setIndeterminate(el, flag) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            if (flag) {
                $wrap.addClass('ui-progress_indeterminate');
            } else {
                $wrap.removeClass('ui-progress_indeterminate');
            }

            this._updateVisuals($wrap);
        },

        /**
         * Изменить подпись слева (label).
         * @param el
         * @param {string} text
         */
        setLabel(el, text) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            const $label = $wrap.find('.ui-progress__label').first();
            if ($label.length) {
                $label.text(text);
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

            $wrap.toggleClass('ui-progress_disabled', !!disabled);
        },

        /**
         * Приводим к .ui-progress
         * @param el
         * @returns {jQuery}
         * @private
         */
        _resolveWrapper(el) {
            let $el = $(el);
            if (!$el.length) return $();

            if ($el.hasClass('ui-progress')) {
                return $el.first();
            }

            const $parent = $el.closest('.ui-progress');
            if ($parent.length) return $parent.first();

            return $();
        },

        /**
         * Демо-обработчики для progress.html.
         * @private
         */
        _bindDemoControls() {
            const self = this;
            const $demo = $('#progress-demo');

            $('#btn-pg-0').on('click', () => self.set($demo, 0));
            $('#btn-pg-25').on('click', () => self.set($demo, 25));
            $('#btn-pg-50').on('click', () => self.set($demo, 50));
            $('#btn-pg-100').on('click', () => self.set($demo, 100));

            $('#btn-pg-plus10').on('click', () => {
                const v = self.get($demo) ?? 0;
                self.set($demo, v + 10);
            });

            $('#btn-pg-indeterminate').on('click', () => {
                const isInd = $demo.hasClass('ui-progress_indeterminate');
                self.setIndeterminate($demo, !isInd);
            });

            $('#btn-pg-disable').on('click', () => {
                self.setDisabled($demo, true);
            });

            $('#btn-pg-enable').on('click', () => {
                self.setDisabled($demo, false);
            });

            $('#btn-pg-label').on('click', () => {
                const current = $demo.find('.ui-progress__label').text() || '';
                const next = current.includes('Передача')
                    ? 'Обработка результатов'
                    : 'Передача файла';
                self.setLabel($demo, next);
            });
        }
    };

    // Экспорт
    window.UIKit = window.UIKit || {};
    window.UIKit.Progress = UIProgress;

    $(function () {
        UIProgress.init();
        console.log('UIProgress: init done');
    });

})(window.jQuery);
