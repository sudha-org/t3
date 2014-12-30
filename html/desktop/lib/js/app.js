(function() {
    //wrapped function in here for anonymous
    $(document).foundation();
    var isMediumAndUp = function() {
            return matchMedia(Foundation.media_queries['medium']).matches && matchMedia(Foundation.media_queries.large).matches;
        },
        topfloatingbar = isMediumAndUp() ? $('.top-bar').height() : $("#menu-wrapper-mobile").height();

    $('.init-hidden').addClass('hidden');

    $('section').on('click', '.scroll-link', function(e) {
        e.preventDefault();
        var linkRef = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(linkRef).offset().top - (topfloatingbar || 80)
        }, 500);
    });


    $('body').on('click', '.close-reveal-modal', function(e){
        e.preventDefault();
        $(this).closest('.reveal-modal').foundation('reveal', 'close');
    });

    
})();
