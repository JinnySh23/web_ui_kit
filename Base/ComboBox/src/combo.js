// combo.js
// UI ComboBox (QComboBox-style)
// Требует jQuery 3.7.0+

(function ($) {
    if (!$) {
        console.error('UICombo: jQuery not found');
        return;
    }

    const UICombo = {
        init() {
            const self = this;

            // Инициализация всех комбобоксов
            $('[data-ui-combo]').each(function () {
                self._initOne($(this));
            });

            // Клик по кнопке-значению
            $(document).on('click', '.ui-combo__value', function (e) {
                const $wrap = $(this).closest('.ui-combo');
                if ($wrap.hasClass('ui-combo_disabled')) return;
                e.stopPropagation();
                self.toggle($wrap);
            });

            // Клик по опции
            $(document).on('click', '.ui-combo__option', function (e) {
                const $opt = $(this);
                const $wrap = $opt.closest('.ui-combo');
                if ($wrap.hasClass('ui-combo_disabled')) return;
                e.stopPropagation();

                const value = $opt.data('value');
                self.set($wrap, value);
                self.close($wrap);
            });

            // Клик снаружи — закрыть все
            $(document).on('click', function () {
                self.closeAll();
            });

            // Демка
            this._bindDemoControls();
        },

        _initOne($wrap) {
            const $select = $wrap.find('.ui-combo__select').first();
            const $valueBtn = $wrap.find('.ui-combo__value').first();
            const $dropdown = $wrap.find('.ui-combo__dropdown').first();

            if (!$select.length || !$valueBtn.length || !$dropdown.length) return;

            // Строим список опций из <select>
            $dropdown.empty();
            $select.find('option').each(function () {
                const $o = $(this);
                const val = $o.attr('value');
                const text = $o.text();
                const $btn = $('<button type="button" class="ui-combo__option"></button>');
                $btn.text(text);
                $btn.attr('data-value', val);
                if ($o.is(':selected')) {
                    $btn.addClass('ui-combo__option_selected');
                }
                $dropdown.append($btn);
            });

            // Установим начальное отображаемое значение
            const currentVal = $select.val();
            const currentText = $select.find('option:selected').text();
            $valueBtn.text(currentText);
            $valueBtn.data('value', currentVal);

            // disabled синхронизация
            if ($select.prop('disabled') || $wrap.hasClass('ui-combo_disabled')) {
                this.setDisabled($wrap, true);
            }
        },

        _resolveWrapper(el) {
            let $el = $(el);
            if (!$el.length) return $();

            if ($el.hasClass('ui-combo')) {
                return $el.first();
            }

            const $parent = $el.closest('.ui-combo');
            if ($parent.length) return $parent.first();

            return $();
        },

        /**
         * Получить значение.
         * @param el
         * @returns {string|null}
         */
        get(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return null;
            const $select = $wrap.find('.ui-combo__select').first();
            if (!$select.length) return null;
            return $select.val();
        },

        /**
         * Установить значение (по value).
         * @param el
         * @param {string} value
         */
        set(el, value) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            const $select = $wrap.find('.ui-combo__select').first();
            const $valueBtn = $wrap.find('.ui-combo__value').first();
            const $dropdown = $wrap.find('.ui-combo__dropdown').first();

            if (!$select.length || !$valueBtn.length || !$dropdown.length) return;

            // Меняем нативный select
            $select.val(value);

            // Обновляем текст
            const $selectedOpt = $select.find('option:selected').first();
            if ($selectedOpt.length) {
                $valueBtn.text($selectedOpt.text());
                $valueBtn.data('value', $selectedOpt.attr('value'));
            }

            // Обновляем выделение в dropdown
            $dropdown.find('.ui-combo__option').each(function () {
                const $o = $(this);
                const v = $o.data('value');
                $o.toggleClass('ui-combo__option_selected', v == value);
            });

            // Триггерим change у select, чтобы форма/листенеры реагировали
            $select.trigger('change');
        },

        /**
         * Открыть выпадающий список.
         * @param el
         */
        open(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;
            if ($wrap.hasClass('ui-combo_disabled')) return;

            // Закрываем другие
            this.closeAll();
            $wrap.addClass('ui-combo_open');
        },

        /**
         * Закрыть.
         * @param el
         */
        close(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;
            $wrap.removeClass('ui-combo_open');
        },

        /**
         * Закрыть все комбобоксы.
         */
        closeAll() {
            $('.ui-combo_open').removeClass('ui-combo_open');
        },

        /**
         * Переключить открыто/закрыто.
         * @param el
         */
        toggle(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;
            if ($wrap.hasClass('ui-combo_open')) {
                this.close($wrap);
            } else {
                this.open($wrap);
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

            const $select = $wrap.find('.ui-combo__select').first();
            const $valueBtn = $wrap.find('.ui-combo__value').first();

            $wrap.toggleClass('ui-combo_disabled', !!disabled);
            $select.prop('disabled', !!disabled);
            $valueBtn.toggleClass('ui-combo__value_disabled', !!disabled);
        },

        /* ===== ДЕМО ===== */

        _bindDemoControls() {
            const self = this;
            const $demo = $('#combo-js-demo');
            const $out = $('#combo-js-output');

            $('#btn-cb-tcp').on('click', () => self.set($demo, 'tcp'));
            $('#btn-cb-udp').on('click', () => self.set($demo, 'udp'));
            $('#btn-cb-serial').on('click', () => self.set($demo, 'serial'));

            $('#btn-cb-get').on('click', () => {
                const v = self.get($demo);
                $out.text('Текущее значение: ' + (v ?? 'нет'));
            });

            $('#btn-cb-open').on('click', () => self.open($demo));
            $('#btn-cb-close').on('click', () => self.close($demo));

            $('#btn-cb-disable').on('click', () => self.setDisabled($demo, true));
            $('#btn-cb-enable').on('click', () => self.setDisabled($demo, false));
        }
    };

    // Экспорт
    window.UIKit = window.UIKit || {};
    window.UIKit.Combo = UICombo;

    $(function () {
        UICombo.init();
        console.log('UICombo: init done');
    });

})(window.jQuery);
