(function($) {
    $.fn.accordionAnimated = function() {

        var
            $accordion = this,
            $items = $accordion.find('> dd'),
            $targets = $items.find('.content'),
            options = {
                active_class: 'active', // class for items when active
                multi_expand: false, // whether mutliple items can expand
                speed: 500, // speed of animation
                toggleable: true // setting to false only closes accordion panels when another is opened
            };

        $.extend(options, Foundation.utils.data_options($accordion));

        $items.each(function(i) {
            $(this).find('a:eq(0)').on('click.accordion', function() {
                if (!options.toggleable && $items.eq(0).hasClass(options.active_class)) {
                    return;
                }

                if (!options.multi_expand) {
                    $targets.not(':eq(' + i + ')')
                        .stop(true, true)
                        .slideUp(options.speed, function(){
                            var _this = $(this),
                                link = _this.parent().find('a:eq(0)');
                                link.removeClass("active");
                        });
                }

                $targets.eq(i)
                    .stop(true, true)
                    .slideToggle(options.speed, function() {
                        if (options.multi_expand == false) {
                            var _this = $(this),
                                link = _this.parent().find('a:eq(0)'),
                                pos = link.offset().top,
                                isMediumAndUp = function() {
                                    return matchMedia(Foundation.media_queries['medium']).matches && matchMedia(Foundation.media_queries.large).matches;
                                },
                                menubar = isMediumAndUp() ? $('.top-bar').height() : $("#menu-wrapper-mobile").height();
                            if (_this.hasClass(options.active_class)) {
                                link.addClass("active").focus();
                                
                                $('html, body').animate({
                                    scrollTop: pos - (menubar + 1) //add 1 for top bar shadow
                                }, options.speed);

                            }
                            else{
                                link.removeClass("active").blur();
                            }
                        }
                    });

            });
        });
    };
}(jQuery));
