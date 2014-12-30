$(document).ready(function() {
// Car Discounts 'Show more' code.
    var show = $(".show");
    show.click(function() {
        if (show.hasClass("expanded")) {
            $(".extra-discounts").slideUp();
            show.removeClass("expanded");
            show.text("Show me more");
            show.attr("href","#together");
        } else {
            $(".extra-discounts").slideDown();
            show.addClass("expanded");
            show.text("Show me less");
            show.attr("href","#extra-discounts");
        }
    });
});