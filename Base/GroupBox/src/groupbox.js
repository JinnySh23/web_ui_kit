// groupbox.js
// UI GroupBox (Qt GroupBox-style)
// Требует jQuery 3.7.0+

(function ($) {
    if (!$) {
        console.error('UIGroupBox: jQuery not found');
        return;
    }

    const UIGroupBox = {
        init() {
            const self = this;

            // Инициализация всех по атрибуту
            $('[data-ui-groupbox]').each(function () {
                self._initOne($(this));
            });

            // Клик по заголовку для сворачивания/разворачивания
            $(document).on('click', '.ui-groupbox_collapsible .ui-groupbox__header', function (e) {
                // Не даём кликать, если disabled
                const $wrap = $(this).closest('.ui-groupbox');
                if ($wrap.hasClass('ui-groupbox_disabled')) return;

                // Если кликнули по кнопке — всё равно это тот же toggle
                UIGroupBox.toggle($wrap);
            });

            // Демонстрация
            this._bindDemoControls();
        },

        _initOne($wrap) {
            // Если data-collapsible="1" — обеспечиваем класс
            const isCollapsible = $wrap.data('collapsible');
            if (isCollapsible) {
                $wrap.addClass('ui-groupbox_collapsible');
            }

            // Disabled из класса
            if ($wrap.hasClass('ui-groupbox_disabled')) {
                // просто убедимся, что тело "отключено" логически (визуально уже стилизовано)
                // здесь можно, например, отключать интерактив внутри, но пока не лезем
            }
        },

        _resolveWrapper(el) {
            let $el = $(el);
            if (!$el.length) return $();

            if ($el.hasClass('ui-groupbox')) {
                return $el.first();
            }

            const $parent = $el.closest('.ui-groupbox');
            if ($parent.length) return $parent.first();

            return $();
        },

        /**
         * Свернуть.
         * @param el
         */
        collapse(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;
            $wrap.addClass('ui-groupbox_collapsed');
        },

        /**
         * Развернуть.
         * @param el
         */
        expand(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;
            $wrap.removeClass('ui-groupbox_collapsed');
        },

        /**
         * Переключить состояние.
         * @param el
         */
        toggle(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            const isCollapsed = $wrap.hasClass('ui-groupbox_collapsed');
            if (isCollapsed) {
                this.expand($wrap);
            } else {
                this.collapse($wrap);
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

            $wrap.toggleClass('ui-groupbox_disabled', !!disabled);
        },

        /**
         * Поменять заголовок.
         * @param el
         * @param {string} title
         */
        setTitle(el, title) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            const $title = $wrap.find('.ui-groupbox__title').first();
            if ($title.length) {
                $title.text(title);
            }
        },

        /**
         * Поменять подзаголовок.
         * @param el
         * @param {string} subtitle
         */
        setSubtitle(el, subtitle) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            let $sub = $wrap.find('.ui-groupbox__subtitle').first();
            if (!$sub.length && subtitle) {
                const $titles = $wrap.find('.ui-groupbox__titles').first();
                if ($titles.length) {
                    $sub = $('<div class="ui-groupbox__subtitle"></div>');
                    $titles.append($sub);
                }
            }
            if ($sub.length) {
                $sub.text(subtitle ?? '');
            }
        },

        /* ===== ДЕМО ===== */

        _bindDemoControls() {
            const self = this;
            const $demo = $('#groupbox-js-demo');

            $('#btn-gb-collapse').on('click', () => self.collapse($demo));
            $('#btn-gb-expand').on('click', () => self.expand($demo));
            $('#btn-gb-toggle').on('click', () => self.toggle($demo));
            $('#btn-gb-disable').on('click', () => self.setDisabled($demo, true));
            $('#btn-gb-enable').on('click', () => self.setDisabled($demo, false));
            $('#btn-gb-title').on('click', () => {
                const cur = $demo.find('.ui-groupbox__title').text() || '';
                const next = cur.includes('Блок управления')
                    ? 'Конфигурация контроллера'
                    : 'Блок управления';
                self.setTitle($demo, next);
            });
        }
    };

    // Экспорт в глобальный namespace
    window.UIKit = window.UIKit || {};
    window.UIKit.GroupBox = UIGroupBox;

    $(function () {
        UIGroupBox.init();
        console.log('UIGroupBox: init done');
    });

})(window.jQuery);
