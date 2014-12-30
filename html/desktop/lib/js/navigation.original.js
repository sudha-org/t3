(function() {
    try {
        $('.nav-link').click(function() {
            var height = $('body').height() + 'px'
            var $el = $(this);
            if (($(this).hasClass('selected') || $(this).hasClass('no-sub-menu')) && $(this).closest('.mob-nav').length == 0) {
                closeSubMenu();
            } else {
                if ($('.off-canvas-navigation').is(':visible')) {
                    $('.section-nav').hide();

                    $('.nav-menu-arrow').hide();
                    $('.nav-link').removeClass('selected');
                    $('.nav-link').removeClass('active');
                    $el.addClass('selected active');

                    $('#' + $el.attr('id').replace('-link', '')).fadeTo(500, 1);
                    $('#' + $el.attr('id').replace('-link-mob', '')).fadeTo(500, 1);
                    $el.addClass('selected');
                } else {
                    $('.nav-menu-arrow').hide();
                    $('.nav-link').removeClass('selected');
                    $('.nav-link').removeClass('active');
                    $el.addClass('selected active');

                    $('.section-nav').hide();
                    $('#' + $el.attr('id').replace('-link', '')).show();
                    $('#' + $el.attr('id').replace('-link-mob', '')).show();

                    $el.addClass('selected');

                    $('.breadcrumb-wrapper').removeClass('bring-to-top').fadeTo(100, 0, function() {
                        $('body').addClass('fixed');
                        $('.sub-nav-wrapper').addClass('bring-to-top open');
                        $('.sub-nav-wrapper').stop();
                        $('.sub-nav-wrapper').animate({
                            'height': height
                        }, 500);
                    });
                }
            }
        });

        $('#menu-wrapper-mobile-up ul.sub-menu-lev-1 li.menu-item').click(function() {
            showSubMenu($(this));
        });

        $('#menu-wrapper-mobile-up ul.sub-menu-lev-1 li.menu-item').hoverIntent(function() {
            showSubMenu($(this));
        });

        $('.mob-nav > .sub-nav-wrapper-mob > .sub-navigation > .section-nav > .sub-menu-lev-1 > li > a').click(function() {
            $('body').removeClass('fixed');
        });

        $('#menu-wrapper-mobile-up .get-quote-button').click(function() {
            if ($(this).next().is(':visible')) {
                $(this).next().hide();
            } else {
                $(this).next().show();
            }
        });

        $('#mob-quote-close-wrapper').click(function() {
            $('body').css('overflow', 'auto');
        });

        $('.menu-button-quote-mobile').click(function() {
            $('body').css('overflow', 'hidden');
        });

        var mobWidth = 640;
        var tabWidth = 860;
        $('.menu-button-mobile, .menu-close-mobile').click(function() {
            if ($(this).hasClass('open')) {

                $('.content-container').css('border-right', 'none')
                $('.menu-button-mobile, .menu-close-mobile').removeClass('open');
                $('.menu-close-mobile').hide();
                $('.menu-button-mobile').show();

                $('.content-container').animate({
                    'right': 0
                }, 500);
                $('.sub-menu-lev-2 li').hide(500);
                $('.sub-menu-lev-1 > li > a').removeClass('red').removeClass('selected');

                $('#cover-levels-numbers-container, .active-arrow').removeClass('send-to-bottom');
                $('.active-arrow').css('display', 'block');
            } else {
                $('.content-container').css('border-right', '1px solid #cccccc')
                $('html, body').animate({
                    scrollTop: 0
                }, 0);
                $('.nav-menu-arrow').hide();
                $('.nav-link').removeClass('selected');
                $('.nav-link').removeClass('active');
                $('#product-nav-link-mob').addClass('selected active');

                $('.section-nav').hide();
                $('#product-nav-mob').show();

                $('.menu-button-mobile, .menu-close-mobile').addClass('open');
                $('.menu-close-mobile').show();
                $('.menu-button-mobile').hide();
                var moveTo = window.innerWidth + 'px';

                if (window.innerWidth >= mobWidth && window.innerWidth < tabWidth) {
                    moveTo = window.innerWidth * .8 + 'px';
                    $('.off-canvas-navigation').css('margin-left', window.innerWidth * .2)
                } else if (window.innerWidth < mobWidth || window.innerWidth >= tabWidth) {
                    $('.off-canvas-navigation').css('margin-left', 0)
                }
                $('.content-container').animate({
                    'right': moveTo
                }, 500);
                $('#cover-levels-numbers-container, .active-arrow').addClass('send-to-bottom');
                $('.active-arrow').css('display', 'none');
            }
        });

        $('.mob-nav .sub-menu-wrapper > .mob-mav-section-header').click(function() {
            if (!$(this).hasClass('selected')) {
                $('.sub-menu-lev-2-wrapper').hide(500);
                $('.mob-mav-section-header').removeClass('red').removeClass('selected');
                $(this).addClass('red selected');
                $(this).next('.sub-menu-lev-2-wrapper').show(500);
            } else {
                $('.sub-menu-lev-2-wrapper').hide(500);
                $('.mob-mav-section-header').removeClass('red').removeClass('selected');
            }
        });

        $('#mob-quote-close-wrapper').hover(function() {
            $('#mob-quote-close-off').hide();
            $('#mob-quote-close-on').show();
        }, function() {
            $('#mob-quote-close-off').show();
            $('#mob-quote-close-on').hide();
        });


        $('.products-bc').click(function(e) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 500, function() {
                $('#product-nav-link').click();
            });
        });


        $(document).keyup(function(e) {
            if (e.keyCode == 27) {
                closeSubMenu();
            }
        });

        $(document).mouseup(function(e) {
            var ignoreContainer1 = $(".sub-navigation");
            var ignoreContainer2 = $(".nav-links");
            var ignoreContainer3 = $('.get-quote-button');
            if ($('.sub-nav-wrapper').hasClass('open')) {
                if (!ignoreContainer1.is(e.target) && !ignoreContainer2.is(e.target) && !ignoreContainer3.is(e.target) && ignoreContainer1.has(e.target).length === 0 && ignoreContainer2.has(e.target).length === 0 && ignoreContainer3.has(e.target).length === 0) {
                    closeSubMenu();
                }
            }
            if ($('.get-a-quote-menu').is(':visible')) {
                if (!ignoreContainer3.is(e.target) && ignoreContainer3.has(e.target).length === 0) {
                    $('.get-a-quote-menu').hide();
                }
            }
        });

        function closeSubMenu() {
            if ($('.content-container').css('right') == 'auto' || parseInt($('.content-container').css('right')) == 0) {
                $('.sub-nav-wrapper').stop();
                $('.sub-nav-wrapper').animate({
                    'height': '0px'
                }, 500, function() {
                    $('.nav-link').removeClass('selected');
                    $('.breadcrumb-wrapper').addClass('bring-to-top').fadeTo(100, 1);
                    $('body').removeClass('fixed');
                    $('.sub-nav-wrapper').removeClass('bring-to-top');
                    $('.sub-nav-wrapper').removeClass('open');

                    $('ul.sub-menu-lev-1 li.menu-item').removeClass('selected');
                    $('ul.sub-menu-lev-1 li.menu-item a').removeClass('red');
                    $('.sub-menu-lev-2-wrapper').hide();

                    $('.nav-link').removeClass('selected');
                    $('.nav-link').removeClass('active');
                    $('.init-active').addClass('active');
                });
            }
        }

        function showSubMenu($el) {
            if ($el.attr('id')) {
                $('a', 'ul.sub-menu-lev-1 li.menu-item').removeClass('red');
                $('a', $el).addClass('red');
                $('.shadow-left-wrapper').fadeTo(500, 1);
                //slide arrow
                var pos = $el.data('pos') + '%';
                var subMenuitem = '#sub-' + $el.attr('id');
                $('.nav-menu-arrow').stop();
                $('.nav-menu-arrow').animate({
                    'top': pos
                }, 500);
                $('.nav-menu-arrow').show();

                $('.sub-menu-lev-2-wrapper').hide();
                $(subMenuitem).fadeTo(1000, 1);
                $el.addClass('selected');

                var id = $el.attr('id');
                // $('#default-promo-container').fadeTo(0, 1); 
                if(id.indexOf('home') > -1){
                    if(!$('#home-promo-container').is(':visible')) {
                        $('.menu-promo-container').hide();
                        $('#home-promo-container').fadeTo(500, 1);
                    }
                }
                else if(id.indexOf('pet') > -1){
                    if(!$('#pet-promo-container').is(':visible')) {
                        $('.menu-promo-container').hide();
                        $('#pet-promo-container').fadeTo(500, 1);
                    }
                }
                else if(id.indexOf('travel') > -1){
                    if(!$('#travel-promo-container').is(':visible')) {
                        $('.menu-promo-container').hide();
                        $('#travel-promo-container').fadeTo(500, 1);
                    }
                }
                else if(id.indexOf('life') > -1){
                    if(!$('#life-promo-container').is(':visible')) {
                        $('.menu-promo-container').hide();
                        $('#life-promo-container').fadeTo(500, 1);
                    }
                }
                else if(id.indexOf('select') > -1){
                    if(!$('#select-promo-container').is(':visible')) {
                        $('.menu-promo-container').hide();
                        $('#select-promo-container').fadeTo(500, 1);
                    }
                }
                else if(id.indexOf('breakdown') > -1){
                    if(!$('#breakdown-promo-container').is(':visible')) {
                        $('.menu-promo-container').hide();
                        $('#breakdown-promo-container').fadeTo(500, 1);
                    }
                } else {
                    if(!$('#car-promo-container').is(':visible')) {
                        $('.menu-promo-container').hide();
                        $('#default-promo-container').fadeTo(500, 1); 
                    }
                }
            }
        }

        var width = $(window).width;
        $(window).resize(function() {
            if ($(this).width() != width) {
                width = $(this).width();
                if ($('.content-container').css('right') != 'auto' && $('.content-container').css('right') != 0) {
                    if ($('.menu-button-mobile').hasClass('open')) {
                        $('.menu-button-mobile').removeClass('open');
                        $('.content-container').animate({
                            'right': 0
                        }, 500);
                        $('body').removeClass('fixed');
                        $('#menu-placeholder').remove();
                    }
                    $('.sub-menu-lev-2 li').hide(500);
                    $('.sub-menu-lev-1 > li > a').removeClass('red').removeClass('selected');
                    $('.menu-close-mobile').hide();
                    $('.menu-button-mobile').show();
                } else {
                    closeSubMenu();
                }
            }
        });
        /*CHANGING BEHAVIOUR OF MOBILE MENU.*/
        /*$(window).scroll(function() {
            if ($(window).scrollTop() > 100) {
                $('.mob-top-nav').hide();
                $('.mob-scroll-nav').show();
            } else {
                $('.mob-scroll-nav').hide();
                $('.mob-top-nav').show();
            }
        });*/
        $(document).ready(function() {
            if ($(window).scrollTop() > 100) {
                //$('.mob-top-nav').hide();
                $('.mob-scroll-nav').show();
            } /*else {
                $('.mob-scroll-nav').hide();
                $('.mob-top-nav').show();
            }*/
        });
    } catch (ex) {
        console.log(ex);
    }
})();
