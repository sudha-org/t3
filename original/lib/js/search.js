(function() {
    var cx = '014485696281329782311:yinpztexg2o';
    var gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
        '//www.google.com/cse/cse.js?cx=' + cx;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(gcse, s);
})();
(function() {
    var nav = $(".top-bar"),
    activemenuitem = $("#search-nav-link"),
    content = $(".content-container"),
    floatingdiv = document.createElement("div"),
    mainmenu = document.getElementById("menu-wrapper-mobile-up");
    if (nav.length > 0) {
        nav.remove();
    }
    if(activemenuitem.length > 0){
      activemenuitem.addClass("selected active");
    }
    /*make sticky
    content.css({"padding-top": "200px"});
    floatingdiv.setAttribute("class", "contain-to-grid sticky fixed");
    mainmenu.className += " contain-to-grid sticky fixed";*/
})();