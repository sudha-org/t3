/*jslint browser: true*/
/*global $, jQuery, wistiaEmbed, alert*/
(function() {
    try {
        var videoCover = $('.video-cover'),
            winwidth = $(window).width(),
            vidplayer = $(".video-player"),
            homeExploreVideo = $(".home-explore-video"),
            closeButtonOverview = $(".close-button-overview"),
            videoWrapper = $('#video-wrapper'),
            isMediumAndUp = function() {
                return matchMedia(Foundation.media_queries['medium']).matches && matchMedia(Foundation.media_queries.large).matches;
            };

        if (!isMediumAndUp()) {
            vidplayer.hide();
        } else {
            vidplayer.css({
                opacity: 0
            });
        }
        homeExploreVideo.css({
            opacity: 0
        });
        closeButtonOverview.css({
            opacity: 0
        });
        // Video for Car Overview

        videoWrapper.on('click', function() {
            if($(this).hasClass('video-start-wrapper')) {
                $(this).removeClass('video-start-wrapper');
                if (!isMediumAndUp()) {
                    $(".video-placeholder, .video-left-panel").hide();
                    vidplayer.show();
                    wistiaEmbed.play();
                    closeButtonOverview.fadeTo(200, 1);
                    closeButtonOverview.css("z-index", "9998");
                    vidplayer.fadeTo(200, 1).css("z-index", "9997");

                } else {
                    //$(this).fadeOut();
                    $("#video-wrapper").addClass("video-open");
                    $(".video-left-panel").removeClass("video-arrow")
                    .fadeTo(200, 0)
                    .animate({
                        width: '0%'
                    }, 1000);

                    $(".video-placeholder").animate({
                            "width": '100%'
                        }, 1000,
                        function() {
                            $(this).hide();
                            vidplayer.css("z-index", "9998")
                            .fadeTo(200, 1,
                                function() {
                                    wistiaEmbed.play();
                                    closeButtonOverview.fadeTo(200, 1)
                                    .css("z-index", "9998");
                                });
                            $("#video-wrapper").css('height', wistiaEmbed.videoHeight());
                        });
                }
            }

        });
        videoWrapper.on('click', '.close-button-overview', function(e) {
            wistiaEmbed.pause();
            $(this).fadeTo(200, 0);
            $("#video-wrapper").removeClass("video-open");
            $(".video-left-panel").addClass("video-arrow")
            .fadeTo(200, 1)
            .css("width", "");
            $(".video-placeholder").css("width", "")
            .show(200);
            if (!isMediumAndUp()) {
                vidplayer.hide();
            } else {
                vidplayer.fadeTo(200, 0);
            }
            //$("#video-wrapper").css('height', '600px');
            vidplayer.css("z-index", "-9998");
            videoWrapper.addClass('video-start-wrapper');
            return false;
        });

        // Slidedown videos with close button for DrivePlus and Home Explore
        $(".play-video").click(function() {
            if ($(this).hasClass("video-open")) {
                $(this).removeClass("video-open");
                $(".slidedown-video-container").animate({
                    "height": "0px"
                }, 1000, function() {
                    $("#wistia_smallPlayButton_25").click();
                });
            } else {
                $(".slidedown-video-container").animate({
                    "height": wistiaEmbed.height()
                }, 1000, function() {
                    if (winwidth > 768) {
                        wistiaEmbed.play();
                    }
                });
                $(this).addClass("video-open");
            }
        });
        $(".close-button").click(function() {
            wistiaEmbed.pause();
            $(".slidedown-video-container").animate({
                "height": "0px"
            }, 1000);
            $(".play-video").removeClass("video-open");
        });
    } catch (ex) {
        console.log(ex);
    }
})();
