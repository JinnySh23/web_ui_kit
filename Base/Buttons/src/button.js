// button.js
// Небольшой модуль для работы с кнопками UI.
// Требует jQuery 3.7.0+

(function ($) {
    if (!$) {
        console.error('UIButton: jQuery not found');
        return;
    }

    const UIButton = {
        /**
         * Инициализация: навешиваем обработчики на элементы с data-атрибутами.
         */
        init() {
            const self = this;

            // Toggle-кнопки: data-ui-btn-toggle
            $(document).on('click', '[data-ui-btn-toggle]', function (e) {
                // Игнор, если disabled
                if (this.disabled) return;
                self.toggle(this);
            });

            // Кнопки с автодемкой loading: data-ui-btn-loading
            // Здесь просто демо: включаем loading на 1.2 сек
            $(document).on('click', '[data-ui-btn-loading]', function (e) {
                const btn = this;
                if (btn.disabled) return;

                self.setLoading(btn, true);

                // Демо-таймер — в реальном коде ты сам снимаешь loading
                setTimeout(function () {
                    self.setLoading(btn, false);
                }, 1200);
            });
        },

        /**
         * Переключает состояние toggle-кнопки.
         * @param {HTMLElement|jQuery} el
         */
        toggle(el) {
            const $btn = $(el);
            const isActive = $btn.hasClass('ui-btn_active');
            $btn.toggleClass('ui-btn_active', !isActive);
            $btn.attr('aria-pressed', !isActive);
        },

        /**
         * Включить / выключить состояние loading.
         * @param {HTMLElement|jQuery} el
         * @param {boolean} isLoading
         */
        setLoading(el, isLoading) {
            const $btn = $(el);

            if (isLoading) {
                if ($btn.hasClass('ui-btn_loading')) return;

                // Запоминаем исходный текст, если ещё не
                if ($btn.data('original-text') == null) {
                    $btn.data('original-text', $btn.html());
                }

                const loadingText = $btn.data('loading-text');
                if (loadingText) {
                    $btn.html(loadingText);
                }

                $btn.addClass('ui-btn_loading');
                $btn.prop('disabled', true);
            } else {
                if (!$btn.hasClass('ui-btn_loading')) return;

                const originalText = $btn.data('original-text');
                if (originalText != null) {
                    $btn.html(originalText);
                }

                $btn.removeClass('ui-btn_loading');
                $btn.prop('disabled', false);
            }
        }
    };

    // Экспортируем в глобальный namespace, чтобы можно было дергать из других файлов
    window.UIKit = window.UIKit || {};
    window.UIKit.Button = UIButton;

    // Автоинициализация при готовности DOM
    $(function () {
        UIButton.init();
        console.log('UIButton: init done');
    });

})(window.jQuery);
