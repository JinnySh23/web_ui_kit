// slider.js
// UI Slider (на базе input[type=range])
// Требует jQuery 3.7.0+

(function ($) {
    if (!$) {
        console.error('UISlider: jQuery not found');
        return;
    }

    const UISlider = {
        init() {
            const self = this;

            // Инициализация всех слайдеров с атрибутом data-ui-slider
            $('[data-ui-slider]').each(function () {
                self._initSlider($(this));
            });

            // Слушаем изменения
            $(document).on('input change', '.ui-slider__input', function () {
                self._updateVisuals($(this));
            });

            // Демо-кнопки для примера
            this._bindDemoControls();
        },

        /**
         * Инициализация одного слайдера.
         * @param {jQuery} $wrapper
         * @private
         */
        _initSlider($wrapper) {
            const $input = $wrapper.find('.ui-slider__input').first();
            if (!$input.length) return;

            // Обновляем визуальное состояние
            this._updateVisuals($input);
        },

        /**
         * Обновление текущего значения и прогресса трека.
         * @param {jQuery} $input
         * @private
         */
        _updateVisuals($input) {
            const $wrapper = $input.closest('.ui-slider');
            const $value = $wrapper.find('.ui-slider__value').first();

            const min = parseFloat($input.attr('min') ?? '0');
            const max = parseFloat($input.attr('max') ?? '100');
            const rawVal = parseFloat($input.val() ?? '0');

            const clamped = isFinite(rawVal) ? Math.min(Math.max(rawVal, min), max) : min;
            const pct = (clamped - min) / (max - min || 1) * 100;

            // Обновляем текстовое значение
            if ($value.length) {
                // здесь можно форматировать как нужно
                $value.text(Math.round(clamped));
            }

            // Для WebKit-движка: красим фон трека градиентом
            const isWebkit = 'webkitSliderThumb' in document.createElement('input');
            if (isWebkit) {
                const trackColor = '#3b4252';
                const fillColor = '#2d7dff';
                const bg = `linear-gradient(to right, ${fillColor} 0%, ${fillColor} ${pct}%, ${trackColor} ${pct}%, ${trackColor} 100%)`;
                $input.css('background-image', bg);
            }

            // Обновляем классы по disabled
            const disabled = $input.prop('disabled');
            $wrapper.toggleClass('ui-slider_disabled', !!disabled);
        },

        /**
         * Установить значение слайдера.
         * @param {HTMLElement|jQuery|string} el  wrapper .ui-slider или сам input
         * @param {number} value
         */
        set(el, value) {
            const $input = this._resolveInput(el);
            if (!$input.length) return;

            const min = parseFloat($input.attr('min') ?? '0');
            const max = parseFloat($input.attr('max') ?? '100');
            const v = Number(value);
            const clamped = isFinite(v) ? Math.min(Math.max(v, min), max) : min;

            $input.val(clamped);
            this._updateVisuals($input);
        },

        /**
         * Получить текущее значение.
         * @param {HTMLElement|jQuery|string} el
         * @returns {number|null}
         */
        get(el) {
            const $input = this._resolveInput(el);
            if (!$input.length) return null;
            const v = parseFloat($input.val());
            return isFinite(v) ? v : null;
        },

        /**
         * Установить диапазон (min, max).
         * @param el
         * @param {number} min
         * @param {number} max
         */
        setRange(el, min, max) {
            const $input = this._resolveInput(el);
            if (!$input.length) return;

            const a = Number(min);
            const b = Number(max);

            if (!isFinite(a) || !isFinite(b) || a === b) {
                console.warn('UISlider.setRange: invalid range');
                return;
            }

            const newMin = Math.min(a, b);
            const newMax = Math.max(a, b);

            $input.attr('min', newMin);
            $input.attr('max', newMax);

            // клатчим текущее значение в новый диапазон
            const v = this.get($input) ?? newMin;
            const clamped = Math.min(Math.max(v, newMin), newMax);
            $input.val(clamped);

            this._updateVisuals($input);
        },

        /**
         * Включить/выключить disabled.
         * @param el
         * @param {boolean} disabled
         */
        setDisabled(el, disabled) {
            const $input = this._resolveInput(el);
            if (!$input.length) return;

            $input.prop('disabled', !!disabled);
            this._updateVisuals($input);
        },

        /**
         * Разрешает input из wrapper или селектора.
         * @param el
         * @returns {jQuery}
         * @private
         */
        _resolveInput(el) {
            let $el = $(el);
            if (!$el.length) return $();

            if ($el.is('input[type=range].ui-slider__input')) {
                return $el;
            }

            if ($el.hasClass('ui-slider')) {
                return $el.find('input[type=range].ui-slider__input').first();
            }

            const $asWrapper = $el.find('input[type=range].ui-slider__input').first();
            if ($asWrapper.length) return $asWrapper;

            return $();
        },

        /**
         * Демонстрационные кнопки на странице примера.
         * В реальных проектах можно не использовать.
         * @private
         */
        _bindDemoControls() {
            const self = this;
            const $sliderDemo = $('#slider-demo');

            $('#btn-set-10').on('click', function () {
                self.set($sliderDemo, 10);
            });

            $('#btn-set-50').on('click', function () {
                self.set($sliderDemo, 50);
            });

            $('#btn-set-90').on('click', function () {
                self.set($sliderDemo, 90);
            });

            $('#btn-disable').on('click', function () {
                self.setDisabled($sliderDemo, true);
            });

            $('#btn-enable').on('click', function () {
                self.setDisabled($sliderDemo, false);
            });
        }
    };

    // Экспорт в глобальный namespace
    window.UIKit = window.UIKit || {};
    window.UIKit.Slider = UISlider;

    $(function () {
        UISlider.init();
        console.log('UISlider: init done');
    });

})(window.jQuery);
