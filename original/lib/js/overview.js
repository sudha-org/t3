$(document).ready(function() {
    
    // Carousel Initialisation.
    $('.carousel').slick();

    var coverTypeCount = $('.cover-type').length,
    coverbuttons = $(".cover-levels-overview .icon-button"),
    covertype = $(".cover-type"),
    coverlevels = covertype.find(".cover-levels"),
    animatearrow = function() {
        var noOfButtons = coverbuttons.length,
        iterator = 100 / (noOfButtons - 1),
        positions = [];
        for (var i = 0; i < noOfButtons; i++) {
            positions.push(i*iterator);
        };
        return positions;
    };
    var coverLevel1 = $(".cover-level-overview-1");
    var coverLevel2 = $(".cover-level-overview-2");
    var coverLevel3 = $(".cover-level-overview-3");
    var coverLevel4 = $(".cover-level-overview-4");
    var coverLevel5 = $(".cover-level-overview-5");
    var coverButton1 = $("cover-button-1");
    var coverButton2 = $("cover-button-2");
    var coverButton3 = $("cover-button-3");
    var coverButton4 = $("cover-button-4");
    var coverButton5 = $("cover-button-5");

    coverLevel1.show();
    coverLevel2.hide();
    coverLevel3.hide();
    coverLevel4.hide();
    coverLevel5.hide();
    // $(".arrow-top").animate({"left":"0%"}, "slow");
    $(".cover-button-1").addClass("active");

    if(coverTypeCount < 5) {
    // Car Landing Page: Cover Level Select Click Events.
    
    $(".cover-button-1").click(function(){
        $(this).addClass('active');
        $(".cover-button-2").removeClass('active');
        $(".cover-button-3").removeClass('active');
        $(".arrow-top").animate({"left":"0%"}, "slow");
        $(".cover-level-overview-1").show();
        $(".cover-level-overview-2").hide();
        $(".cover-level-overview-3").hide();
    });
    $(".cover-button-2").click(function(){
        $(this).addClass('active');
        $(".cover-button-1").removeClass('active');
        $(".cover-button-3").removeClass('active');
        $(".arrow-top").animate({"left":"50%"}, "slow"); //.css('left', '50%');
        $(".cover-level-overview-1").hide();
        $(".cover-level-overview-2").show();
        $(".cover-level-overview-3").hide();
    });
    // If there are only two cover levels to show, use buttons 1 and 3.
    $(".cover-button-3").click(function(){
        $(this).addClass('active');
        $(".cover-button-1").removeClass('active');
        $(".cover-button-2").removeClass('active');
        $(".arrow-top").animate({"left":"100%"}, "slow");
        $(".cover-level-overview-1").hide();
        $(".cover-level-overview-2").hide();
        $(".cover-level-overview-3").show();

    });
    $(".home-button-1").click(function(){
        $(".cover-levels-arrow").removeClass("green-background-medium-up");
        $(".cover-levels-arrow").removeClass("red-dark-background-medium-up");
        $(".home-cover-type-arrow").removeClass("green-background-medium-up");
        $(".home-cover-type-arrow").removeClass("red-dark-background-medium-up");
        $(".home-button-2").css("color", "");
    });
    $(".home-button-2").click(function(){
        $(".cover-levels-arrow").addClass("green-background-medium-up");
        $(".cover-levels-arrow").removeClass("red-dark-background-medium-up");
        $(".home-cover-type-arrow").addClass("green-background-medium-up");
        $(".home-cover-type-arrow").removeClass("red-dark-background-medium-up");
        $(this).css("color", "#b6d323");
        
    });
    $(".home-button-3").click(function(){
        $(".cover-levels-arrow").removeClass("green-background-medium-up");
        $(".cover-levels-arrow").addClass("red-dark-background-medium-up");
        $(".home-button-2").css("color", "");
    });

    } else {
        coverbuttons.click(function() {
            var _index = coverbuttons.index(this),
            bgcolor = $(covertype[_index]).css("background-color"),
            coverlevel = $(coverlevels[_index]);
            pos = animatearrow();
            $(".cover-levels-overview").find(".arrow-top")
            .animate({"left":pos[_index] + "%"}, "slow");
            //$(".arrow-bottom-red").css({"background-color": bgcolor})
            coverlevels.not(coverlevel).hide();
            coverlevel.show();
            coverbuttons.not(this).removeClass("active").css("color", "");
            $(this).css("color",bgcolor);
             $(this).addClass("active");
        });
    }
});


