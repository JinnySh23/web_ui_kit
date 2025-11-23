// tabs.js
// UI Tabs (Qt TabWidget-style)
// Требует jQuery 3.7.0+

(function ($) {
    if (!$) {
        console.error('UITabs: jQuery not found');
        return;
    }

    const UITabs = {
        init() {
            const self = this;

            // Инициализация всех табов
            $('[data-ui-tabs]').each(function () {
                self._initOne($(this));
            });

            // Клик по вкладке
            $(document).on('click', '.ui-tabs__tab', function () {
                const $tab = $(this);
                const $wrap = $tab.closest('.ui-tabs');
                if ($tab.hasClass('ui-tabs__tab_disabled') || $tab.is(':disabled')) return;

                const id = $tab.data('tab-id');
                if (!id) return;

                self.setActive($wrap, id);
            });

            // Демка
            this._bindDemoControls();
        },

        _initOne($wrap) {
            const $tabs = $wrap.find('.ui-tabs__tab');
            const $panels = $wrap.find('.ui-tabs__panel');

            if (!$tabs.length || !$panels.length) return;

            // Определяем, какая вкладка активна по data-active="1" или первая
            let $active = $tabs.filter('[data-active="1"]').first();
            if (!$active.length) {
                $active = $tabs.first();
            }

            const activeId = $active.data('tab-id');
            if (activeId) {
                this.setActive($wrap, activeId, true);
            }
        },

        _resolveWrapper(el) {
            let $el = $(el);
            if (!$el.length) return $();

            if ($el.hasClass('ui-tabs')) {
                return $el.first();
            }

            const $parent = $el.closest('.ui-tabs');
            if ($parent.length) return $parent.first();

            return $();
        },

        /**
         * Активировать вкладку по id.
         * @param el .ui-tabs или любой элемент внутри
         * @param {string} tabId
         * @param {boolean} [silent] не вызывать custom-события
         */
        setActive(el, tabId, silent) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            const $tabs = $wrap.find('.ui-tabs__tab');
            const $panels = $wrap.find('.ui-tabs__panel');

            const $tab = $tabs.filter((_, t) => $(t).data('tab-id') == tabId).first();
            const $panel = $panels.filter((_, p) => $(p).data('tab-id') == tabId).first();

            if (!$tab.length || !$panel.length) return;
            if ($tab.hasClass('ui-tabs__tab_disabled') || $tab.is(':disabled')) return;

            // Снимаем активность со всех
            $tabs.removeClass('ui-tabs__tab_active').removeAttr('data-active');
            $panels.removeClass('ui-tabs__panel_active');

            // Вешаем на нужную
            $tab.addClass('ui-tabs__tab_active').attr('data-active', '1');
            $panel.addClass('ui-tabs__panel_active');

            if (!silent) {
                // Кастомное событие — вдруг пригодится
                $wrap.trigger('uitabs:change', {
                    tabId,
                    tab: $tab[0],
                    panel: $panel[0]
                });
            }
        },

        /**
         * Получить id активной вкладки.
         * @param el
         * @returns {string|null}
         */
        getActive(el) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return null;

            const $tab = $wrap.find('.ui-tabs__tab_active').first();
            if (!$tab.length) return null;

            return $tab.data('tab-id') ?? null;
        },

        /**
         * Включить/выключить вкладку.
         * @param el
         * @param {string} tabId
         * @param {boolean} disabled
         */
        setDisabled(el, tabId, disabled) {
            const $wrap = this._resolveWrapper(el);
            if (!$wrap.length) return;

            const $tabs = $wrap.find('.ui-tabs__tab');
            const $tab = $tabs.filter((_, t) => $(t).data('tab-id') == tabId).first();
            if (!$tab.length) return;

            $tab.toggleClass('ui-tabs__tab_disabled', !!disabled);
            $tab.prop('disabled', !!disabled);

            // Если отключили активную вкладку — переключаемся на первую доступную
            if (disabled && $tab.hasClass('ui-tabs__tab_active')) {
                const $next = $tabs.not('.ui-tabs__tab_disabled').not(':disabled').first();
                if ($next.length) {
                    const nextId = $next.data('tab-id');
                    if (nextId) {
                        this.setActive($wrap, nextId);
                    }
                }
            }
        },

        /* ===== ДЕМО ===== */

        _bindDemoControls() {
            const self = this;
            const $demo = $('#tabs-js-demo');
            const $out = $('#tabs-js-output');

            $('#btn-tab-status').on('click', () => self.setActive($demo, 'status'));
            $('#btn-tab-config').on('click', () => self.setActive($demo, 'config'));
            $('#btn-tab-diag').on('click', () => self.setActive($demo, 'diag'));

            $('#btn-tab-get').on('click', () => {
                const id = self.getActive($demo);
                $out.text('Активная вкладка: ' + (id ?? 'нет'));
            });

            $('#btn-tab-disable-diag').on('click', () => {
                self.setDisabled($demo, 'diag', true);
            });

            $('#btn-tab-enable-diag').on('click', () => {
                self.setDisabled($demo, 'diag', false);
            });
        }
    };

    // Экспорт
    window.UIKit = window.UIKit || {};
    window.UIKit.Tabs = UITabs;

    $(function () {
        UITabs.init();
        console.log('UITabs: init done');
    });

})(window.jQuery);
